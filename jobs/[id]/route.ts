import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';
import { z } from 'zod';

const applicationSchema = z.object({
  coverLetter: z.string().optional(),
  resume: z.string().optional(),
  answers: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
});

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Fetch single job
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();

    const job = await Job.findById(params.id)
      .populate('employer', 'name profile.avatar profile.bio company')
      .lean();

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await Job.findByIdAndUpdate(params.id, { $inc: { views: 1 } });

    return NextResponse.json(job);
  } catch (error) {
    console.error('Job fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

// PUT - Update job
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();

    const job = await Job.findById(params.id);
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.employer.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized to update this job' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updatedJob = await Job.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('employer', 'name profile.avatar');

    return NextResponse.json({
      message: 'Job updated successfully',
      job: updatedJob,
    });
  } catch (error) {
    console.error('Job update error:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

// DELETE - Delete job
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();

    const job = await Job.findById(params.id);
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.employer.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized to delete this job' },
        { status: 403 }
      );
    }

    await Job.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: 'Job deleted successfully',
    });
  } catch (error) {
    console.error('Job deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}
