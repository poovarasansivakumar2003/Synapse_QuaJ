import express from 'express';
import { getNotifications, getMessages } from '../controllers/headerController.js';

const router = express.Router();

router.get('/notifications', getNotifications);
router.get('/messages', getMessages);

export default router;
