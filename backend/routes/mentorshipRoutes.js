import express from 'express';
import controller from '../controllers/mentorshipController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/active', controller.getActiveMentorships);

export default router;
