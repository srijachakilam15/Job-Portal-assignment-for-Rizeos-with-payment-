import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['subscription', 'job_post', 'freelance_payment', 'nft_purchase'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  stripePaymentIntentId: String,
  stripeSessionId: String,
  description: String,
  metadata: Object,
  refundId: String,
  refundAmount: Number,
  relatedJob: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  },
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const SubscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  interval: {
    type: String,
    enum: ['month', 'year'],
    required: true,
  },
  features: [String],
  limits: {
    jobPosts: Number,
    applications: Number,
    connections: Number,
    aiCredits: Number,
  },
  stripePriceId: String,
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
PaymentSchema.index({ user: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ createdAt: -1 });

export const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
export const SubscriptionPlan = mongoose.models.SubscriptionPlan || mongoose.model('SubscriptionPlan', SubscriptionPlanSchema);
