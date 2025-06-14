import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => /.+@uvce\.ac\.in$/.test(v),
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
      enum: ['student', 'alumni', 'admin'],
      default: 'student',
    },

    university: { type: String, required: true },

    usn: {
      type: String,
      uppercase: true,
    },

    batch: {
      type: Number,
    },

    branch: {
      type: String,
    },

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

  next()
})

userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate()

  if (update.password) {
    const hashed = await bcrypt.hash(update.password, 12)
    update.password = hashed
  }

  this.setUpdate(update)
  next()
})

userSchema.methods.verifyPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
