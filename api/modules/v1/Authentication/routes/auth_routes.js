const express = require('express')
const AuthController = require('../controller/auth_controller')
const router = express.Router();



// router.post('/signup', AuthController.singup)
// router.post('/addcard', AuthController.addcard)
// router.post('/forgot-password', AuthController.forgotpassword)
// router.post('/login', AuthController.login)
// router.post('/view-profile', AuthController.viewprofile)
// router.post('/addcard', AuthController.addcard)
// router.post('/editcard', AuthController.editcard)
// router.post('/editprofile', AuthController.editprofile)
router.post('/brandlisting', AuthController.brandlisting)
router.post('/productlisting', AuthController.productlisting)
router.post('/bannerlisting', AuthController.bannerlisting)
router.post('/categorylisting', AuthController.categorylisting)
// router.post('/cmspages', AuthController.cmspages)
// router.post('/contactus', AuthController.contactus)
// router.post('/logout', AuthController.logout)
// router.post('/resetpassword', AuthController.resetpasssword)
// router.post('/deletecard', AuthController.deletecard)

module.exports = router;