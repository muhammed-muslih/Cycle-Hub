const { ObjectId } = require('mongodb')
const db = require('../db')
const collecton = require('../config/collection')
const  slugify = require('slugify')
module.exports = {
    addCategory : async(categoryName)=>{
      const isList =true
      await db.getDB().collection(collecton.category_collection).insertOne({categoryName,isList})
      
    },

    findAllCategory : async()=>{
        const category = await db.getDB().collection(collecton.category_collection).find({}).toArray()
        return category

    },

    findListedAllCategory:async()=>{
      const category = await db.getDB().collection(collecton.category_collection).find({isList:true}).toArray()
      return category

    },
    categoryListOrUnlist : async (categoryId)=>{
     const category = await db.getDB().collection(collecton.category_collection).findOne({_id:new ObjectId(categoryId)})
     if(category.isList){
      await db.getDB().collection(collecton.category_collection).updateOne({_id:new ObjectId(categoryId)},{
        $set:{
          isList:false
        }
      })
     }else{
      await db.getDB().collection(collecton.category_collection).updateOne({_id:new ObjectId(categoryId)},{
        $set:{
          isList:true
        }
      })
     }

    },
    updateCategory:async (categoryId,categoryName)=>{
      const slug = slugify(categoryName)

      await db.getDB().collection(collecton.category_collection).updateOne({_id:new ObjectId(categoryId)},{
        $set:{
          categoryName:categoryName,slug
        }
      })
    },
    findoneCategory : async(id)=>{
      const category = await db.getDB().collection(collecton.category_collection).findOne({_id:new ObjectId(id)})
      return category

  },
  isCategoryAlreadyExist : async(categoryName)=>{
    const category = await db.getDB().collection(collecton.category_collection).findOne({categoryName:categoryName})
    return category
  }

    

}