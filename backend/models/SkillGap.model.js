const mongoose = require('mongoose')

const skillGapSchema = new mongoose.Schema(
  {
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    skill: { type: String, required: true },
    industryDemand: Number, // Percentage of alumni using this skill
    studentProficiency: Number, // Percentage of students with this skill
    gap: Number, // Difference between demand and proficiency
    trending: { type: Number, default: 0 }, // +1 increasing, -1 decreasing
  },
  { timestamps: true }
)

module.exports = mongoose.model('SkillGap', skillGapSchema)
