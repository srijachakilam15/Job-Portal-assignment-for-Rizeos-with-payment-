import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';
import { z } from 'zod';

const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  company: z.object({
    name: z.string().min(1, 'Company name is required'),
    logo: z.string().optional(),
    website: z.string().optional(),
    size: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']).optional(),
    industry: z.string().optional(),
  }),
  location: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    remote: z.boolean().default(false),
    hybrid: z.boolean().default(false),
  }),
  salary: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    currency: z.string().default('USD'),
    period: z.enum(['hourly', 'monthly', 'yearly']).default('yearly'),
  }).optional(),
  jobType: z.enum(['full-time', 'part-time', 'contract', 'freelance', 'internship']),
  experience: z.enum(['entry-level', 'mid-level', 'senior-level', 'executive']),
  skills: z.array(z.object({
    name: z.string(),
    required: z.boolean().default(false),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  })),
  requirements: z.array(z.string()),
  benefits: z.array(z.string()),
  category: z.enum([
    'Technology',
    'Marketing',
    'Sales',
    'Design',
    'Finance',
    'Healthcare',
    'Education',
    'Engineering',
    'Human Resources',
    'Legal',
    'Operations',
    'Customer Service',
    'Other'
  ]),
  tags: z.array(z.string()),
  questions: z.array(z.object({
    question: z.string(),
    required: z.boolean().default(false),
    type: z.enum(['text', 'multiple-choice', 'boolean']).default('text'),
    options: z.array(z.string()).optional(),
  })).optional(),
});

// GET - Fetch jobs with filters and pagination
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const jobType = searchParams.get('jobType');
    const experience = searchParams.get('experience');
    const remote = searchParams.get('remote') === 'true';
    const location = searchParams.get('location');
    const minSalary = searchParams.get('minSalary');
    const maxSalary = searchParams.get('maxSalary');

    // Build query
    const query: any = { status: 'active' };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experience) {
      query.experience = experience;
    }

    if (remote) {
      query['location.remote'] = true;
    }

    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } },
        { 'location.country': { $regex: location, $options: 'i' } },
      ];
    }

    if (minSalary || maxSalary) {
      query['salary.min'] = {};
      if (minSalary) query['salary.min'].$gte = parseInt(minSalary);
      if (maxSalary) query['salary.max'] = { $lte: parseInt(maxSalary) };
    }

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('employer', 'name profile.avatar')
        .sort({ featured: -1, urgent: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Job.countDocuments(query),
    ]);

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Jobs fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST - Create new job
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'employer') {
      return NextResponse.json(
        { error: 'Only employers can post jobs' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = jobSchema.parse(body);

    await dbConnect();

    const job = await Job.create({
      ...validatedData,
      employer: session.user.id,
    });

    const populatedJob = await Job.findById(job._id)
      .populate('employer', 'name profile.avatar')
      .lean();

    return NextResponse.json(
      {
        message: 'Job created successfully',
        job: populatedJob,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Job creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
