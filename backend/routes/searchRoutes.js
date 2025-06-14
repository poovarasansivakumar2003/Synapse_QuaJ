const router = require('express').Router()
const controller = require('../controllers/searchController')
const auth = require('../middleware/auth')

router.use(auth.authenticate)
router.get('/alumni', controller.searchAlumni)

module.exports = router
