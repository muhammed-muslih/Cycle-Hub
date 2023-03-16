const db = require('../db')
const dotenv= require("dotenv").config()
const ObjectId= require("mongodb-legacy").ObjectId

module.exports = {
    adminValidation : async(email)=>{
     const admin = await  db.getDB().collection(process.env.admin_collection).findOne({email:email})
     return admin
    }

}