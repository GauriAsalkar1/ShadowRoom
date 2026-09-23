const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpiry: Date,
  resetPasswordToken: String,
  resetPasswordExpiry: Date,
  lastActive: {
    type: Date,
    default: Date.now
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: String,
  savedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user'
},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Don't return password in queries
userSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.verificationToken;
    delete ret.verificationTokenExpiry;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpiry;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);