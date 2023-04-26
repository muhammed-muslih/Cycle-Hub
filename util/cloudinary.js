const cloudinary = require('cloudinary').v2
const dotenv = require('dotenv').config();
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY ||'586789217435372',
    api_secret:process.env.API_SECRET 
  });
module.exports=cloudinary
