const mongoose = require('mongoose')

const mentorshipSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    alumni: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: String,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending',
    },
    startDate: Date,
    endDate: Date,
    sessions: [
      {
        date: Date,
        duration: Number, // in minutes
        notes: String,
      },
    ],
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Mentorship', mentorshipSchema)
