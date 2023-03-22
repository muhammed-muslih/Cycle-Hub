const db = require('../db')
const ObjectId= require("mongodb-legacy").ObjectId
const collecton = require('../config/collections')

module.exports= {
    addUser : async (firstName,lastName,email, password, phoneno)=>{
      const isBlocked = false
      const userId = await db.getDB().collection(collecton.user_collection).insertOne({firstName,lastName,email, password, phoneno,isBlocked});
            console.log(userId);
            return userId;
    },
    emailExistOrNot : async (email)=>{
        const emailExistOrNot = await db.getDB().collection(collecton.user_collection).findOne({email:email});
        return emailExistOrNot;
    },
    phoneNoExistOrNOt : async (phoneno)=>{
        const phoneNoExistOrNot = db.getDB().collection(collecton.user_collection).findOne({phoneno:phoneno})
        console.log("phone  : ",phoneNoExistOrNot);
        return phoneNoExistOrNot

    },
    findAllUser : async()=>{
        const users = await db.getDB().collection(collecton.user_collection).find({}).toArray()
        return users
    },
    ChangeUserStatus : async (userId)=>{
        const user = await db.getDB().collection(collecton.user_collection).findOne({_id: new ObjectId(userId)})
        if(user.isBlocked){
            await db.getDB().collection(collecton.user_collection).updateOne({_id: new ObjectId(userId)},{
                $set:{
                    isBlocked:false
                }
            })
            
        }else{
            await db.getDB().collection(collecton.user_collection).updateOne({_id: new ObjectId(userId)},{
                $set:{
                    isBlocked:true
                }
            })
        }
    },






}