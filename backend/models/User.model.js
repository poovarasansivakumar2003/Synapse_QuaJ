const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => /.+@(univ\.edu|alum\.univ\.edu)$/.test(v),
        message: 'Not a valid university email',
      },
    },
    password: { type: String, select: false },
    role: {
      type: String,
      enum: ['student', 'alumni', 'faculty', 'admin'],
      default: 'student',
    },
    university: { type: String, required: true },
    usn: {
      type: String,
      uppercase: true,
    },
    batch: { type: Number, min: 1990, max: new Date().getFullYear() },
    branch: {
      type: String,
      enum: ['CSE', 'ISE', 'AIML', 'ECE', 'MECH', 'EEE', 'CIVIL', 'AERO'],
    },
    company: String,
    position: String,
    avatarUrl: String,
    skills: [String],
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    fcmToken: String, // For push notifications
    lastActive: Date,
  },
  { timestamps: true, discriminatorKey: 'role' }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.verifyPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
