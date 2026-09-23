const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

  title: {
    type: String,
    default: 'Untitled Thought'
  },

  content: {
    type: String,
    required: true
  },

  mood: {
    type: String,
    enum: ['Angry', 'Sad', 'Confused', 'Happy'],
    default: 'Sad'
  },

  type: {
    type: String,
    enum: ['Just Vent', 'Open to Responses'],
    default: 'Just Vent'
  },

  category: {
    type: String,
    default: 'General'
  },

  username: {
    type: String,
    default: 'Anonymous'
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  isAnonymous: {
    type: Boolean,
    default: true
  },

  relates: {
    type: Number,
    default: 0
  },

  relateUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  comments: {
    type: Number,
    default: 0
  },

  reports: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },

      reason: {
        type: String
      },

      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  deleteAfter: {
    type: String,
    enum: ['3 Days', '7 Days', '14 Days', '30 Days', 'Never'],
    default: '7 Days'
  },

  deleteAt: {
    type: Date,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('Post', postSchema);