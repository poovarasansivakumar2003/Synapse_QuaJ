import express from 'express';
import controller from '../controllers/jobController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', controller.getJobs);
router.post('/:id/apply', controller.applyJob);

export default router;
