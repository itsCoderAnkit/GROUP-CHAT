const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chatControllers')
const userauthentication = require('../middleware/auth')
const groupController = require('../controllers/groupControllers')

router.get('/newgroup',groupController.get_new_group)

router.post('/newgroup',userauthentication.authenticate,groupController.post_new_group)

router.get('/getallgroups',userauthentication.authenticate,groupController.get_all_groups)

router.get('/joingroup/:groupId',userauthentication.authenticate,groupController.join_group)

module.exports = router