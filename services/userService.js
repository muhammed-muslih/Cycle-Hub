const db = require('../db')
const ObjectId= require("mongodb-legacy").ObjectId
const collection = require('../config/collections')

module.exports= {
    addUser : async (firstName,lastName,email, password, phoneno)=>{
      const isBlocked = false
      const userId = await db.getDB().collection(collection.user_collection).insertOne({firstName,lastName,email, password, phoneno,isBlocked});
            console.log(userId);
            return userId;
    },
    emailExistOrNot : async (email)=>{
        const emailExistOrNot = await db.getDB().collection(collection.user_collection).findOne({email:email});
        return emailExistOrNot;
    },
    phoneNoExistOrNOt : async (phoneno)=>{
        const phoneNoExistOrNot = db.getDB().collection(collection.user_collection).findOne({phoneno:phoneno})
        // console.log("phone  : ",phoneNoExistOrNot);
        return phoneNoExistOrNot

    },
    findAllUser : async()=>{
        const users = await db.getDB().collection(collection.user_collection).find({}).toArray()
        return users
    },
    ChangeUserStatus : async (userId)=>{
        const user = await db.getDB().collection(collection.user_collection).findOne({_id: new ObjectId(userId)})
        if(user.isBlocked){
            await db.getDB().collection(collection.user_collection).updateOne({_id: new ObjectId(userId)},{
                $set:{
                    isBlocked:false
                }
            })
            
        }else{
            await db.getDB().collection(collection.user_collection).updateOne({_id: new ObjectId(userId)},{
                $set:{
                    isBlocked:true
                }
            })
        }
    },

    addAddress : async (address,userId)=>{
        address._id=new ObjectId()
        await db.getDB().collection(collection.user_collection).updateOne({_id:userId},{
            $push:{address:address}
        })


    },
    findAddress : async (userId)=>{
        const address = await db.getDB().collection(collection.user_collection).aggregate([

            { $match:{_id:userId }},
            {$unwind:{path:"$address"}},
            {$project:{address:1}}
            
        ]).toArray()
        return address
    },
    findOneAddress : async(userId,addressId)=>{
        const address = await db.getDB().collection(collection.user_collection).aggregate([
            {$match:{_id:userId}},
            {$unwind:{path:'$address'}},
            {$match:{'address._id': new ObjectId(addressId)}},
            {$project:{address:1,_id:0}}

        ]).toArray()
        return address

    },

    getUser : async (userId)=>{
        const user = await db.getDB().collection(collection.user_collection).findOne({_id:userId})
        return user

    },
    updatePassword:async(userId,password)=>{
        const result = await db.getDB().collection(collection.user_collection).updateOne({_id:userId},{
            $set:{password}
        })
        return result

    },

    changeUserDerails :async (userId,firstName,lastName,email, phoneno)=>{
      const result=   await db.getDB().collection(collection.user_collection).updateOne({_id:userId},{
            $set:{firstName,lastName,email, phoneno}
        })
        return result

    },

    updateAddress:async (userId,addressId,firstName, lastName, address, district,city,pincode, phone)=>{

        await db.getDB().collection(collection.user_collection).updateOne({_id:userId,'address._id':new ObjectId(addressId)},{
            $set:{'address.$.firstName':firstName,'address.$.lastName': lastName,'address.$.address': address, 
            'address.$.district':district,'address.$.city':city,'address.$.pincode':pincode,'address.$.phone': phone}
        })

    },

    deleteAddress:async (userId,addressId)=>{
        await db.getDB().collection(collection.user_collection).updateOne({_id:userId},{
            $pull:{address:{_id:new ObjectId(addressId)}}
        })

    }






}