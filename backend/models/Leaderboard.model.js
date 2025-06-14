import mongoose from 'mongoose'

const leaderboardSchema = new mongoose.Schema(
  {
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    period: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'all-time'],
      default: 'weekly',
    },
    rankings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        score: Number,
        position: Number,
        progress: Number, // % change from last period
      },
    ],
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
)

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema)

export default Leaderboard
