import express from 'express';
import controller from '../controllers/leaderboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get leaderboard for a period (via query param: ?period=daily|weekly|monthly|all-time)
router.get('/', authenticate, controller.getLeaderboard);

// Recalculate all periods
router.post('/recalculate', authenticate, controller.calculateAllLeaderboards);

export default router;
