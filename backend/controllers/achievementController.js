// controllers/achievementController.js
const Achievement = require('../models/Achievement.model')
const debug = require('debug')('app:achievements')

module.exports = {
  getAchievements: async (req, res) => {
    try {
      debug(`Fetching achievements for: ${req.user.id}`)
      const achievements = await Achievement.find({ user: req.user.id })
      res.json(achievements)
    } catch (err) {
      debug('Achievement error:', err.message)
      res.status(500).json({ error: 'Server error' })
    }
  },

  unlockAchievement: async (req, res) => {
    try {
      debug(`Unlocking achievement for: ${req.user.id}`)
      const achievement = await Achievement.create({
        user: req.user.id,
        ...req.body,
      })
      res.status(201).json(achievement)
    } catch (err) {
      debug('Achievement unlock error:', err.message)
      res.status(400).json({ error: err.message })
    }
  },
}
