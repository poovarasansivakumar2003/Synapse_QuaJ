const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  thumbnail: String,
  videoUrl: String,
  duration: String,
  instructor: {
    name: String,
    company: String,
    profilePicture: String
  },
  course: {
    type: String,
    required: true
  },
  department: String,
  tags: [String],
  category: {
    type: String,
    enum: ['career-guidance', 'technical-skills', 'soft-skills', 'industry-insights', 'interview-prep'],
    default: 'career-guidance'
  },
  viewCount: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

videoSchema.index({ course: 1, category: 1 });
videoSchema.index({ tags: 1 });

module.exports = mongoose.model('Video', videoSchema);
