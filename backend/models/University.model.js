const mongoose = require('mongoose')
const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  domains: [
    {
      type: String,
    },
  ],
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
  },
  establishedYear: Number,
  verified: { type: Boolean, default: false },
  verificationProof: String,
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})
module.exports = mongoose.model('University', universitySchema)
