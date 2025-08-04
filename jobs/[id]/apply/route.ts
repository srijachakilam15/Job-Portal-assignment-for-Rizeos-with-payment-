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

// POST - Apply to job
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'jobseeker') {
      return NextResponse.json(
        { error: 'Only job seekers can apply to jobs' },
        { status: 403 }
      );
    }

    let body = {};
    try {
      body = await request.json();
    } catch {
      // Handle case where no body is sent (simple application)
      body = {};
    }
    
    const validatedData = applicationSchema.parse(body);

    await dbConnect();

    const job = await Job.findById(params.id);
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.status !== 'active') {
      return NextResponse.json(
        { error: 'Job is not accepting applications' },
        { status: 400 }
      );
    }

    // Check if user already applied
    const existingApplication = job.applications.find(
      (app: any) => app.applicant.toString() === session.user.id
    );

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied to this job' },
        { status: 400 }
      );
    }

    // Add application
    const application = {
      applicant: session.user.id,
      coverLetter: validatedData.coverLetter,
      resume: validatedData.resume,
      answers: validatedData.answers,
      appliedAt: new Date(),
      status: 'applied',
    };

    job.applications.push(application);
    await job.save();

    return NextResponse.json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Job application error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

// GET - Get applications for a job (employer only)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();

    const job = await Job.findById(params.id)
      .populate('applications.applicant', 'name email profile.avatar profile.skills profile.experience');
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Only employer or admin can view applications
    if ((job as any).employer.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized to view applications' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      job: {
        _id: job._id,
        title: (job as any).title,
        company: (job as any).company,
      },
      applications: (job as any).applications,
    });
  } catch (error) {
    console.error('Applications fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
