import express from 'express';
import controller from '../controllers/searchController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/alumni', controller.searchAlumni);

export default router;
