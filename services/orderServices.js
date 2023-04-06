const db = require("../db")
const ObjectId = require('mongodb-legacy').ObjectId
const collection = require('../config/collections')
const collections = require("../config/collections")

module.exports={
    addOrder: async(userId,address,paymentMethod,subtotal,offerPrice,grandTotal,products,date,status)=>{
        const paymentStatus = 'pending'
       const result= await db.getDB().collection(collections.order_collection).insertOne(
            {userId:userId,deliveryDetails:address,products:products,subtotal:subtotal,offerPrice,grandTotal,paymentMethod,paymentStatus,date,status}
        )
        return result
    },
    findUserAllOrders : async (userId)=>{

        const orders = await db.getDB().collection(collections.order_collection).find({userId:userId}).sort({date:-1}).toArray() 
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
        const orders = await db.getDB().collection(collection.order_collection).find({}).sort({date:-1}).toArray() 
        return orders
    },
    orderStatusChange : async (orderId,status)=>{

        const result = await db.getDB().collection(collection.order_collection).updateOne({_id:new ObjectId(orderId)},{
            $set:{status:status}
        })

        if(status==='deliverd'){

          await db.getDB().collection(collection.order_collection).updateOne({_id:new ObjectId(orderId)},{
            $set:{paymentStatus:'paid'}

          })

        }
        // console.log(result);
    },
    orderandUserDetails : async (orderId)=>{
        const orderDetails = await db.getDB().collection(collection.order_collection).aggregate([
            
                {
                  '$match': {
                    '_id': new ObjectId(orderId)
                  }
                },
                 {
                  '$unwind': {
                    'path': '$products'
                  }
                },
                 {
                  '$lookup': {
                    'from': 'product', 
                    'localField': 'products.productId', 
                    'foreignField': '_id', 
                    'as': 'productDetails'
                  }
                },
                 {
                  '$unwind': {
                    'path': '$productDetails'
                  }
                },
                 {
                  '$lookup': {
                    'from': 'userData', 
                    'localField': 'userId', 
                    'foreignField': '_id', 
                    'as': 'userDetails'
                  }
                },
                 {
                  '$unwind': {
                    'path': '$userDetails'
                  }
                },
                {
                  $addFields:{'subtotal':{$multiply:['$products.quantity','$productDetails.price']}}
  
              }
              
        ]).toArray()
        return orderDetails

    },
    paymentStatusChange : async(orderId,status)=>{
      await db.getDB().collection(collection.order_collection).updateOne({_id:new ObjectId(orderId)},{
        $set:{
          paymentStatus:status}
      })
  

    },
    deliverdOrders: async()=>{
     const orders= await db.getDB().collection(collection.order_collection).aggregate([
        {$match:{status:"deliverd"}},
        {$project:{'deliveryDetails':0, 'products':0}},
        {$sort:{date:-1}}
      ]).toArray()
      return orders
    },

    filterOrderDate : async(startDate,endDate)=>{

      const orders = await db.getDB().collection(collection.order_collection).aggregate([
        { $match : { status:"deliverd" } },
        { $match: { $and : [ { date: { $gte: new Date(startDate) } } , { date : { $lte: new Date(endDate) } } ] } },
        { $project : { 'deliveryDetails' :0 , 'products' : 0 } },
        { $sort : { date:-1 } }

      ]).toArray()
      return orders

    }

   

}