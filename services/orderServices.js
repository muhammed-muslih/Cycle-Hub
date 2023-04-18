const db = require("../db")
const ObjectId = require('mongodb-legacy').ObjectId
const collection = require('../config/collections')
const collections = require("../config/collections")

module.exports={
    addOrder: async(userId,address,paymentMethod,subtotal,offerPrice,grandTotal,products,status)=>{
        const paymentStatus = 'pending'
        const orderDate=new Date().toISOString().slice(0,10)
        const date = new Date()
       const result= await db.getDB().collection(collections.order_collection).insertOne(
            {userId:userId,deliveryDetails:address,products:products,subtotal:subtotal,offerPrice,grandTotal,paymentMethod,paymentStatus,date,orderDate,status}
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
        const orders = await db.getDB().collection(collection.order_collection).find().sort({date:-1}).toArray() 
        // console.log(orders);
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

    },

    findOrderProductAndQuantity : async (orderId)=>{
      const products =await db.getDB().collection(collection.order_collection).aggregate([
        {$match:{_id:new ObjectId(orderId)}},
        {$unwind:{path:'$products'}},
        {$project:{products:1}}
      ]).toArray()

      return products
      

  },
  findPriceOfOneOrder : async (orderId)=>{
    const order =await db.getDB().collection(collection.order_collection).aggregate([
      {$match:{_id:new ObjectId(orderId)}},
      {$project:{ grandTotal:1}}
    ]).toArray()
    return order

  },

  deliverdOrdersCount : async ()=>{
    const deliverdOrder = await db.getDB().collection(collection.order_collection).countDocuments({status:'deliverd'})
    return deliverdOrder

  },

  currentDayTotalSale : async()=>{
    const sales = await db.getDB().collection(collection.order_collection).aggregate([
      {$match:{status:'deliverd'}},
      {$match:{orderDate:new Date().toISOString().slice(0,10)}}
    ]).toArray()
    return sales
  },

  weekSale : async(startDate)=>{
    
    let endDate = new Date()
    endDate=endDate.toISOString().slice(0,10)
    const sales = await db.getDB().collection(collection.order_collection).aggregate([
      {$match:{status:'deliverd'}},
      {$match:{
        orderDate:{$gte:startDate,$lte:endDate}
      }},
      {$project:{grandTotal:1,orderDate:1}}
    ]).toArray()
     
    if(sales){
      let amount = 0
    sales.forEach(sale => {
      amount=amount+sale.grandTotal
    });
    return amount

    }
  },

  filterSales : async(startDate,endDate)=>{
    const salesAmount = await db.getDB().collection(collection.order_collection).aggregate([
      {$match:{status:'deliverd'}},
      {$match:{  orderDate:{$gte:startDate,$lt:endDate}} },
      { $group: {_id: null, total: {$sum: '$grandTotal'}}},
    ]).toArray()
    return salesAmount

  },

  totalSale : async ()=>{
    const totalSale = await db.getDB().collection(collection.order_collection).aggregate([
      {$match: {
        status:'deliverd'
      }},
      {$group: {
        _id: null,
        total: {
          $sum: '$grandTotal'
        }
      }}
    ]).toArray()
    return totalSale

  },

  salesPerMonth : async(startDate,endDate)=>{

    const salesPerMonth = await db.getDB().collection(collection.order_collection).aggregate([
      {
        $match:{ 
          status:'deliverd'
          
        }
      },
      {
        $match :{
          orderDate:{
            $gte:startDate,
            $lt:endDate
          }
        }
      },
      {
        $group: {
          _id: {
            $month:'$date'
          },
          sale: {
            $sum: '$grandTotal'
          }
        }

      }
    ]).toArray()
    return salesPerMonth
  },

  getOrderStatusAndCount : async ()=>{

    const orderStatusDetails = await db.getDB().collection(collection.order_collection).aggregate([
      {
        $group: {
          _id:'$status',
          count: {
            "$sum": 1
          }
        }
      }
    ]).toArray()
    return orderStatusDetails

  }

   

}