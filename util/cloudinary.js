const cloudinary = require('cloudinary').v2
const dotenv = require('dotenv').config();
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME || 'dhk0hs5b0',
    api_key:process.env.API_KEY ||'586789217435372',
    api_secret:process.env.API_SECRET ||'ZRJn0FitZtDBg7c7PF7jkb8wyos'
  });
module.exports=cloudinary
