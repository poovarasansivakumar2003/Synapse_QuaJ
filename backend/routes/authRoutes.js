import express from 'express'
import * as controller from '../controllers/authController.js'

const router = express.Router()

router.post('/register', controller.register)
router.post('/login', controller.login)
router.get('/profile', controller.getProfile)

export default router
