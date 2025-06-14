const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: String,
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Conversation', conversationSchema)
