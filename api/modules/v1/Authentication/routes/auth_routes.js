const express = require('express')
const AuthController = require('../controller/auth_controller')
const router = express.Router();



router.post('/signup', AuthController.singup)
// router.post('/forgot-password', AuthController.forgotpassword)
router.post('/login', AuthController.login)
router.post('/view-profile', AuthController.viewprofile)

module.exports = router;