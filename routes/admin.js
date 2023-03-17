var express = require('express');
var router = express.Router();

const adminController = require('../controllers/admincontroller')
const authController = require('../controllers/authController')
const upload = require('../util/multer')



router.get('/',adminController.adminDashboardRender)

router.route('/adminLogin')
.get(adminController.renderAdminLoginPage)
.post(authController.verifyAdmin)

router.get('/logout',adminController.sessionDestroy)

router.get('/user-list',adminController.renderUserList)

router.get('/user-status/:id',adminController.userBlockAndUnBlock)

router.route('/add-product')
.get(adminController.renderProductAddPage)
.post(upload.array('image',4),adminController.addProduct)

router.post('/addCategory',adminController.addCategory)

router.get('/categoryList',adminController.renderCategoryList)
//product view
router.get('/productList',adminController.renderproductList)


router.route('/addBrand')
.get(adminController.renderBrandList)
.post(adminController.addBrand)

//delete product 
router.get('/deleteProduct/:id',adminController.deleteProduct)

//edit product
router.route('/editProduct/:id')
.get(adminController.renderEditproductPage)
.post(upload.array('image',4),adminController.editProduct)

//productListOrUnlist
router.get('/categoryListOrUnlist/:id',adminController.categoryListorunlist)
//edit category
router.post('/editCategory/:id',adminController.editCategory)
router.get('/editCategory/:id',adminController.editCategory)

//brand list or unlist
router.get("/brandListorunlist/:id",adminController.brandListOrUnlist)

//edit brand
router.post('/editbrand/:id',adminController.updateBrand)







module.exports = router;
