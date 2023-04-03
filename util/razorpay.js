const razorpay = require('razorpay')
const dotenv = require('dotenv')
const crypto = require("crypto");

const instance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

const generateRazorpay = async (orderId,total)=>{
    total = parseInt(total)
    console.log(""+orderId);
    console.log(total);
    try{

      const order = await   instance.orders.create({
            amount: total*100 ,  // amount in the smallest currency unit
            currency: "INR",
            receipt: ""+orderId
        })
        return order

    }catch(err){
        console.log(err);
    } 
}

const verifyPayment = (razorResponse)=>{
      console.log("verify");
    let hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)

    hmac.update(razorResponse.razorpay_order_id + '|' + razorResponse.razorpay_payment_id)
    hmac = hmac.digest('hex')
    if(hmac===razorResponse.razorpay_signature){
        return true
    }else{
        return false
    }


}

module.exports={
    generateRazorpay,
    verifyPayment
}