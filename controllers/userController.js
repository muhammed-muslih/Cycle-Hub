const productServices = require('../services/productServices')
const categoryServices = require('../services/categoryService');
const brandService = require('../services/brandService');
const cartServices = require("../services/cartService");
const userService = require('../services/userService');
const orderService = require('../services/orderServices')
const ObjectId = require('mongodb').ObjectId



module.exports = {
    homePageRender:async(req,res,next)=>{
        const user=req.session.userName
        // console.log(user);
        res.render('userView/homePage',{user,loggedIn:req.session.loggedIn});
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
        const user=req.session.userName
        const categoryId = req.query.categoryId
        const brandId = req.query.brandId
        if(categoryId){
            const products = await productServices.findCategoryProduct(categoryId)
            const category = await categoryServices.findListedAllCategory()
            const brands = await brandService.findListedBrand()
            for (let i = 0; i < products.length; i++) {
                products[i].price = products[i].price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
              }
            res.render('userView/shopePage',{products,category,brands,user,loggedIn:req.session.loggedIn})

        }else if(brandId){
            const products = await productServices.findBrandProduct(brandId)
            const category = await categoryServices.findListedAllCategory()
            const brands = await brandService.findListedBrand()
            for (let i = 0; i < products.length; i++) {
                products[i].price = products[i].price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
              }
            res.render('userView/shopePage',{products,category,brands,user,loggedIn:req.session.loggedIn})

        }else{
            const brands = await brandService.findListedBrand()
            const products=await productServices.findAllProduct()
            const category = await categoryServices.findListedAllCategory()
            for (let i = 0; i < products.length; i++) {
                products[i].price = products[i].price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
              }
            res.render('userView/shopePage',{products,category,brands,user,loggedIn:req.session.loggedIn})

        }
            
    },
    renderSingleProductView : async(req,res)=>{
        const user=req.session.userName
        const productId = req.params.id
        const product = await productServices.findSingleProduct(productId)
        product[0].price=product[0].price.toLocaleString('en-IN',{style:'currency',currency:'INR'})
        console.log(product);
        res.render('userView/singleproductView',{product,user,loggedIn:req.session.loggedIn})

    },
    cartpagerender : async(req,res)=>{
        const user=req.session.userName
        const userId= req.session.userId
        const cart = await cartServices.getCart(userId)
        let totalPrice =0
        for(var i=0;i<cart.length;i++){
            totalPrice=totalPrice+cart[i].subTotal
            cart[i].productDetails.price = cart[i].productDetails.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
            cart[i].subTotal = cart[i].subTotal.toLocaleString('en-IN',{ style: 'currency', currency:'INR' })
        }
        // console.log(cart);
        totalPrice=totalPrice.toLocaleString('en-IN',{ style: 'currency', currency:'INR' })
        res.render('userView/cart',{loggedIn:req.session.loggedIn,user,cart,totalPrice})
    },
    addToCart:async (req,res)=>{
        const productId = req.params.id
        const userId = req.session.userId
        const iscartExist = await cartServices.findCart(userId)
        if(iscartExist){
            await cartServices.updateCart(userId,productId)

        }else{
            await cartServices.addToCart(userId,productId)
        }
        res.json({
            status: "success",
            message: "product added to cart"
          })
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
        const user=req.session.userName
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
       
        res.render('userView/checkOut',{loggedIn:req.session.loggedIn,user,product,totalPrice,address})
    },
    addAddress : async(req,res)=>{
        console.log( "address",req.body);
        console.log(req.session.userId);
        await userService.addAddress(req.body,req.session.userId)

        res.redirect('/checkout')

    },
    placeOrder : async(req,res)=>{
       let {products,addressid,paymentMethod,total}=req.body
       let userId=req.session.userId
       let address = await userService.findOneAddress(userId,addressid)
       address=address[0].address
       for(var i = 0;i<products.length;i++){
        products[i].productId = new ObjectId(products[i].productId )
       }
       let status
       if(paymentMethod === 'cod'){
        status="placed"
       }
       const date = new Date().toLocaleString({timeZone: 'Asia/Kolkata'});
       const result = await orderService.addOrder(userId,address,paymentMethod,total,products,date,status)
       await cartServices.deleteCart(userId)
       if(result){
        res.json({
            status:"success",
            message:"order placed successfuly"

        })

       }
        
    },
    orderListPageRender : async (req,res)=>{
        const user=req.session.userName
        const userId = req.session.userId
        const orders = await orderService.findUserAllOrders(userId)
        console.log("...........",orders);
        for(var i= 0;i<orders.length;i++){
            orders[i]. grandTotal = orders[i]. grandTotal.toLocaleString('en-IN',{ style: 'currency', currency:'INR' })
        }
        res.render('userView/orderList',{user,loggedIn:req.session.loggedIn,orders})
    },
    orderDetailspageRender : async (req,res)=>{
        const user=req.session.userName
        const orderId = req.params.id
        const orders = await orderService.findOrderDetails(orderId)
        console.log(orders);
        for(var i=0;i<orders.length;i++){
            orders[i].productDetails.price = orders[i].productDetails.price.toLocaleString('en-IN',{ style: 'currency', currency:'INR' })
            orders[i].subtotal = orders[i].subtotal.toLocaleString('en-IN',{ style: 'currency', currency:'INR' })
            orders[i].grandTotal = orders[i].grandTotal.toLocaleString('en-IN',{ style: 'currency', currency:'INR' })
        }
        res.render('userView/orderDetails',{user,loggedIn:req.session.loggedIn,orders})
    },
    orderSuccessPage :(req,res)=>{
        const user=req.session.userName
        res.render('userView/orderSuccess',{user,loggedIn:req.session.loggedIn})
    }
    
}