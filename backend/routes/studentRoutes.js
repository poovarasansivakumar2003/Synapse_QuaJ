import express from 'express';
import controller from '../controllers/studentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('student'));

router.get('/batchmates', controller.getBatchmates);
router.post('/mentorship/request', controller.requestMentorship);
router.put('/profile', controller.updateProfile);

export default router;
