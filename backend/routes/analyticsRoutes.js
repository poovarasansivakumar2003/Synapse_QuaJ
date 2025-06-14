import express from 'express';
import controller from '../controllers/analyticsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/', controller.getDashboardData);
router.get('/export/:type', controller.exportData);

export default router;
