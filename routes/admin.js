var express = require('express');
var router = express.Router();

const adminController = require('../controllers/admincontroller')


router.get('/',adminController.adminDashboardRender)

module.exports = router;
