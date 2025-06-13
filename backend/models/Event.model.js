const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    location: {
      type: String,
      enum: ['online', 'campus', 'external'],
      default: 'online',
    },
    venue: String,
    targetBatches: [{ type: Number }],
    targetBranches: [{ type: String }],
    zoomMeeting: {
      id: String,
      password: String,
      start_url: String,
      join_url: String,
    },
    rsvp: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: {
          type: String,
          enum: ['attending', 'maybe', 'declined'],
        },
      },
    ],
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Event', eventSchema)
