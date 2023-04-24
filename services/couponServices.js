const db = require('../db')
const collection = require('../config/collection')
const ObjectId = require('mongodb-legacy').ObjectId

const addCoupon = async (couponCode,min_amount,discount,expiryDate)=>{
    const createdDate = new Date() 
    console.log(createdDate);
    expiryDate = new Date(expiryDate)
    const isExpired=false

    await db.getDB().collection(collection.coupon_collection).insertOne({couponCode,min_amount,discount,createdDate,expiryDate,isExpired})
}


const findAllCoupon = async ()=>{
    coupons = db.getDB().collection(collection.coupon_collection).find({isExpired:false}).sort({createdDate:-1}).toArray()  
    return coupons
  
}


const getcoupon = async(userId,subtotal)=>{

    const coupon = await db.getDB().collection(collection.coupon_collection).findOne({couponActiveUser:{$nin:[userId]},
        isExpired:false,min_amount:{$lte:subtotal},couponUsedUser:{$nin:[userId]}})
    // console.log(coupon);
    if(coupon){
        await db.getDB().collection(collection.coupon_collection).updateOne({_id:coupon._id},{
            $push:{couponActiveUser:userId}
        })
    }

    return coupon
}


const findUsercoupon = async(userId)=>{
const coupons = await db.getDB().collection(collection.coupon_collection).find({isExpired:false,couponActiveUser:{$in:[userId]}})
.sort({createdDate:-1}).toArray()
return coupons
}


const findOneCoupon = async (userId,couponCode)=>{
    const coupon = await db.getDB().collection(collection.coupon_collection).findOne({couponActiveUser:{$in:[userId]},couponCode:couponCode})
    return coupon
}


const usedCoupon = async (userId,couponCode)=>{
        await db.getDB().collection(collection.coupon_collection).updateOne(
            { couponCode },
            {
              $pull: { couponActiveUser: userId },
              $push: { couponUsedUser: userId }
            }
          )
}


const isCouponExist = async (couponCode)=>{
    const coupon = await db.getDB().collection(collection.coupon_collection).findOne({couponCode})
    return coupon
}


const checkCouponExpired = async ()=>{
    const currentDate= new Date()
    await db.getDB().collection(collection.coupon_collection).updateMany(
        { expiryDate: { $lt: currentDate } },
        { $set: { isExpired: true } }
      );

}

const deleteCoupon = async (couponId)=>{
    await db.getDB().collection(collection.coupon_collection).updateOne(
        {_id:new ObjectId(couponId)},
        { $set: { isExpired: true } }
        )
    
}






module.exports = {
    addCoupon,
    findAllCoupon,
    getcoupon,
    findUsercoupon,
    findOneCoupon,
    usedCoupon,
    isCouponExist,
    checkCouponExpired,
    deleteCoupon,
  
}

