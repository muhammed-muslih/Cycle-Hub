const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController')

router.get('/',userController.homePageRender)
router.get("/login",userController.loginPageRender)
router.get('/signup',userController.signupPageRender)

module.exports = router;
