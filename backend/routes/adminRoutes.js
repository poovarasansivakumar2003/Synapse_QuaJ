import express from 'express'
import * as adminController from '../controllers/adminControllerSimple.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()

router.use(authenticate)
router.use(authorize('admin'))
router.get('/users', adminController.getAllUsers)
router.get('/mentorships', adminController.generateSkillGapReport)
router.post('/university', adminController.createUniversity)
router.put('/user/:userId', adminController.manageUser)

export default router
