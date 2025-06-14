// controllers/adminController.js
const User = require('../models/User.model')
const University = require('../models/University.model')
const SkillGap = require('../models/SkillGap.model')
const debug = require('debug')('app:admin')

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      debug(`Admin ${req.user.id} fetching users`)
      const users = await User.find({ university: req.user.university })
      res.json(users)
    } catch (err) {
      debug('User fetch error:', err.message)
      res.status(500).json({ error: 'Server error' })
    }
  },

  createUniversity: async (req, res) => {
    try {
      debug(`Creating university: ${req.body.name}`)
      const university = await University.create(req.body)
      res.status(201).json(university)
    } catch (err) {
      debug('University creation error:', err.message)
      res.status(400).json({ error: err.message })
    }
  },

  generateSkillGapReport: async (req, res) => {
    try {
      debug(`Generating skill gap report for: ${req.user.university}`)
      const gaps = await SkillGap.find({
        university: req.user.university,
      })
        .sort({ gap: -1 })
        .limit(10)

      res.json({
        university: req.user.university,
        reportDate: new Date(),
        skillGaps: gaps,
      })
    } catch (err) {
      debug('Skill gap error:', err.message)
      res.status(500).json({ error: 'Server error' })
    }
  },

  manageUser: async (req, res) => {
    try {
      debug(`Admin managing user: ${req.params.userId}`)
      const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
        new: true,
      })
      res.json(user)
    } catch (err) {
      debug('User management error:', err.message)
      res.status(400).json({ error: err.message })
    }
  },
}
