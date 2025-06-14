const User = require('../models/User.model')
const Job = require('../models/JobPostings.model')
const debug = require('debug')('app:alumniController')

module.exports = {
  updateProfile: async (req, res) => {
    try {
      debug(`updateProfile of alumni: ${req.user.id}`)
      const user = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true,
      })
      res.json(user)
    } catch (error) {
      debug(`Error updating profile: ${error.message}`)
      res.status(500).json({ error: 'Internal server error' })
    }
  },
  postJob: async (req, res) => {
    try {
      debug(`Posting job by alumni: ${req.user.id}`)
      const job = new Job({
        ...req.body,
        postedBy: req.user.id,
        university: req.user.university,
      })
      debug('Job posted:${job._id}')
      res.status(201).json(job)
    } catch (err) {
      debug(`Error posting job: ${err.message}`)
      res.status(500).json({ error: 'Internal server error' })
    }
  },
  getMentorshipRequests: async (req, res) => {
    try {
      debug(`Fetching mentorship requests for alumni: ${req.user.id}`)
      const requests = await Mentorship.find({
        alumini: req.user.id,
        status: 'pending',
      }).populate('student')
      res.json(requests)
    } catch (err) {
      debug(`Error fetching mentorship requests: ${err.message}`)
      res.status(500).json({ error: 'Internal server error' })
    }
  },
  respondToMentorship: async (req, res) => {
    try {
      debug(`📝 Responding to mentorship: ${req.params.id}`)
      const mentorship = await Mentorship.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      )
      res.json(mentorship)
    } catch (err) {
      debug('❌ Mentorship response error:', err.message)
      res.status(400).json({ error: err.message })
    }
  },
}
