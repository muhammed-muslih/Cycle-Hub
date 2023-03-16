const db = require("../db")
const ObjectId = require('mongodb-legacy').ObjectId

module.exports={

    addProduct : async (productName,productDescription,category,brand,price,quantity,isDelete,images)=>{

        price=parseInt(price)
        quantity=parseInt(quantity)
        category = new ObjectId(category)
        brand = new ObjectId(brand)
        await db.getDB().collection(process.env.product_collection).insertOne({productName,productDescription,category,brand,price,quantity,isDelete,images})
    },

    findAllProduct:async()=>{
    const  product  =  await db.getDB().collection(process.env.product_collection).aggregate([

        {
            $match:{
                isDelete:{
                    $ne:true
                }
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

        }
    ]).toArray()
    return product

    },
    deleteProduct: async (productId)=>{
        await db.getDB().collection(process.env.product_collection).updateOne({_id:new ObjectId(productId)},{
            $set:{
                isDelete:true
            }
        })
    },
    findProduct: async (productId)=>{
        const product = await db.getDB().collection(process.env.product_collection).findOne({_id:new ObjectId(productId)})
        return product
    },
    findEditProduct:async (productid)=>{
       const product= await db.getDB().collection(process.env.product_collection).aggregate([
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
    editProduct : async (productId,productName,productDescription,category,brand,price,quantity,newImages)=>{

        category= new ObjectId(category)
        brand = new ObjectId(brand)
        quantity=parseInt(quantity)
        price=parseInt(price)


       const result = await db.getDB().collection(process.env.product_collection).updateOne({_id:new ObjectId(productId)},{
            $set:{

                productName: productName,productDescription:productDescription,category:category,brand:brand,price:price,quantity:quantity,images:newImages
            }
        })
        console.log(result);
    }


}