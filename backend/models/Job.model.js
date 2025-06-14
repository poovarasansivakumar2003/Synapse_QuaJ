import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    position: { type: String, required: true },
    description: String,
    requirements: [String],
    location: String,
    salaryRange: {
      min: Number,
      max: Number,
      currency: String,
    },
    applicationDeadline: Date,
    university: { type: mongoose.Schema.Types.ObjectId, ref: 'University' },
    targetBranches: [{ type: String }],
    applications: [
      {
        applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: {
          type: String,
          enum: ['submitted', 'reviewed', 'rejected', 'hired'],
        },
        appliedAt: Date,
      },
    ],
  },
  { timestamps: true }
)

const Job = mongoose.model('Job', jobSchema)

export default Job
