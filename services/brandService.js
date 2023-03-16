const db = require('../db')

module.exports={

    addBrand : async(brandName)=>{
       await  db.getDB().collection(process.env.brand_collection).insertOne({brandName})
    },
    findAllBrand : async ()=>{
        const brand = await db.getDB().collection(process.env.brand_collection).find({}).toArray()
        return brand
    }

}