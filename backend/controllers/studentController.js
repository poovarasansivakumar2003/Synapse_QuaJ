const User = require('../models/User.model')
const debug = require('debug')('app:studentController')
const Mentor = require('../models/MentorshipRequest.model')

module.exports = {
  updateProfile: async (req, res) => {
    try {
      debug('updateProfile of student : ${ req.user.id }')
      const user = await User.findbyIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true,
      })
      res.json(user)
    } catch (error) {
      debug('Error updating profile: ${error.message}')
      res.status(500).json({ error: 'Internal server error' })
    }
  },
  getBatchmates: async (req, res) => {
    try {
      console.debug(`Fetching batchmates for ${req.user.id}`)

      const currentUser = await User.findById(req.user.id)
      if (!currentUser) {
        return res.status(404).json({ error: 'User not found' })
      }

      const batchmates = await User.find({
        university: currentUser.university,
        batch: currentUser.batch,
        branch: currentUser.branch,
        _id: { $ne: req.user.id }, // Exclude self
      })

      res.json(batchmates)
    } catch (error) {
      console.debug(`Error fetching batchmates: ${error.message}`)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  requestMentorship: async (req, res) => {
    try {
      console.debug(
        `Mentorship request from ${req.user.id} to ${req.body.aluminiId}`
      )

      if (!req.body.aluminiId || !req.body.message) {
        return res.status(400).json({ error: 'Missing aluminiId or message' })
      }

      await MentorshipRequest.create({
        student: req.user.id,
        alumini: req.body.aluminiId,
        message: req.body.message,
      })

      console.debug('Mentorship request created successfully')
      res
        .status(201)
        .json({ message: 'Mentorship request created successfully' })
    } catch (err) {
      console.debug(`Error creating mentorship request: ${err.message}`)
      res.status(500).json({ error: 'Internal server error' })
    }
  },
}
