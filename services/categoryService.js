const db = require('../db')

module.exports = {
    addCategory : async(categoryName)=>{
      await db.getDB().collection(process.env.category_collection).insertOne({categoryName})
      
    },

    findAllCategory : async()=>{
        const category = await db.getDB().collection(process.env.category_collection).find({}).toArray()
        return category

    }

    

}