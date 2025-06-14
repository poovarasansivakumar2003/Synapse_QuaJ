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

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ['student', 'alumni', 'faculty', 'admin'],
      default: 'student',
    },

    university: { type: String, required: true },

    usn: {
      type: String,
      uppercase: true,
      required: function () {
        return !['admin', 'alumni'].includes(this.role)
      },
    },

    batch: {
      type: Number,
      required: function () {
        return this.role !== 'admin'
      },
      validate: {
        validator: function (v) {
          const currentYear = new Date().getFullYear()
          return v >= 1990 && v < currentYear
        },
        message: (props) =>
          `Batch year must be between 1990 and ${new Date().getFullYear() - 1}`,
      },
    },

    branch: {
      type: String,
      enum: ['CSE', 'ISE', 'AIML', 'ECE', 'MECH', 'EEE', 'CIVIL', 'AERO'],
      required: function () {
        return this.role !== 'admin'
      },
    },

    company: String,
    position: String,
    avatarUrl: String,
    skills: [String],
    skills: [String],
    projects: [{ title: String, description: String }],
    internships: [{ company: String, duration: String }],

    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    fcmToken: String,
    lastActive: Date,
  },
  {
    timestamps: true,
    discriminatorKey: 'role',
  }
)

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12)
  }

  if (this.role === 'admin') {
    this.isVerified = true
  }

  next()
})

userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate()

  if (update.password) {
    const hashed = await bcrypt.hash(update.password, 12)
    update.password = hashed
  }

  if (update.role === 'admin') {
    update.isVerified = true
  }

  this.setUpdate(update)
  next()
})

userSchema.methods.verifyPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
