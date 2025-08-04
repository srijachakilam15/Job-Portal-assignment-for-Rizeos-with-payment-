import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { Message, Conversation } from '@/models/Message';
import { z } from 'zod';

const messageSchema = z.object({
  recipient: z.string(),
  content: z.string().min(1, 'Message content is required'),
  type: z.enum(['text', 'image', 'file', 'voice', 'video']).default('text'),
  attachments: z.array(z.object({
    url: z.string(),
    type: z.string(),
    size: z.number(),
    name: z.string(),
  })).optional(),
  replyTo: z.string().optional(),
});

// GET - Fetch conversations
export async function GET(request: NextRequest) {
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
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const conversations = await Conversation.find({
      participants: session.user.id,
      archived: { $not: { $elemMatch: { user: session.user.id } } }
    })
    .populate('participants', 'name profile.avatar')
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'sender',
        select: 'name profile.avatar'
      }
    })
    .sort({ lastActivity: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

    return NextResponse.json({
      conversations,
      pagination: {
        page,
        limit,
        total: conversations.length,
      },
    });
  } catch (error) {
    console.error('Conversations fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// POST - Send message
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = messageSchema.parse(body);

    await dbConnect();

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [session.user.id, validatedData.recipient] },
      isGroup: false,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [session.user.id, validatedData.recipient],
        isGroup: false,
      });
    }

    // Create message
    const message = await Message.create({
      sender: session.user.id,
      recipient: validatedData.recipient,
      content: validatedData.content,
      type: validatedData.type,
      attachments: validatedData.attachments,
      replyTo: validatedData.replyTo,
    });

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastActivity = new Date();
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name profile.avatar')
      .populate('replyTo')
      .lean();

    return NextResponse.json({
      message: 'Message sent successfully',
      data: populatedMessage,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Message send error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
