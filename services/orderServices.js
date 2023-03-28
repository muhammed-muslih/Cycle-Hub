const db = require("../db")
const ObjectId = require('mongodb-legacy').ObjectId
const collecton = require('../config/collections')
const collections = require("../config/collections")

module.exports={
    addOrder: async(userId,address,paymentMethod,grandTotal,products,date,status)=>{
       const result= await db.getDB().collection(collections.order_collection).insertOne(
            {userId:userId,deliveryDetails:address,products:products,grandTotal:grandTotal,paymentMethod,date,status}
        )
        return result
    }
   

}