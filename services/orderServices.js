const db = require("../db")
const ObjectId = require('mongodb-legacy').ObjectId
const collecton = require('../config/collections')
const collections = require("../config/collections")

module.exports={
    addOrder: async(userId,address,paymentMethod,grandTotal,products,date,status)=>{
        const paymentStatus = 'pending'
       const result= await db.getDB().collection(collections.order_collection).insertOne(
            {userId:userId,deliveryDetails:address,products:products,grandTotal:grandTotal,paymentMethod,date,status,paymentStatus}
        )
        return result
    },
    findUserAllOrders : async (userId)=>{

        const orders = await db.getDB().collection(collections.order_collection).find({userId:userId}).toArray()
        return orders

    },
    findOrderDetails : async (orderId)=>{

        const order = await db.getDB().collection(collections.order_collection).aggregate([

            {
                $match:{_id:new ObjectId(orderId)}
            },
            {
                $unwind:{path: '$products'}
            },
            {
                $lookup:{
                    from: 'product',
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: "productDetails"
                }
            },
            {
                $unwind:{path: '$productDetails'}
            },
            {
                $addFields:{'subtotal':{$multiply:['$products.quantity','$productDetails.price']}}

            }

        ]).toArray()
        return order
       
    },
    findAllOrders : async()=>{
        const orders = await db.getDB().collection(collecton.order_collection).find({}).toArray()
        return orders
    },
    orderStatusChange : async (orderId,status)=>{

        const result = await db.getDB().collection(collecton.order_collection).updateOne({_id:new ObjectId(orderId)},{
            $set:{status:status}
        })
        // console.log(result);
    }

   

}