var express = require('express');
var router = express.Router();

const adminController = require('../controllers/admincontroller')
const authController = require('../controllers/authController')
const upload = require('../util/multer')
const adminAuth=require('../middlewares/adminAuth');
const admincontroller = require('../controllers/admincontroller');



router.get('/',adminAuth.adminAuth,adminController.adminDashboardRender)

router.route('/adminLogin')
.get(adminController.renderAdminLoginPage)
.post(authController.verifyAdmin)

router.get('/logout',adminAuth.adminAuth,adminController.sessionDestroy)

router.get('/user-list',adminAuth.adminAuth,adminController.renderUserList)

router.get('/user-status/:id',adminAuth.adminAuth,adminController.userBlockAndUnBlock)

router.route('/add-product')
.get(adminAuth.adminAuth,adminController.renderProductAddPage)
.post(adminAuth.adminAuth,upload.array('image',4),adminController.addProduct)

router.post('/addCategory',adminAuth.adminAuth,adminController.addCategory)

router.get('/categoryList',adminAuth.adminAuth,adminController.renderCategoryList)

//product view
router.get('/productList',adminAuth.adminAuth,adminController.renderproductList)


router.route('/addBrand')
.get(adminAuth.adminAuth,adminController.renderBrandList)
.post(adminAuth.adminAuth,adminController.addBrand)

//delete product 
router.get('/productStatus/:id',adminAuth.adminAuth,adminController.deleteProduct)

//edit product
router.route('/editProduct/:id')
.get(adminAuth.adminAuth,adminController.renderEditproductPage)
.post(adminAuth.adminAuth,upload.array('image',4),adminController.editProduct)

//productListOrUnlist
router.get('/categoryListOrUnlist/:id',adminAuth.adminAuth,adminController.categoryListorunlist)

//edit category
router.post('/editCategory/:id',adminAuth.adminAuth,adminController.editCategory)

router.get('/editCategory/:id',adminAuth.adminAuth,adminController.editCategory)

//brand list or unlist
router.get("/brandListorunlist/:id",adminAuth.adminAuth,adminController.brandListOrUnlist)

//edit brand
router.post('/editbrand/:id',adminAuth.adminAuth,adminController.updateBrand)

router.get('/productdetails/:id',adminAuth.adminAuth,adminController.productdetails)

router.get('/order-list',adminAuth.adminAuth,adminController.renderOrderList )

router.post('/change-order-status',adminAuth.adminAuth,admincontroller.changeOrderStatus)

router.get('/order-details/:id',adminAuth.adminAuth,adminController.orderDetails)

router.route('/add-banner')
.get(adminAuth.adminAuth,adminController.renderAddBanner )
.post(adminAuth.adminAuth,upload.array('banners',2),adminController.addBanner)

router.post('/edit-banner/:id',adminAuth.adminAuth,upload.array('banners',2),adminController.editBanner)

router.get('/remove-banner/:id',adminAuth.adminAuth,)

router.get('/coupon-list',adminAuth.adminAuth,adminController.renderCouponPage)

router.post('/add-coupon',adminAuth.adminAuth,adminController.addCoupon)

router.get('/delete-coupon/:id',adminAuth.adminAuth,adminController.deleteCoupon)

router.get('/sales-report',adminAuth.adminAuth,adminController.salesReport)

router.post('/filter-date',adminAuth.adminAuth,adminController.filterDate)

router.get('/brand-banner',adminAuth.adminAuth,adminController.renderBrandBanner)


router.post('/add-banner-image/:id',adminAuth.adminAuth,upload.single('image'),adminController.addBrandImage)

router.get('/getDashboardData',adminAuth.adminAuth,adminController.dashBoardData)








module.exports = router;
