import express from 'express';
import controller from '../controllers/skillGapController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin'));

router.post('/calculate', controller.calculateSkillGaps);

export default router;
