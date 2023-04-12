const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const userAuth = require('../middlewares/userAuth')

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

router.get('/brand-products/:id',userController.renderBrandProducts)


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

router.get('/rewards',userAuth.userAuth,userController.renderRewardPage)

router.post('/apply-coupon',userAuth.userAuth,userController.verifyCoupon)

router.post('/verify-payment',userAuth.userAuth,userController.verifyPayment)

router.get('/user-profile',userAuth.userAuth,userController.userProfilePageRender)

router.post('/check-password',userAuth.userAuth,authController.checkPassord)

router.post('/update-password',userAuth.userAuth,authController.changePassword)

router.post('/change-user-profile',userAuth.userAuth,userController.changeProfileDetails)

router.get('/address-details',userAuth.userAuth,userController.userAddress)

router.post('/edit-address/:id',userAuth.userAuth,userController.updateAddress)

router.get('/delete-address/:id',userAuth.userAuth,userController.deleteAddress)

router.post('/cancel-order',userAuth.userAuth,userController.cancelOrder)


router.get('/wallet',userAuth.userAuth,userController.renderWalletPage)





module.exports = router;
