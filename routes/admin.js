var express = require('express');
var router = express.Router();

const adminController = require('../controllers/admincontroller')
const userController =require('../controllers/userController')


router.get('/',adminController.adminDashboardRender)
router.get('/user-list',adminController.renderUserList)

router.get('/user-status/:id',adminController.userBlockAndUnBlock)
module.exports = router;
