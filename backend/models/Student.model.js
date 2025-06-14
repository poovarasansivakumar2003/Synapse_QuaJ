import mongoose from 'mongoose'
import User from './User.model.js'

const studentSchema = new mongoose.Schema({
  currentSemester: Number,
  cgpa: Number,
  projects: [
    {
      title: String,
      description: String,
      technologies: [String],
      githubUtl: String,
    },
  ],
  internships: [
    {
      company: String,
      role: String,
      duration: String,
      description: String,
    },
  ],
  courseCertifications: [
    {
      name: String,
      issuer: String,
      date: Date,
    },
  ],
})

const Student = User.discriminator('Student', studentSchema)

export default Student
