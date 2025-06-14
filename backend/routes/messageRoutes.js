import express from 'express';
import controller from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/conversations', controller.createConversation);
router.post('/conversations/:conversationId/messages', controller.sendMessage);
router.get('/conversations', controller.getConversations);
router.get('/conversations/:conversationId/messages', controller.getMessages);

export default router;
