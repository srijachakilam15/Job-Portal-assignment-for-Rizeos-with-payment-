import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'voice', 'video'],
    default: 'text',
  },
  attachments: [{
    url: String,
    type: String,
    size: Number,
    name: String,
  }],
  read: {
    type: Boolean,
    default: false,
  },
  readAt: Date,
  edited: {
    type: Boolean,
    default: false,
  },
  editedAt: Date,
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
}, {
  timestamps: true,
});

const ConversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
  groupName: String,
  groupAvatar: String,
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  muted: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    mutedUntil: Date,
  }],
  archived: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    archivedAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

// Indexes
MessageSchema.index({ sender: 1, recipient: 1 });
MessageSchema.index({ createdAt: -1 });
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ lastActivity: -1 });

export const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
export const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
