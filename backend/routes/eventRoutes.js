import express from 'express';
import controller from '../controllers/eventController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.post('/', controller.createEvent);
router.get('/', controller.getEvents);
router.post('/:id/rsvp', controller.rsvpEvent);

export default router;
