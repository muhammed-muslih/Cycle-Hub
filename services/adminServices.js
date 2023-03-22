const db = require('../db')
const dotenv= require("dotenv").config()
const ObjectId= require("mongodb-legacy").ObjectId
const collecton = require('../config/collections')

module.exports = {
    adminValidation : async(email)=>{
     const admin = await  db.getDB().collection(collecton.admin_collection).findOne({email:email})
     return admin
    }

}