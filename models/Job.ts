import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  company: {
    name: {
      type: String,
      required: true,
    },
    logo: String,
    website: String,
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    },
    industry: String,
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    city: String,
    state: String,
    country: String,
    remote: {
      type: Boolean,
      default: false,
    },
    hybrid: {
      type: Boolean,
      default: false,
    },
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD',
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly',
    },
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
    required: true,
  },
  experience: {
    type: String,
    enum: ['entry-level', 'mid-level', 'senior-level', 'executive'],
    required: true,
  },
  skills: [{
    name: String,
    required: Boolean,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    },
  }],
  requirements: [String],
  benefits: [String],
  category: {
    type: String,
    required: true,
    enum: [
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
    ],
  },
  tags: [String],
  applications: [{
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['applied', 'reviewing', 'interviewed', 'offered', 'hired', 'rejected'],
      default: 'applied',
    },
    coverLetter: String,
    resume: String,
    answers: [{
      question: String,
      answer: String,
    }],
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    notes: String,
    aiScore: {
      type: Number,
      min: 0,
      max: 100,
    },
  }],
  questions: [{
    question: String,
    required: Boolean,
    type: {
      type: String,
      enum: ['text', 'multiple-choice', 'boolean'],
      default: 'text',
    },
    options: [String],
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'closed', 'filled'],
    default: 'active',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  urgent: {
    type: Boolean,
    default: false,
  },
  expiryDate: Date,
  views: {
    type: Number,
    default: 0,
  },
  aiGenerated: {
    type: Boolean,
    default: false,
  },
  web3Verified: {
    type: Boolean,
    default: false,
  },
  nftReward: {
    enabled: Boolean,
    contractAddress: String,
    tokenId: String,
    metadata: Object,
  },
}, {
  timestamps: true,
});

// Indexes for better performance
JobSchema.index({ title: 'text', description: 'text' });
JobSchema.index({ employer: 1 });
JobSchema.index({ category: 1 });
JobSchema.index({ jobType: 1 });
JobSchema.index({ 'location.city': 1 });
JobSchema.index({ skills: 1 });
JobSchema.index({ status: 1 });
JobSchema.index({ createdAt: -1 });

export default mongoose.models.Job || mongoose.model('Job', JobSchema);
