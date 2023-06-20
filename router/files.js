const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chatControllers')
const userauthentication = require('../middleware/auth')
const fileController = require('../controllers/fileControllers')


router.post('/user/saveimage',userauthentication.authenticate,fileController.upload_image)

module.exports = router