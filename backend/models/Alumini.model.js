import mongoose from 'mongoose'
import User from './User.model.js'

const alumniSchema = new mongoose.Schema({
  workExperience: [
    {
      company: String, // Fixed typo from "comapny" to "company"
      position: String,
      startDate: Date,
      endDate: Date,
      current: Boolean,
      description: String,
    },
  ],
  hiringStatus: {
    type: String,
    enum: ['active', 'inactive', 'selective'],
    default: 'inactive',
  },
  availableForMentorship: {
    type: Boolean,
    default: false,
  },
})

const Alumni = User.discriminator('Alumni', alumniSchema)

export default Alumni
