const mongoose = require('mongoose');

const roomMessageSchema = new mongoose.Schema({

  room: {
    type: String,
    required: true
  },

  username: {
    type: String,
    default: 'Anonymous'
  },

  message: {
    type: String,
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports =
  mongoose.model(
    'RoomMessage',
    roomMessageSchema
  );