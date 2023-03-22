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

router.get('/shopepage',userController.renderShopePage)
router.get('/categoryProducts',userController.renderShopePage)
router.get('/brandProducts',userController.renderShopePage)
router.get('/singleProductView/:id',userController.renderSingleProductView)



module.exports = router;
