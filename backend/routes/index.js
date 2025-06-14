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
