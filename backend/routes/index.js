import express from 'express'
import debug from 'debug'
import authRoutes from './authRoutes.js'
import adminRoutes from './adminRoutes.js'
import mentorshipRoutes from './mentorshipRoutes.js'
import alumniRoutes from './alumniRoutes.js'
import studentRoutes from './studentRoutes.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()
const debugLog = debug('app:routes')

router.use('/auth', authRoutes)

router.use(authenticate)
debugLog('🔐 Authentication middleware applied')

router.use('/admin', adminRoutes)
debugLog('👨‍💼 Admin routes loaded')
router.use('/mentorship', mentorshipRoutes)
debugLog('🤝 Mentorship routes loaded')
router.use('/alumni', alumniRoutes)
debugLog('🎓 Alumni routes loaded')
router.use('/students', studentRoutes)
debugLog('👩‍🎓 Student routes loaded')

export default router
debugLog('📦 Main routes module loaded')
