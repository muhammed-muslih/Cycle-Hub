const db = require("../db")
const ObjectId = require('mongodb-legacy').ObjectId
const collecton = require('../config/collections')

module.exports={

    addProduct : async (productName,productId,productDescription,category,brand,price,quantity,isDelete,images,variants)=>{
        const date = new Date()
        price=parseInt(price)
        quantity=parseInt(quantity)
        category = new ObjectId(category)
        brand = new ObjectId(brand)
        await db.getDB().collection(collecton.product_collection).insertOne({productName,productId,productDescription,category,brand,price,quantity,isDelete,images,variants,date})
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

    findAllUserProduct:async(skip,limit,searchkey)=>{
        const  product  =  await db.getDB().collection(collecton.product_collection).aggregate([
            {
                $match: {
                    isDelete:false
                }

            },
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
    
            },
            {$skip: skip},
            {$limit:limit}
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

                productName: productName,productId,productDescription:productDescription,category:category,brand:brand,price:price,
                quantity:quantity,images:newImages,variants
            }
        })
      
    },

    findCategoryProduct : async(categoryId,skip,limit)=>{
        const products = await db.getDB().collection(collecton.product_collection).find({category:new ObjectId(categoryId)}).skip(skip).limit(limit).toArray()
        return products
    },

    findTotalCategoryProduct : async(categoryId)=>{
        const products = await db.getDB().collection(collecton.product_collection).countDocuments({category:new ObjectId(categoryId)})
        return products
    },

    findBrandProduct : async(brandId)=>{
        const products= await db.getDB().collection(collecton.product_collection).find({brand:new ObjectId(brandId)}).toArray()
        return products
    },

    findTotalBrandProduct : async(brandId)=>{
        const products= await db.getDB().collection(collecton.product_collection).countDocuments({brand:new ObjectId(brandId)})
        return products
    },



    productExist : async(productName)=>{
        const product = await db.getDB().collection(collecton.product_collection).findOne({productName})
        return  product
    },

    updateStock: async  (productId,quantity)=>{

        await db.getDB().collection(collecton.product_collection).updateOne({_id:productId},{
            $inc:{quantity:quantity}
        })
    },

    newArrivals : async ()=>{
        const products = await db.getDB().collection(collecton.product_collection).find({}).sort({date:-1}).limit(8).toArray()
        return products
    },

    totalProducts : async()=>{
        const totalProducts = await db.getDB().collection(collecton.product_collection).countDocuments({isDelete:false})
        return totalProducts

    },

    filterPrice : async(minPrice,maxPrice,skip,limit)=>{
        const  product  =  await db.getDB().collection(collecton.product_collection).aggregate([
            {
                $match: {
                    isDelete:false
                }

            },
            {
                $match: {
                    price:{$lte:maxPrice,$gte:minPrice}
                }

            },
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
    
            },
            {$skip:skip},
            {$limit:limit}
        ]).toArray()
        console.log(product);
        return product
    },
    totalFilterProducts : async(minPrice,maxPrice)=>{
        const totalProducts = await db.getDB().collection(collecton.product_collection).countDocuments({isDelete:false, price:{$lte:maxPrice,$gte:minPrice}})
        return totalProducts

    },

    productQuantity : async (productId)=>{

        const productQuantity = await db.getDB().collection(collecton.product_collection).aggregate([
            {
                $match: {
                  _id:new ObjectId(productId)
                }
            },
            {
                $project :{quantity:1}

            }
        ]).toArray()
        return productQuantity

    },

    findAllSearchProduct:async(skip,limit,searchkey)=>{
        const  product  =  await db.getDB().collection(collecton.product_collection).aggregate([
            {
                $match: {
                    isDelete:false
                }

            },
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
    
            },
            {
                $unwind: {
                  path: '$brandDetails',
                 
                }
            },
            {
                $unwind: {
                  path: '$categoryDetails',
                }
    
            },
            {
                $match: {
                  $or:[
                    {productName:{$regex:searchkey,$options:'i'}},
                    {'brandDetails.brandName':{$regex:searchkey,$options:'i'}},
                    {'categoryDetails.categoryName':{$regex:searchkey,$options:'i'}},
                  ]
                }

            },
            {$skip: skip},
            {$limit:limit}
        ]).toArray()
        return product
    
        },
    
    

    


}