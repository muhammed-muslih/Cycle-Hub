const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController')


router.get('/',userController.homePageRender)

router.route('/signup')
.get(userController.signupPageRender)
.post(authController.userRegister)

router.route('/login')
.get(userController.loginPageRender)
.post(authController.verifyUser)

router.get('/logout',userController.sessionDestroy)









module.exports = router;
