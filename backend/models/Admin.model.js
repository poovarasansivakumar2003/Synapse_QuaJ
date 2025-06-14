const User = require('./User.model')
const adminSchema = new mongoose.Schema({
  permissions: [
    {
      type: String,
      enum: [
        'manage_users',
        'manage_events',
        'analytics',
        'content_moderation',
      ],
    },
  ],
  accessLevel: { type: Number, default: 1 },
})
module.exports = User.discriminator('Admin', adminSchema)
