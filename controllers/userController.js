const productServices = require('../services/productServices')
const categoryServices = require('../services/categoryService');
const brandService = require('../services/brandService');
const cartServices = require("../services/cartService");
const userService = require('../services/userService');
const orderService = require('../services/orderServices')
const ObjectId = require('mongodb').ObjectId
const bannerServices = require('../services/bannerServices')
const whishListServices = require('../services/whishListService')
const couponService = require('../services/couponServices')
const razorpay = require('../util/razorpay');
const walletService = require('../services/walletService')



module.exports = {
    homePageRender:async(req,res,next)=>{
        const user=req.session.userName+" "+req.session.lastName
        // console.log(user);
        const banner = await bannerServices.findBanner()
        const brands = await brandService.findListedBrand()
        const newProducts = await productServices.newArrivals()
       for (let i = 0; i < newProducts.length; i++) {
        newProducts[i].price = newProducts[i].price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
       }
        res.render('userView/homePage',{user,loggedIn:req.session.loggedIn,banner,brands,newProducts});
    },
    loginPageRender:(req,res)=>{
        const message= req.query.message
        console.log(message);
        if(req.session.loggedIn){
            res.redirect('/')

        }else{
        res.render('userView/userLogin',{message:message})
        }
    },
    signupPageRender:(req,res)=>{
        const message = req.query.message
        if(req.session.loggedIn){
            res.redirect('/')
        }else{
        res.render('userView/userSignup',{message:message})   
        }
    },
    sessionDestroy :(req,res)=>{
        req.session.userName=null
        req.session.loggedIn=false
        res.redirect('/')
    },
    otpLoginPagerender:(req,res)=>{
        res.render('userView/otplogin')
    },
    renderShopePage :  async (req,res)=>{
        
        const userId= req.session.userId
        const user=req.session.userName+" "+req.session.lastName
        const categoryId = req.query.categoryId
        const brandId = req.query.brandId
        const maxPrice=  parseInt(req.query.maxPrice) 
        
        const minPrice = parseInt(req.query.minPrice)  
        let page = req.query.page || 1
        let limit = 9
        let skip = (page-1)*limit
        const totalProduct = await productServices.totalProducts()
        const totalPage = Math.ceil(totalProduct/limit)
        let currentPage = parseInt(page) 
        console.log(currentPage);

        var sortMessage='Sort by Price'
        if(maxPrice){
            const brands = await brandService.findListedBrand()
            const products=await productServices.filterPrice(minPrice,maxPrice,skip,limit)
            const category = await categoryServices.findListedAllCategory()
            for (let i = 0; i < products.length; i++) {
                products[i].price = products[i].price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
              }
              sortMessage=`₹${minPrice} - ₹${maxPrice}`
            res.render('userView/shopePage',{products,category,brands,user,loggedIn:req.session.loggedIn,userId,currentPage,totalPage,sortMessage})

        }else if(categoryId){
            const products = await productServices.findCategoryProduct(categoryId,skip,limit)
            const category = await categoryServices.findListedAllCategory()
            const brands = await brandService.findListedBrand()
            for (let i = 0; i < products.length; i++) {
                products[i].price = products[i].price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
              }
              
            res.render('userView/shopePage',{products,category,brands,user,loggedIn:req.session.loggedIn, userId,currentPage,totalPage,sortMessage})

        }else if(brandId){
            const products = await productServices.findBrandProduct(brandId,skip,limit)
            const category = await categoryServices.findListedAllCategory()
            const brands = await brandService.findListedBrand()
            for (let i = 0; i < products.length; i++) {
                products[i].price = products[i].price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
              }
            res.render('userView/shopePage',{products,category,brands,user,loggedIn:req.session.loggedIn,userId,currentPage,totalPage,sortMessage})

        }else{
            const brands = await brandService.findListedBrand()
            const products=await productServices.findAllProduct(skip,limit)
            const category = await categoryServices.findListedAllCategory()
            for (let i = 0; i < products.length; i++) {
                products[i].price = products[i].price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
              }
            //   console.log(products);
            res.render('userView/shopePage',{products,category,brands,user,loggedIn:req.session.loggedIn,userId,currentPage,totalPage,sortMessage})

        }
            
    },

    renderBrandProducts : async (req,res)=>{
        const brandId = req.params.id
        const user=req.session.userName+" "+req.session.lastName
        const userId= req.session.userId
        const products = await productServices.findBrandProduct(brandId)
        const category = await categoryServices.findListedAllCategory()
        const brands = await brandService.findListedBrand()
        for (let i = 0; i < products.length; i++) {
            products[i].price = products[i].price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
          }
        res.render('userView/shopePage',{products,category,brands,user,loggedIn:req.session.loggedIn,userId})
    },

    renderSingleProductView : async(req,res)=>{
        const user=req.session.userName+" "+req.session.lastName
        const productId = req.params.id
        const product = await productServices.findSingleProduct(productId)
        product[0].price=product[0].price.toLocaleString('en-IN',{style:'currency',currency:'INR'})
        console.log(product);
        res.render('userView/singleproductView',{product,user,loggedIn:req.session.loggedIn})

    },
    cartpagerender : async(req,res)=>{
        const user=req.session.userName+" "+req.session.lastName
        const userId= req.session.userId
        const cart = await cartServices.getCart(userId)
        let totalPrice =0
        for(var i=0;i<cart.length;i++){
            totalPrice=totalPrice+cart[i].subTotal
            cart[i].productDetails.price = cart[i].productDetails.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
            cart[i].subTotal = cart[i].subTotal.toLocaleString('en-IN',{ style: 'currency', currency:'INR' })
        }
        const wallet = await walletService.findOneWallet(userId)
        if(wallet){
            wallet.amount = wallet.amount.toLocaleString('en-IN',{ style: 'currency', currency:'INR' })
        }
        
        // console.log(cart);
        totalPrice=totalPrice.toLocaleString('en-IN',{ style: 'currency', currency:'INR' })
        console.log(cart);

        
        res.render('userView/cart',{loggedIn:req.session.loggedIn,user,cart,totalPrice,wallet})
    },
    addToCart:async (req,res)=>{
        const productId = req.params.id
        const userId = req.session.userId
       
        let cart= await cartServices.findOneCartProduct(userId,productId)
        var  cartQuantity= cart[0]?cart[0].products.quantity:0
        const productQuantity = await productServices.productQuantity(productId)
       
        const iscartExist = await cartServices.findCart(userId)
        if(iscartExist){
            console.log("product",productQuantity[0].quantity);
            console.log("cart",cartQuantity+1);  

            if((productQuantity[0].quantity) - (cartQuantity+1 ) < 0 ){
                 res.json({
                    status: "failed",
                    message: "product out of stock"
                    })

            }else{
                await cartServices.updateCart(userId,productId)
                res.json({
                    status: "success",
                    message: "product added to cart"
                  })
            }
        }else{
            await cartServices.addToCart(userId,productId)
            res.json({
                status: "success",
                message: "product added to cart"
              })
        }
        
    },

    changeCartProductQuantity:async(req,res)=>{
        let {cartId,productId,count}=req.body
        // console.log(req.body);
        const quantityChange = await cartServices.changeCartProductQuantity(cartId,productId,count)
        console.log(quantityChange);
        if(quantityChange.modifiedCount===1){
            res.json({
                status:'removed',
                mesasge:'item removed',
            })
        }else{
            res.json({
                status:"changed",
                message:"product quantity changedd",
            })
        }


    },
    deleteCartProduct:async(req,res)=>{
        const productId = req.params.id
        console.log(productId);
        const userId = req.session.userId
        console.log(userId);
        await cartServices.deleteCartProduct(userId,productId)
        res.json({
            status:"delete",
            message:"item deleted"
        })

    },
    checkoutPageRender : async (req,res)=>{
        const user=req.session.userName+" "+req.session.lastName
        const userId = req.session.userId
        const product = await cartServices.getCart(userId)

        let totalPrice =0
        for(var i=0;i<product.length;i++){
            totalPrice=totalPrice+product[i].subTotal
            product[i].productDetails.price = product[i].productDetails.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
            product[i].subTotal = product[i].subTotal.toLocaleString('en-IN',{ style: 'currency', currency:'INR' })
        }
        totalPrice=totalPrice.toLocaleString('en-IN',{ style: 'currency', currency:'INR' })
        const address = await userService.findAddress(userId)
        // console.log(address[0].address.firstName);
        const wallet = await walletService.findOneWallet(userId)
        var walletAmount
        if(wallet){
            walletAmount = wallet.amount
        }else{
             walletAmount = 0000
            
        }

       
        res.render('userView/checkOut',{loggedIn:req.session.loggedIn,user,product,totalPrice,address,walletAmount})
    },
    addAddress : async(req,res)=>{
        console.log( "address",req.body);
        console.log(req.session.userId);
        await userService.addAddress(req.body,req.session.userId)

        res.redirect('/checkout')

    },
    placeOrder : async(req,res)=>{

       let {products,addressid,paymentMethod,subtotal,offerPrice,grandTotal,couponCode}=req.body
       let userId=req.session.userId
       console.log(req.body);
       let address = await userService.findOneAddress(userId,addressid)
       address=address[0].address
       for(var i = 0;i<products.length;i++){
        products[i].productId = new ObjectId(products[i].productId )
       }

       

       
       if(paymentMethod === 'cod'){
        let status = "pending"
        const result = await orderService.addOrder(userId,address,paymentMethod,subtotal,offerPrice,grandTotal,products,status)
        var  orderId = result.insertedId

        products.forEach(async (product) => {
            product.quantity = product.quantity *-1
            await productServices.updateStock(product.productId,product.quantity)
        });


        if(couponCode){
            await couponService.usedCoupon(userId,couponCode)
          }
   
         var iscouponExist=false
          const coupon = await couponService.getcoupon(userId,grandTotal)
          console.log("coupon",coupon);
          if(coupon){
           iscouponExist=true
          }
        status="placed"
        await orderService.orderStatusChange(orderId,status)
        await cartServices.deleteCart(userId)
        console.log(result);
        if(result){
         res.json({
             status:"success",
             message:"order placed successfuly",
             orderId:result.insertedId,
             iscouponExist:iscouponExist
         })
 
        }

       }else if(paymentMethod=== 'razorpay'){

        const razoResOrder = await razorpay.generateRazorpay(orderId,grandTotal)
        const user = await userService.getUser(userId)
        console.log("razorpay",razoResOrder);
        res.json({
            orderId :orderId,
            razorpayId :razoResOrder.id,
            amount:razoResOrder.amount,
            userName:user.firstName+" "+user.lastName,
            userEmail:user.email,
            userPhone:user.phoneno
        })

       }else if(paymentMethod==='wallet'){

        let status = "pending"
        const result = await orderService.addOrder(userId,address,paymentMethod,subtotal,offerPrice,grandTotal,products,status)
        var  orderId = result.insertedId

        products.forEach(async (product) => {
            product.quantity = product.quantity *-1
            await productServices.updateStock(product.productId,product.quantity)
        });

        await orderService.paymentStatusChange(orderId,'paid')
        // update wallet
        let amount = grandTotal*-1
        await walletService.updateWallet(userId,amount)

        if(couponCode){
            await couponService.usedCoupon(userId,couponCode)
          }
   
         var iscouponExist=false
          const coupon = await couponService.getcoupon(userId,grandTotal)
          console.log("coupon",coupon);
          if(coupon){
           iscouponExist=true
          }
        status="placed"
        await orderService.orderStatusChange(orderId,status)
        await cartServices.deleteCart(userId)
        console.log(result);
        if(result){
         res.json({
             status:"success",
             message:"order placed successfuly",
             orderId:result.insertedId,
             iscouponExist:iscouponExist
         })
 
        }

       }
        
    },


    orderListPageRender : async (req,res)=>{
        const user=req.session.userName+" "+req.session.lastName
        const userId = req.session.userId
        const orders = await orderService.findUserAllOrders(userId)
        for(var i= 0;i<orders.length;i++){
            orders[i]. grandTotal = orders[i]. grandTotal.toLocaleString('en-IN',{ style: 'currency', currency:'INR' })
            orders[i]. offerPrice = orders[i].offerPrice.toLocaleString('en-IN',{ style: 'currency', currency:'INR' })
            orders[i]. subtotal = orders[i]. subtotal.toLocaleString('en-IN',{ style: 'currency', currency:'INR' })
            orders[i].date =  orders[i].date.toLocaleString()

        }
        res.render('userView/orderList',{user,loggedIn:req.session.loggedIn,orders})
    },
    orderDetailspageRender : async (req,res)=>{
        const user=req.session.userName+" "+req.session.lastName
        const orderId = req.params.id
        console.log("..",orderId);
        const orders = await orderService.findOrderDetails(orderId)
        console.log(orders);
        var total = 0
        for(var i=0;i<orders.length;i++){
            total = orders[i].subtotal+total
            orders[i].productDetails.price = orders[i].productDetails.price.toLocaleString('en-IN',{ style: 'currency', currency:'INR' })
            orders[i].subtotal = orders[i].subtotal.toLocaleString('en-IN',{ style: 'currency', currency:'INR' })
            orders[i].grandTotal = orders[i].grandTotal.toLocaleString('en-IN',{ style: 'currency', currency:'INR' })
            orders[i]. offerPrice = orders[i].offerPrice.toLocaleString('en-IN',{ style: 'currency', currency:'INR' })
            orders[i].date =  orders[i].date.toLocaleString()
        }
        total=total.toLocaleString('en-IN',{ style: 'currency', currency:'INR' })
        res.render('userView/orderDetails',{user,loggedIn:req.session.loggedIn,orders,total})
    },
    orderSuccessPage :(req,res)=>{
        const user=req.session.userName+" "+req.session.lastName
        // console.log("...........",req.query.orderId);
        const orderId = req.query.orderId
        console.log("success",orderId);
        res.render('userView/orderSuccess',{user,loggedIn:req.session.loggedIn,orderId})
    },
    ChangeBanner :async(req,res)=>{
        const bannerId = req.params.id
        console.log(bannerId);
        await bannerServices.updateBanner(bannerId)
        res.json({
            status:'banner changed'
        })
    },
    renderWhislist : async(req,res)=>{
        const user=req.session.userName+" "+req.session.lastName
        const userId = req.session.userId
        const products = await whishListServices.getWhishList(userId)
        console.log(products);
        res.render('userView/whishList',{user,loggedIn:req.session.loggedIn,products,userId})
    },

    addWhishList : async (req,res)=>{
        let {productId}=req.body
        console.log(productId);
        const userId = req.session.userId
        const whishList = await whishListServices.isWhishListExist(userId)
        if(whishList){
           const result=  await whishListServices.updateWhishList(userId,productId)
           if(result === 'added'){
            res.json({
                status:"added",
                message:"item added to the whishList"
            })
           }else{
            res.json({
                status:"removed",
                message:"item added to the whishList"
            })
           }
        }else{
         await whishListServices.addWhishList(userId,productId)
         res.json({
            status:"added",
            message:"item added to the whishList"
        })
        }
       
    },

    renderRewardPage : async(req,res)=>{
        const user=req.session.userName+" "+req.session.lastName
        const userId = req.session.userId
        await couponService.checkCouponExpired()
        const coupons =  await couponService.findUsercoupon(userId)
        for(var i=0;i<coupons.length;i++){
            coupons[i].expiryDate =  coupons[i].expiryDate.toLocaleString().slice(0,9)
        }
        console.log(coupons);
        res.render('userView/rewards',{user,loggedIn:req.session.loggedIn,coupons})

    },


    verifyCoupon : async (req,res)=>{
        const userId = req.session.userId
        console.log(req.body);
        let { couponCode } = req.body
        console.log(userId);
        const coupon = await couponService.findOneCoupon(userId,couponCode)
        console.log(coupon);
        const currentDate = new Date()
        if(!coupon){

            res.json({status:"invalid"})

        }else if(coupon.expiryDate < currentDate || coupon.isExpired){

            res.json({status:"expired"})

        }else{

            res.json({
                status:'success',
                percentage: coupon.discount
            })

        }

       
    },

    verifyPayment : async (req,res)=>{
        
        let {razorResponse, orderId,amount,couponCode,order}=req.body
        let { products,addressid,paymentMethod,subtotal,offerPrice,grandTotal} = order
        console.log(products);
        console.log(addressid);
        console.log(paymentMethod);

        const userId = req.session.userId
        const isPaymentSuccess =  razorpay.verifyPayment(razorResponse)
        
        if(isPaymentSuccess){

        products.forEach((product)=>{
            product.productId = new ObjectId( product.productId)
        })
        console.log("success");
        let address = await userService.findOneAddress(userId,addressid)
        address=address[0].address
        console.log(address);
        const status = 'placed'
        const result = await orderService.addOrder(userId,address,paymentMethod,subtotal,offerPrice,grandTotal,products,status)
         var orderid = result.insertedId
         await orderService.paymentStatusChange(orderid,'paid')
         products.forEach(async(product)=>{
            product.quantity = product.quantity*-1
            await productServices.updateStock(product.productId,product.quantity)
         })
  
        
        await cartServices.deleteCart(userId)
          



        if(couponCode){
            await couponService.usedCoupon(userId,couponCode)
          }
        var iscouponExist=false
        const coupon = await couponService.getcoupon(userId,amount)
        console.log("coupon",coupon);
        if(coupon){
         iscouponExist=true
        }
           
            res.json({
                status: "success",
                message: "order placed",
                orderId:orderid,
                iscouponExist:iscouponExist
              })

        }else{
            console.log(orderid);
            await orderService.paymentStatusChange(orderid,"cancelled")
            res.json({
                status: "cancelled",
                message: "payment failed"
              })
        }

    },

    userProfilePageRender : async (req,res)=>{
        const userId = req.session.userId
        const user=req.session.userName+" "+req.session.lastName
        const userDetails = await userService.getUser(userId)
        console.log(userDetails);
        // userDetails.firstName = userDetails.firstName.toUpperCase()
        // userDetails.lastName = userDetails.lastName.toUpperCase()
        res.render('userView/userProfile',{user,loggedIn:req.session.loggedIn,userDetails})

    },
    changeProfileDetails : async(req,res)=>{
        console.log('profile');
        const userId = req.session.userId
        let {firstName,lastName,email, phoneno} = req.body
        const result = await userService.changeUserDerails(userId,firstName,lastName,email, phoneno)
        console.log(result);
        if(result.modifiedCount === 1){

            res.json({
                status:"changed"
            })

        }else{            
            res.json({
                status:"not changed"
            })
        }
    },

    userAddress:async (req,res)=>{
        const userId = req.session.userId
        const user=req.session.userName+" "+req.session.lastName
        const address = await userService.findAddress(userId)
        console.log(address);
        res.render('userView/address',{user,loggedIn:req.session.loggedIn,address})
    },

    updateAddress: async (req,res)=>{
        const addressId = req.params.id
        const userId = req.session.userId
        console.log(addressId);
        console.log(req.body);
        let {firstName, lastName, address, district,city,pincode, phone} = req.body
        await userService.updateAddress(userId,addressId,firstName, lastName, address, district,city,pincode, phone)
        res.redirect('/address-details')

    },

    deleteAddress: async (req,res)=>{
        const addressId = req.params.id
        const userId = req.session.userId
        console.log(addressId);
        await userService.deleteAddress(userId,addressId)
        res.redirect('/address-details')
        
    },

    cancelOrder : async (req,res)=>{
        let{orderId,status}=req.body
        console.log(req.body);
        const products = await orderService.findOrderProductAndQuantity(orderId)
        console.log(products);
        products.forEach(async (product)=>{
            await productServices.updateStock(product.products.productId,product.products.quantity)
            await orderService.orderStatusChange(orderId,status)

        })
        res.json({
            status:'changed'
        })

    },

    renderWalletPage : async(req,res)=>{
        const userId = req.session.userId
        const user=req.session.userName+" "+req.session.lastName
        const wallet = await walletService.findOneWallet(userId)
        if(wallet){
        wallet.amount = wallet.amount.toLocaleString('en-IN',{ style: 'currency', currency:'INR' })
        }
        console.log(wallet);
        res.render('userView/myWallet',{user,loggedIn:req.session.loggedIn,wallet})


    },



    
    
}
