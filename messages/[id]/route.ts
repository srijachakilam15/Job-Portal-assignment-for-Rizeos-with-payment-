import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { Message, Conversation } from '@/models/Message';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Verify user is part of the conversation
    const conversation = await Conversation.findById(params.id);
    if (!conversation || !conversation.participants.includes(session.user.id)) {
      return NextResponse.json(
        { error: 'Conversation not found or access denied' },
        { status: 404 }
      );
    }

    // Fetch messages for the conversation
    const messages = await Message.find({
      $or: [
        { sender: { $in: conversation.participants }, recipient: { $in: conversation.participants } }
      ]
    })
    .populate('sender', 'name profile.avatar')
    .populate('recipient', 'name profile.avatar')
    .populate('replyTo')
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

    // Mark messages as read
    await Message.updateMany(
      {
        recipient: session.user.id,
        sender: { $in: conversation.participants },
        read: false
      },
      {
        read: true,
        readAt: new Date()
      }
    );

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total: messages.length,
      },
    });
  } catch (error) {
    console.error('Messages fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
