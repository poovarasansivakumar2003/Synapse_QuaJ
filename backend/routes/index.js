import express from 'express';
import debug from 'debug';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import mentorshipRoutes from './mentorshipRoutes.js';
import alumniRoutes from './alumniRoutes.js';
import studentRoutes from './studentRoutes.js';
import messageRoutes from './messageRoutes.js';
import skillGapRoutes from './skillGapRoutes.js';
import searchRoutes from './searchRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import leaderboardRoutes from './leaderboardRoutes.js';
import achievementRoutes from './achievementRoutes.js';
import eventRoutes from './eventRoutes.js';
import jobRoutes from './jobRoutes.js';
import headerRoutes from './headerRoutes.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const debugRouter = debug('app:routes');

router.use('/auth', authRoutes);

router.use(authenticate);
debugRouter('🔐 Authentication middleware applied');

router.use('/admin', adminRoutes);
debugRouter('👨‍💼 Admin routes loaded');
router.use('/mentorship', mentorshipRoutes);
debugRouter('🤝 Mentorship routes loaded');
router.use('/alumni', alumniRoutes);
debugRouter('🎓 Alumni routes loaded');
router.use('/students', studentRoutes);
debugRouter('👩‍🎓 Student routes loaded');
router.use('/messages', messageRoutes);
router.use('/skill-gap', skillGapRoutes);
router.use('/search', searchRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/achievements', achievementRoutes);
router.use('/events', eventRoutes);
router.use('/jobs', jobRoutes);
router.use('/header', headerRoutes);
debugRouter('📋 Header routes loaded');

export default router;
debugRouter('📦 Main routes module loaded');
