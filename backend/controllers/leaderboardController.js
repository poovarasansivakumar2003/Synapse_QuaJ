const Leaderboard = require('../models/Leaderboard.model')
const User = require('../models/User.model')
const debug = require('debug')('app:leaderboardController')

const PERIODS = {
  daily: 1,
  weekly: 7,
  monthly: 30,
  'all-time': null,
}

function getStartDate(period) {
  if (!PERIODS[period]) return null
  const daysAgo = PERIODS[period]
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
}

module.exports = {
  getLeaderboard: async (req, res) => {
    try {
      const period = req.query.period || 'weekly'
      debug(
        `Fetching ${period} leaderboard for university: ${req.user.university}`
      )

      const leaderboard = await Leaderboard.findOne({
        university: req.user.university,
        period,
      }).populate('rankings.user')

      res.json(leaderboard)
    } catch (err) {
      debug(`Error fetching leaderboard: ${err.message}`)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  calculateAllLeaderboards: async (req, res) => {
    try {
      const periods = Object.keys(PERIODS)
      const university = req.user.university

      const users = await User.find({ university })

      for (const period of periods) {
        const rankings = []

        for (const user of users) {
          const score =
            (user.connections?.length || 0) * 5 +
            (user.projects?.length || 0) * 10 +
            (user.internships?.length || 0) * 15

          rankings.push({
            user: user._id,
            score,
            position: 0,
            progress: Math.floor(Math.random() * 101) - 50, // placeholder progress
          })
        }

        rankings.sort((a, b) => b.score - a.score)

        rankings.forEach((r, i) => {
          r.position = i + 1
        })

        await Leaderboard.findOneAndUpdate(
          { university, period },
          {
            rankings,
            startDate: getStartDate(period),
            endDate: new Date(),
          },
          { upsert: true, new: true }
        )
      }

      res.json({ message: 'Leaderboards recalculated for all periods' })
    } catch (err) {
      debug(`Error recalculating leaderboards: ${err.message}`)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  updateScores: async (req, res) => {
    try {
      debug(`Updating scores for user: ${req.user.id}`)
      // Add custom logic if needed
      res.json({ message: 'Scores updated successfully' })
    } catch (err) {
      debug(`Error updating scores: ${err.message}`)
      res.status(500).json({ error: 'Internal server error' })
    }
  },
}
