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
        // console.log("phone  : ",phoneNoExistOrNot);
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

    addAddress : async (address,userId)=>{
        address._id=new ObjectId()
        await db.getDB().collection(collecton.user_collection).updateOne({_id:userId},{
            $push:{address:address}
        })


    },
    findAddress : async (userId)=>{
        const address = await db.getDB().collection(collecton.user_collection).aggregate([

            { $match:{_id:userId }},
            {$unwind:{path:"$address"}},
            {$project:{address:1}}
            
        ]).toArray()
        return address
    },
    findOneAddress : async(userId,addressId)=>{
        const address = await db.getDB().collection(collecton.user_collection).aggregate([
            {$match:{_id:userId}},
            {$unwind:{path:'$address'}},
            {$match:{'address._id': new ObjectId(addressId)}},
            {$project:{address:1,_id:0}}

        ]).toArray()
        return address

    },

    getUser : async (userId)=>{
        const user = await db.getDB().collection(collecton.user_collection).findOne({_id:userId})
        return user

    }






}