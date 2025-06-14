const mongoose = require('mongoose')

const analyticsSchema = new mongoose.Schema({
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true,
  },
  type: {
    type: String,
    enum: ['user_engagement', 'skill_gap', 'event_participation', 'placement'],
    required: true,
  },
  data: mongoose.Schema.Types.Mixed,
  period: {
    start: Date,
    end: Date,
  },
  generatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Analytics', analyticsSchema)
