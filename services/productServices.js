const db = require("../db")
const ObjectId = require('mongodb-legacy').ObjectId
const collecton = require('../config/collections')

module.exports={

    addProduct : async (productName,productId,productDescription,category,brand,price,quantity,isDelete,images,variants)=>{
        
        price=parseInt(price)
        quantity=parseInt(quantity)
        category = new ObjectId(category)
        brand = new ObjectId(brand)
        await db.getDB().collection(collecton.product_collection).insertOne({productName,productId,productDescription,category,brand,price,quantity,isDelete,images,variants})
    },

    findAllProduct:async()=>{
    const  product  =  await db.getDB().collection(collecton.product_collection).aggregate([

        {
            $lookup:{
                from :"category",
                localField :"category",
                foreignField :"_id",
                as:"categoryDetails"
            }
        },
        {
             $lookup :{
                from:"brand",
                localField:"brand",
                foreignField : "_id",
                as:"brandDetails"
             }

        }
    ]).toArray()
    return product

    },
    productStatus: async (productId)=>{
        const product = await db.getDB().collection(collecton.product_collection).findOne({_id:new ObjectId(productId)})
        if(product.isDelete){
            await db.getDB().collection(collecton.product_collection).updateOne({_id: new ObjectId(productId)},{
                $set:{
                    isDelete:false
                }

            })

        }else{

            await db.getDB().collection(collecton.product_collection).updateOne({_id:new ObjectId(productId)},{
                $set:{
                    isDelete:true
                }
            })

        }
    },
    findProduct: async (productID)=>{
        const product = await db.getDB().collection(collecton.product_collection).findOne({_id:new ObjectId(productID)})
        return product
    },
    findSingleProduct:async (productid)=>{
       const product= await db.getDB().collection(collecton.product_collection).aggregate([
            {
                $match:{
                    _id:new ObjectId(productid)

                }
            },
            {
                $lookup:{
                    from:"category",
                    localField:"category",
                    foreignField:"_id",
                    as:"categoryDetails"
                }
            },
            {
                $lookup:{
                    from:"brand",
                    localField:"brand",
                    foreignField:'_id',
                    as:"brandDetails"
                }
            }
        ]).toArray()
        return product

    },
    editProduct : async (productID,productName,productId,productDescription,category,brand,price,quantity,newImages,variants)=>{

        category= new ObjectId(category)
        brand = new ObjectId(brand)
        quantity=parseInt(quantity)
        price=parseInt(price)


       await db.getDB().collection(collecton.product_collection).updateOne({_id:new ObjectId(productID)},{
            $set:{

                productName: productName,productId,productDescription:productDescription,category:category,brand:brand,price:price,quantity:quantity,images:newImages,variants
            }
        })
      
    },
    findCategoryProduct : async(categoryId)=>{
        const products = await db.getDB().collection(collecton.product_collection).find({category:new ObjectId(categoryId)}).toArray()
        return products
    },
    findBrandProduct : async(brandId)=>{
        const products= await db.getDB().collection(collecton.product_collection).find({brand:new ObjectId(brandId)}).toArray()
        return products
    },
    productIdExist : async(productId)=>{
        const product = await db.getDB().collection(collecton.product_collection).findOne({productId:productId})
        return  product
    }


}