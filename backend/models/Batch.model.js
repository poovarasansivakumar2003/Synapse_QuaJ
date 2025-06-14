import mongoose from 'mongoose'

const batchSchema = new mongoose.Schema(
  {
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    year: { type: Number, required: true },
    branch: {
      type: String,
      enum: ['CSE', 'ECE', 'ME', 'CE', 'EEE'],
      required: true,
    },
    classAdvisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    achievements: [String],
    placementStats: {
      averagePackage: Number,
      highestPackage: Number,
      placedPercentage: Number,
      topCompanies: [String],
    },
    alumni: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
)

const Batch = mongoose.model('Batch', batchSchema)

export default Batch
