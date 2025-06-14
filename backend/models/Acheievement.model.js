const mongoose = require('mongoose')

const achievementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['connections', 'events', 'skills', 'mentoring', 'content', 'jobs'],
      required: true,
    },
    name: String,
    description: String,
    icon: String,
    points: Number,
    unlockedAt: Date,
  },
  { timestamps: true }
)

module.exports = mongoose.model('Achievement', achievementSchema)
