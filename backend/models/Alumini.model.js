const User = require('./User.model')

const alumniSchema = new mongoose.Schema({
  workExperience: [
    {
      comapny: String,
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
module.exports = User.discriminator('Alumni', alumniSchema)
