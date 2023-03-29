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







module.exports = router;
