const db = require('../db')
const collection = require('../config/collections')
const { ObjectId } = require('mongodb')
module.exports={
    findCart : async (userId)=>{

        const cart = await db.getDB().collection(collection.cart_collection).findOne({user:userId})
        return cart

    },

    addToCart :async (userId,productId)=>{
       const  products=[]
       const cartObject ={
        productId: new ObjectId(productId),
        quantity:1,
       }
       products.push(cartObject)
        await db.getDB().collection(collection.cart_collection).insertOne({user:userId,products})
    },

    updateCart : async (userId,productId)=>{
        const isproductExist = await db.getDB().collection(collection.cart_collection).findOne({user:userId,
            products:{
                $elemMatch:{
                    productId:new ObjectId(productId)
                    //productId
                }
            }})


        if(isproductExist){
            await db.getDB().collection(collection.cart_collection).updateOne({user:userId,products:{

                $elemMatch:{ productId:new ObjectId(productId) }
            }},
            {
                $inc:{"products.$.quantity":1}
            })
        }else{
            await db.getDB().collection(collection.cart_collection).updateOne({user:userId},
                {
                    $push:{products:{productId:new ObjectId(productId),quantity:1}}
                    //{upsert:true}
                
                }
            )
       
        }
   
    },
    getCart : async (userId)=>{
        const cart = await db.getDB().collection(collection.cart_collection).aggregate([
            {
                $match:{user:userId}

            },
            {
                $unwind:{path:"$products"}
            },
            {
                $lookup:{
                    from:"product",
                    localField:"products.productId",
                    foreignField:"_id",
                    as:"productDetails"
                }
            },
            {
                $unwind:{path:"$productDetails"}
            },
            {
               
                $project:{
                    products:1,
                    productDetails:1,
                    subTotal:{$multiply:["$products.quantity","$productDetails.price"]}
                }

            }
        ]).toArray()
        return cart
    },

    changeCartProductQuantity:async(cartId,productId,count)=>{
        await db.getDB().collection(collection.cart_collection)
        .updateOne({_id:new ObjectId(cartId),'products.productId':new ObjectId(productId)},{
            $inc:{'products.$.quantity':count}
                //increment product quantity
        })
        const res = await db.getDB().collection(collection.cart_collection)
        .updateOne({_id:new ObjectId(cartId)},{
            $pull:{
                products:{productId:new ObjectId(productId),quantity:0}
            }               //matching condition

        })
        return res
    },
    deleteCartProduct :async(userId,productId)=>{
        await db.getDB().collection(collection.cart_collection).updateOne({user:userId},{
            $pull:{products:{productId:new ObjectId(productId)}}
        })

    },
    deleteCart: async (userId)=>{
        console.log("user",userId);
        const result = await db.getDB().collection(collection.cart_collection).deleteOne({user:userId})
        console.log(result);
    }
}