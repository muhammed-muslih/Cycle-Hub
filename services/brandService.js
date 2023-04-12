const db = require('../db')
const ObjectId = require('mongodb-legacy').ObjectId
const collecton = require('../config/collections')

module.exports={

    addBrand : async(brandName)=>{
       const   isList=true
       await  db.getDB().collection(collecton.brand_collection).insertOne({brandName,isList})
    },
    findAllBrand : async ()=>{
        const brand = await db.getDB().collection(collecton.brand_collection).find({}).toArray()
        return brand
    },
    findListedBrand : async()=>{
        const brand = await db.getDB().collection(collecton.brand_collection).find({isList:true}).toArray()
        return brand

    },
    brandListorunlist : async(brandId)=>{
        const brand = await db.getDB().collection(collecton.brand_collection).findOne({_id:new ObjectId(brandId)})
        if(brand.isList){
            await db.getDB().collection(collecton.brand_collection).updateOne({_id:new ObjectId(brandId)},{
                $set:{
                    isList:false
                }
            })
        }else{
            await db.getDB().collection(collecton.brand_collection).updateOne({_id:new ObjectId(brandId)},{
                $set:{
                    isList:true
                }
            })
        }

    },
    updateBrand : async (brandId,brandName)=>{
        await db.getDB().collection(collecton.brand_collection).updateOne({_id:new ObjectId(brandId)},{
            $set:{
                brandName:brandName
            }
        })
    },
    isBrandExist : async (brandName)=>{
        const brand = await db.getDB().collection(collecton.brand_collection).findOne({brandName:brandName})
        return brand
    },

    addImage : async (brandId,image)=>{

        await db.getDB().collection(collecton.brand_collection).updateOne({_id:new ObjectId(brandId)},{
            $set:{image}

        })

    }

}