const express = require('express');
const router = express.Router();
const userAuth = require('../middlewares/userAuth')
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');


router.get('/',userAuth.userAuth,userController.homePageRender)
router.route('/signup')
.get(userController.signupPageRender)
.post(authController.userRegister)

router.get('/change-banner/:id',userController.ChangeBanner)

router.route('/login')
.get(userController.loginPageRender)
.post(authController.verifyUser)

router.get('/logout',userController.sessionDestroy)
router.get('/otp-login',userController.otpLoginPagerender)
router.post('/phone-verify',authController.verifyPhoneNumber)
router.post('/otp-success',authController.otpSuccess)

router.get('/shopepage',userController.renderShopePage)
router.get('/categoryProducts',userController.renderShopePage)
router.get('/brandProducts',userController.renderShopePage)
router.get('/singleProductView/:id',userController.renderSingleProductView)
//cart pages
router.get('/cart',userAuth.userAuth,userController.cartpagerender)
router.get('/add-to-cart/:id',userAuth.userAuth,userController.addToCart)
router.post('/change-product-quantity',userAuth.userAuth,userController.changeCartProductQuantity)
router.get('/delete-cart-product/:id',userAuth.userAuth,userController.deleteCartProduct)

//checkouts
router.get('/checkout',userAuth.userAuth,userController.checkoutPageRender)
router.post('/place-order',userAuth.userAuth,userController.placeOrder)

//order pages
router.get('/order-list',userAuth.userAuth,userController.orderListPageRender)
router.get('/order-details/:id',userAuth.userAuth,userController.orderDetailspageRender)
router.get('/order-success',userAuth.userAuth,userController.orderSuccessPage)

router.post('/add-Address',userAuth.userAuth,userController.addAddress)

//whisList
router.get('/whishlist',userAuth.userAuth,userController.renderWhislist)
router.post('/add-to-whishlist',userAuth.userAuth,userController.addWhishList)



module.exports = router;
