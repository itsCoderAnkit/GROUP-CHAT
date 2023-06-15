const express = require('express')
const router = express.Router()
const userauthentication = require('../middleware/auth')
const groupMessages = require('../controllers/groupMessageController')

router.get('/getagroupmessages',groupMessages.get_group_messages)

router.get('/getgroupchat/:groupId',userauthentication.authenticate,groupMessages.get_group_chat)

router.get('/getgroupmembers/:groupId',userauthentication.authenticate,groupMessages.get_group_members)

router.post('/changeAdmin/:groupId/:userId', groupMessages.change_admin)

router.delete('/removeUser/:groupId/:userId', groupMessages.remove_user)

module.exports = router