const Leaderboard = require('../models/Leaderboard.model')
const debug = require('debug')('app:leaderboardController')

module.exports = {
  getLeaderboard: async (req, res) => {
    try {
      debug(`Fetching leaderboard for university: ${req.user.university}`)
      const leaderboard = await Leaderboard.findOne({
        university: req.user.university,
        period: 'weekly',
      }).populate('rankings.user')
      res.json(leaderboard)
    } catch (err) {
      debug(`Error fetching leaderboard: ${err.message}`)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  updateScores: async (req, res) => {
    try {
      debug(`Updating scores for user: ${req.user.id}`)
      res.json({
        message: 'Scores updated successfully',
      })
    } catch (err) {
      debug(`Error updating scores: ${err.message}`)
      res.status(500).json({ error: 'Internal server error' })
    }
  },
}
