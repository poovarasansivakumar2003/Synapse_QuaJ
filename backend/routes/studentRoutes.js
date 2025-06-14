const express = require('express')
const router = express.Router()
const controller = require('../controllers/studentController')
const auth = require('../middleware/auth')

router.use(auth.authenticate)
router.use(auth.authorize('student'))

router.get('/batchmates', controller.getBatchmates)
router.post('/mentorship/request', controller.requestMentorship)
router.put('/profile', controller.updateProfile)
module.exports = router
