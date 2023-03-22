const { ObjectId } = require('mongodb')
const db = require('../db')
const collecton = require('../config/collections')

module.exports = {
    addCategory : async(categoryName)=>{
      const isList =true
      await db.getDB().collection().insertOne({categoryName,isList})
      
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
      await db.getDB().collection(collecton.category_collection).updateOne({_id:new ObjectId(categoryId)},{
        $set:{
          categoryName:categoryName
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