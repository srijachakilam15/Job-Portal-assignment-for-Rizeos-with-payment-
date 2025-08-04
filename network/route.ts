import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

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
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search');
    const role = searchParams.get('role');

    // Build query
    const query: any = { 
      _id: { $ne: session.user.id } // Exclude current user
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'profile.skills': { $regex: search, $options: 'i' } },
        { 'profile.experience.company': { $regex: search, $options: 'i' } },
        { 'profile.experience.position': { $regex: search, $options: 'i' } },
      ];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    // Add connection status (for now, we'll return 'none' for all users)
    // This can be extended later with a connections/network model
    const usersWithStatus = users.map(user => ({
      ...user,
      connectionStatus: 'none'
    }));

    return NextResponse.json({
      users: usersWithStatus,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Network fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
