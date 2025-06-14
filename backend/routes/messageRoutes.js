const router = require('express').Router()
const controller = require('../controllers/messageController')
const auth = require('../middleware/auth')

router.use(auth.authenticate)

router.post('/conversations', controller.createConversation)
router.post('/conversations/:conversationId/messages', controller.sendMessage)
router.get('/conversations', controller.getConversations)
router.get('/conversations/:conversationId/messages', controller.getMessages)

module.exports = router
