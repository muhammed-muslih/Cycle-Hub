const db = require('../db')
const ObjectId = require('mongodb-legacy').ObjectId
const collection = require('../config/collections')

const addBanner = async (bannerText,banners)=>{
    const isChoose=false;
    await db.getDB().collection(collection.banner_collection).insertOne(
        { bannerText,banners,isChoose})
}

const findAllBanner = async()=>{
    const banners = await db.getDB().collection(collection.banner_collection).find({}).toArray()
    return banners

}

const findBanner =async()=>{
    const banner = await db.getDB().collection(collection.banner_collection).findOne({isChoose:true})
    return banner
}
const updateBanner = async(bannerId)=>{
    await db.getDB().collection(collection.banner_collection).updateMany({},{$set:{isChoose:false}})
    await db.getDB().collection(collection.banner_collection).updateOne({_id:new ObjectId(bannerId)},{
        $set:{isChoose:true}
    })  
}

const findOneBanner = async (bannerId)=>{
    const banner = await db.getDB().collection(collection.banner_collection).findOne({_id:new ObjectId(bannerId)})
    return banner
}

const editbanner = async (bannerId,bannerText,banners)=>{
    await db.getDB().collection(collection.banner_collection).updateOne({_id:new ObjectId(bannerId)},{
        $set:{bannerText,banners}
    })
}

const removeBanner = async(bannerId)=>{
    await db.getDB().collection(collection.banner_collection).removeOne({_id:new ObjectId(bannerId)})
}



module.exports={
    addBanner,
    findAllBanner,
    findBanner,
    updateBanner,
    findOneBanner,
    editbanner,
    removeBanner,
}