const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  mood: {
    type: String,
    enum: ['angry', 'sad', 'confused', 'happy', 'anxious', 'lonely', 'depressed'],
    required: true
  },
  participants: [{
    tempId: String,
    tempName: String,
    joinedAt: Date,
    leftAt: Date,
    isActive: { type: Boolean, default: true }
  }],
  messages: [{
    content: String,
    senderTempId: String,
    senderName: String,
    timestamp: { type: Date, default: Date.now },
    isSystem: { type: Boolean, default: false },
    isModerated: { type: Boolean, default: false },
    toxicityScore: Number
  }],
  status: {
    type: String,
    enum: ['waiting', 'active', 'ended', 'reported'],
    default: 'waiting'
  },
  reportCount: { type: Number, default: 0 },
  reportedBy: [String],
  createdAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    index: { expires: 0 } // TTL: Auto-delete after expiry
  }
});

// Auto-delete index (MongoDB TTL)
chatSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('ChatSession', chatSessionSchema);