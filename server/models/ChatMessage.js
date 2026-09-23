const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    sender: {
      type: String,
      enum: ["user", "bot"],
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    persona: {
      type: String,
      default: "echo",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ChatMessage",
  chatMessageSchema
);