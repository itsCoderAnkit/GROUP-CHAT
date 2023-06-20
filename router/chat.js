const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chatControllers')
const userauthentication = require('../middleware/auth')


router.get('/user/chat',chatController.user_chat)

router.get('/user/getchats',chatController.user_getchats)

router.post('/user/savechat', userauthentication.authenticate ,chatController.save_chat)

router.post('/user/savegroupchat/:groupId', userauthentication.authenticate ,chatController.save_group_chat)

router.get('/user/showchat/:last_msg_id',userauthentication.authenticate,chatController.get_all_chats)


module.exports = router