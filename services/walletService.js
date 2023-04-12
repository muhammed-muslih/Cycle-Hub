const db = require('../db')
const collection = require('../config/collections')
const ObjectId = require('mongodb').ObjectId


const createWallet = async (userId,amount)=>{
    await db.getDB().collection(collection.wallet_collection).insertOne({user:new ObjectId(userId),amount:amount})
}

const findOneWallet = async(userId)=>{
    const wallet = await db.getDB().collection(collection.wallet_collection).findOne({user:new ObjectId(userId)})
    return wallet

}

const updateWallet = async (userId,amount)=>{

    await db.getDB().collection(collection.wallet_collection).updateOne({ user:new ObjectId(userId)},{
        $inc:{amount:amount}
    })

}


module.exports={
    createWallet,
    findOneWallet,
    updateWallet
}