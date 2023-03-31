const db = require('../db')
const collection = require('../config/collections')
const ObjectId = require('mongodb').ObjectId

const addWhishList = async (userId,productId)=>{
    const products=[]
    const product={
        productId:new ObjectId(productId)
    }
    products.push(product)
    await db.getDB().collection(collection.whishlist_collecton).insertOne({user:userId,products})
   
}

const isWhishListExist= async(userId)=>{
    const whishList = await db.getDB().collection(collection.whishlist_collecton).findOne({user:userId})
    return whishList
}

const updateWhishList = async(userId,productId)=>{
    const isproductExist = await db.getDB().collection(collection.whishlist_collecton).findOne({user:userId,
        products:{$elemMatch:{productId:new ObjectId(productId)}}
    })
    if(!isproductExist){
         await db.getDB().collection(collection.whishlist_collecton).updateOne({user:userId},
            {
                $push:{products:{productId:new ObjectId(productId)}}
            }
           
        )
        return "added"
    }else{

        await db.getDB().collection(collection.whishlist_collecton).updateOne({user:userId},
            {
                $pull:{products:{productId: new ObjectId(productId)}}
            })
            return "remove"
    }

}

const getWhishList = async (userId)=>{
    const products = await db.getDB().collection(collection.whishlist_collecton).aggregate([
            {
              $match: {
                user: userId
              }
            },
             {
              $unwind: {
                path: '$products'
              }
            },
             {
              $lookup: {
                from: 'product', 
                localField: 'products.productId', 
                foreignField: '_id', 
                as: 'productDetails'
              }
            },
             {
              $unwind: {
                path: '$productDetails'
              }
            }
          ]).toArray()
          return products
}


module.exports={
    addWhishList,
    isWhishListExist,
    updateWhishList,
    getWhishList,
}