const express = require('express')
const router = express.Router()

const debug = require('debug')('app:routes')

router.use('/auth', require('./authRoutes'))

router.use(require('../middleware/auth').authenticate)
debug('🔐 Authentication middleware applied')

router.use('/admin', require('./adminRoutes'))
debug('👨‍💼 Admin routes loaded')
router.use('/mentorship', require('./mentorshipRoutes'))
debug('🤝 Mentorship routes loaded')
router.use('/alumni', require('./alumniRoutes'))
debug('🎓 Alumni routes loaded')
router.use('/students', require('./studentRoutes'))
debug('👩‍🎓 Student routes loaded')
module.exports = router
debug('📦 Main routes module loaded')
router.use('/messages', require('./messageRoutes'))
router.use('/skill-gap', require('./skillGapRoutes'))
router.use('/search', require('./searchRoutes'))

router.use('/analytics', require('./analyticsRoutes'))

router.use('/leaderboard', require('./leaderboardRoutes'))
router.use('/achievements', require('./achievementRoutes'))
router.use('/events', require('./eventRoutes'))
router.use('/jobs', require('./jobRoutes'))
