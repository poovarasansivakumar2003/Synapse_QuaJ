import mongoose from 'mongoose';
import User from './User.model.js';

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
});

const Admin = User.discriminator('Admin', adminSchema);

export default Admin;
