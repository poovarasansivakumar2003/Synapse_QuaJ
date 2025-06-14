const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const auth = require('../middleware/auth')

router.use(auth.authenticate)
router.use(auth.authorize('admin'))
router.patch('/user/:userId/verify', adminController.verifyUser)
router.get('/users', adminController.getAllUsers)
router.get('/mentorships', adminController.generateSkillGapReport)
// router.post('/university', adminController.createUniversity)
router.put('/user/:userId', adminController.manageUser)

module.exports = router
