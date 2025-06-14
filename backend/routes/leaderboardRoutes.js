const express = require('express')
const router = express.Router()
const controller = require('../controllers/leaderboardController')
const { authenticate } = require('../middleware/auth')

// Get leaderboard for a period (via query param: ?period=daily|weekly|monthly|all-time)
router.get('/', authenticate, controller.getLeaderboard)

// Recalculate all periods
router.post('/recalculate', authenticate, controller.calculateAllLeaderboards)

module.exports = router
