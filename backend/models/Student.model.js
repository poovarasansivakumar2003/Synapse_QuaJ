const User = require('./User.model')
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
      decodeURIate: Date,
    },
  ],
})
module.exports = User.discriminator('Student', studentSchema)
