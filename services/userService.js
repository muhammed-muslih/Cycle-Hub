const db = require('../db')
const dotenv= require("dotenv").config()
const ObjectId= require("mongodb-legacy").ObjectId

module.exports= {
    addUser : async (firstName,lastName,email, password, phoneno)=>{
      const isBlocked = false
      const userId = await db.getDB().collection(process.env.user_collection).insertOne({firstName,lastName,email, password, phoneno,isBlocked});
            console.log(userId);
            return userId;
    },
    emailExistOrNot : async (email)=>{
        const emailExistOrNot = await db.getDB().collection(process.env.user_collection).findOne({email:email});
        return emailExistOrNot;
    },
    findAllUser : async()=>{
        const users = await db.getDB().collection(process.env.user_collection).find({}).toArray()
        return users
    },
    ChangeUserStatus : async (userId)=>{
        const user = await db.getDB().collection(process.env.user_collection).findOne({_id: new ObjectId(userId)})
        if(user.isBlocked){
            await db.getDB().collection(process.env.user_collection).updateOne({_id: new ObjectId(userId)},{
                $set:{
                    isBlocked:false
                }
            })
            
        }else{
            await db.getDB().collection(process.env.user_collection).updateOne({_id: new ObjectId(userId)},{
                $set:{
                    isBlocked:true
                }
            })
        }
    },






}