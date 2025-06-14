import express from 'express';
import controller from '../controllers/achievementController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', controller.getAchievements);
router.post('/', controller.unlockAchievement);

export default router;
