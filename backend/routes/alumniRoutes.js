import express from 'express';
import controller from '../controllers/alumniController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('alumni'));
router.put('/update', controller.updateProfile);
router.post('/jobs', controller.postJob);
router.get('/mentorship/requests', controller.getMentorshipRequests);
router.patch('/mentorship/:id/respond', controller.respondToMentorship);
router.get('/search', controller.searchAlumni);

export default router;
