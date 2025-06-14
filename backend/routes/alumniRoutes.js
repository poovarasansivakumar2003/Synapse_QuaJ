const express = require('express')
const router = express.Router()
const controller = require('../controllers/alumniController')
const auth = require('../middleware/auth')

router.use(auth.authenticate)
router.use(auth.authorize('alumni'))
router.put('/update', controller.updateProfile)
router.post('/jobs', controller.postJob)
router.get('/mentorship/requests', controller.getMentorshipRequests)
router.patch('/mentorship/:id/respond', controller.respondToMentorship)
router.get('/search', controller.searchAlumni)
module.exports = router
