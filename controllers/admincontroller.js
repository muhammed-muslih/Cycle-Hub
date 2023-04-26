const userService = require('../services/userService')
const productService = require('../services/productServices')
const categoryService = require('../services/categoryService')
const cloudinary = require('../util/cloudinary')
const brandService = require('../services/brandService')
const orderService = require('../services/orderServices')
const bannerService = require('../services/bannerServices')
const couponService = require("../services/couponServices")
const walletService = require('../services/walletService')



module.exports={

    adminDashboardRender:async (req,res,next)=>{

        try {

            const dashBoardClass='active'
       
            //    orderCount
               let deliverdOrders = await orderService.deliverdOrdersCount()
               if(deliverdOrders){
               deliverdOrders=deliverdOrders.toLocaleString()
               }else{
                deliverdOrders=000
               }
        
                //total customers
               let totalCustomers = await userService.totalCustomers()
               if(totalCustomers){
                totalCustomers = totalCustomers.toLocaleString()
               }else{
                totalCustomers=000
               }
                
               //total product
               let totalProducts = await productService.totalProducts()
               if(totalProducts){
                totalProducts=totalProducts.toLocaleString()
               }else{
                totalProducts=000
               }
        
        
               //today sale
               let todaySales = await orderService.currentDayTotalSale()
            //    console.log(todaySales);
               let todaysAmount = 0
               if(todaySales){
                todaySales.forEach((sales)=>{
                 todaysAmount=todaysAmount+sales.grandTotal
                })
                todaysAmount=todaysAmount.toLocaleString('en-IN',{ style: 'currency', currency:'INR' })
               }else{
                todaysAmount="₹000"
               }
              
                // week sale
               let startDate= new Date()
               startDate.setDate(startDate.getDate() - 7)
               startDate = startDate.toISOString().slice(0,10)
               let weekSale =await orderService.weekSale(startDate)
               if(weekSale){
                weekSale=weekSale.toLocaleString('en-IN',{style:'currency',currency:'INR'})
               }else{
                weekSale="₹000"
               }
        
                //month sale
               let startMonthDate = new Date(new Date().getFullYear() ,new Date().getMonth())
               startMonthDate.setUTCHours(startMonthDate.getUTCHours() + 5, startMonthDate.getUTCMinutes() + 30); // Add 5 hours and 30 minutes for IST timezone
               startMonthDate = startMonthDate.toISOString().slice(0, 10);
        
               let endMonthDate = new Date(new Date().getFullYear(),new Date().getMonth() + 1)
               endMonthDate.setUTCHours(endMonthDate.getUTCHours() + 5, endMonthDate.getUTCMinutes() + 30); // Add 5 hours and 30 minutes for IST timezone
               endMonthDate = endMonthDate.toISOString().slice(0, 10);
        
            //    console.log(startMonthDate);
            //    console.log(endMonthDate);
               let monthlyAmount= await orderService.filterSales(startMonthDate,endMonthDate)
               if(monthlyAmount[0]){
                monthlyAmount=monthlyAmount[0].total.toLocaleString('en-IN',{style:'currency',currency:'INR'})
               }else{
                monthlyAmount="₹000"
               }
            //    console.log(monthlyAmount);
        
              
               //year sale
               const date = new Date().getFullYear()
               let startYearDate = new Date(date, 0, 1);  // January is 0 and December is 11.
               startYearDate.setUTCHours(startYearDate.getUTCHours() + 5, startYearDate.getUTCMinutes() + 30); // Add 5 hours and 30 minutes for IST timezone
               startYearDate = startYearDate.toISOString().slice(0, 10);
            //    console.log(startYearDate);
        
               let  endYearDate = new Date(date+1,0,1)
               endYearDate.setUTCHours(endYearDate.getUTCHours() + 5,endYearDate.getUTCMinutes() + 30 )
               endYearDate= endYearDate.toISOString().slice(0,10)
            //    console.log(endYearDate);
        
               let  yearAmount = await orderService.filterSales(startYearDate,endYearDate)
               if(yearAmount[0]){
               yearAmount=yearAmount[0].total.toLocaleString('en-IN',{style:'currency',currency:'INR'})
               }else{
                yearAmount="₹000"
               }
            //    console.log(yearAmount);
        
               
               //total sale
               let totalSale = await orderService.totalSale()
               if(totalSale[0]){
                totalSale = totalSale[0].total.toLocaleString('en-IN',{style:'currency',currency:'INR'})
               }else{
                totalSale="₹000"
               }
            //    console.log(totalSale);
                
               res.render('adminView/dashBoard',{layout:"adminLayout",dashBoardClass,deliverdOrders,totalCustomers,totalProducts,todaysAmount,
                weekSale,monthlyAmount,yearAmount,totalSale})
            
        } catch (error) {
            console.log(error);
            next(error)
            
        }


      
       
    },

    dashBoardData : async (req,res,next)=>{

        try {

             //sales permonth
        const date = new Date().getFullYear()
        let startYearDate = new Date(date, 0, 1);  // January is 0 and December is 11.
        startYearDate.setUTCHours(startYearDate.getUTCHours() + 5, startYearDate.getUTCMinutes() + 30); // Add 5 hours and 30 minutes for IST timezone
        startYearDate = startYearDate.toISOString().slice(0, 10);
        
        let  endYearDate = new Date(date+1,0,1)
        endYearDate.setUTCHours(endYearDate.getUTCHours() + 5,endYearDate.getUTCMinutes() + 30 )
        endYearDate= endYearDate.toISOString().slice(0,10)
 
        const salesPerMonth = await orderService.salesPerMonth(startYearDate,endYearDate)
        // console.log(salesPerMonth);
 
        const orderStatusDetails = await orderService.getOrderStatusAndCount()
        // console.log(orderStatusDetails);
        res.json({
         salesPerMonth,
         orderStatusDetails
        })
            
        } catch (error) {

            console.log(error);
            next(error)
        }

       


    },

    renderUserList : async (req,res)=>{

        try {

            const userClass='active'
            const users = await userService.findAllUser()
            res.render('adminView/userView',{layout:"adminLayout",users,userClass})
            
        } catch (error) {

            console.log(error);
            next(error)
            
        }
  
    },


    userBlockAndUnBlock: async (req,res,)=>{
        try {
            const userId = req.params.id
            await userService.ChangeUserStatus(userId)
            req.session.userName=null
            req.session.loggedIn=false
            res.redirect('/admin/user-list')
        } catch(err){
            console.log(err);
        }
    },


    renderAdminLoginPage : (req,res)=>{

        try {

            const message = req.query.message
            if(req.session.adminLoggedIn){
                res.redirect('/admin')
            }else{
            res.render('adminView/adminLogin',{layout:"adminLayout",adminLogin:true,message})
            }
            
        } catch (error) {

            console.log(error);
            
        }

    },


    sessionDestroy : (req,res)=>{
        req.session.admin=null
        req.session.adminLoggedIn = false
        res.redirect('/admin')

    },


    renderProductAddPage : async (req,res)=>{
        try {

            const productClass='active'
            const category = await categoryService.findListedAllCategory()
            const brand = await brandService.findListedBrand()
            res.render('adminView/addProduct',{layout:"adminLayout",category,brand,productClass})
            
        } catch (error) {

            console.log(error);
            
        }
      
    },


    addProduct: async (req,res)=>{

        const productExist = await productService.productExist(req.body.productName)
        if(productExist){
            
            res.redirect('/admin/productList?message=product is already exist')
        }else{

            try{
                console.log("ctaegory add",req.files);
                console.log(req.body);
                let {productName,productId,productDescription,category,brand,price,quantity,variants}=req.body
                console.log(variants);
                console.log(brand[0]);
                let isDelete = false
                const images=[]
                for(let i=0;i<req.files.length;i++){
                    const {url} = await cloudinary.uploader.upload(req.files[i].path)
                    images.push(url)
                }
                await productService.addProduct(productName,productId,productDescription,category,brand,price,quantity,isDelete,images,variants)
                res.redirect('/admin/productList')
            }catch(err){
                console.log(err);
    
            } 

        }
          
   },


   addCategory: async(req,res)=>{

    try {

        let {categoryName} = req.body
        const iscategoryAlreadyExist = await categoryService.isCategoryAlreadyExist(categoryName)
         if(iscategoryAlreadyExist){
           res.redirect('/admin/categoryList?message=Category name already exist')
        }else{
           await categoryService.addCategory(categoryName)
           res.redirect('/admin/categoryList')
        }
        
    } catch (error) {
        console.log(error);
        
    }

   },


   renderCategoryList:async (req,res)=>{

    try {

        const categoryClass='active'
        const message = req.query.message
        // console.log(message);
        const category= await categoryService.findAllCategory()
        // const oneCategory = await categoryService.findoneCategory(id)
        console.log(category);
         res.render('adminView/CategoryList',{layout:"adminLayout",category,message,categoryClass})
        
    } catch (error) {
        console.log(error);    
    }

   },

   renderproductList : async(req,res)=>{

    try {

        const productClass='active'
        const message = req.query.message
        // console.log(message);
        const products = await productService.findAllProduct()
        for(var i=0;i<products.length;i++){
            products[i].price = products[i].price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
        }
        res.render('adminView/productView',{layout:"adminLayout", products,message,productClass})
        
    } catch (error) {
        console.log(error);
        
    }
  

   },


   renderBrandList : async (req,res)=>{

    try {

        const brandClass='active'
        let message = req.query.message
        // console.log(message);
        const brands = await brandService.findAllBrand()
        res.render('adminView/brandList',{layout:"adminLayout",brands,message,brandClass})
        
    } catch (error) {
        console.log(error);
        
    }

   },


   addBrand:async (req,res)=>{

    try {

        let {brandName}=req.body
        const isBfrandExist = await brandService.isBrandExist(brandName)
        if(isBfrandExist){
           res.redirect('/admin/addBrand?message=brand name already exist')

        }else{
           await brandService.addBrand(brandName)
          res.redirect('/admin/addBrand')
        }
        
    } catch (error) {
        console.log(error);
        
    }

   },


   deleteProduct : async(req,res)=>{

    try {

        const productId = req.params.id
        // console.log(productId);
        await productService.productStatus(productId)
        res.redirect('/admin/productList')
        
    } catch (error) {
        console.log(error);  
    }


   },


   renderEditproductPage :async (req,res)=>{
    const productClass='active'
    try{
        const productId= req.params.id
    const [product,category,brand] = await Promise.all([

        await productService.findSingleProduct(productId),
        await categoryService.findAllCategory(),
        await brandService.findAllBrand()
    ])
    res.render('adminView/editProduct',{layout:"adminLayout",product,category,brand,productClass})

    }catch(err){
        console.log(err);
    }
    
   },


   editProduct : async (req,res)=>{
    try{
    const productID=req.params.id
    let {productName,productId,productDescription,category,brand,price,quantity,variants} = req.body
    const images=[]
    // console.log(req.files.image);

    for(let i=0;i<req.files.length;i++){
        const {url} = await cloudinary.uploader.upload(req.files[i].path)
        images.push(url)
    }
    console.log(images);
    const product = await productService.findProduct(productID)
    const newImages=[...product.images.slice(images.length),...images]

    await productService.editProduct(productID,productName,productId,productDescription,category,brand,price,quantity, newImages,variants)
    res.redirect('/admin/productList')
    }catch(err){
        console.log(err);
    }
    
   },


   categoryListorunlist: async (req,res)=>{

    try {

        const categoryId= req.params.id
        await categoryService.categoryListOrUnlist(categoryId)
        res.redirect('/admin/categoryList')
        
    } catch (error) {
        console.log(error);
        
    }

   },


   editCategory:async(req,res)=>{

    try {

        const categoryId = req.params.id
        let {categoryName}=req.body
        const iscategoryAlreadyExist = await categoryService.isCategoryAlreadyExist(categoryName)
        if(iscategoryAlreadyExist){
           res.redirect('/admin/categoryList?message=Category name already exist')
        }else{
           await categoryService.updateCategory(categoryId,categoryName)
           res.redirect('/admin/categoryList')
        }
        
    } catch (error) {
        console.log(error);
    }

   },


   brandListOrUnlist : async (req,res)=>{
    try {

        const brandId = req.params.id
        await brandService.brandListorunlist(brandId)
        res.redirect('/admin/addBrand')
        
    } catch (error) {
        console.log(error);
        
    }

   },


   updateBrand : async (req,res)=>{

    try {

        const brandId = req.params.id
        let {brandName}=req.body
        const isBrandExist = await brandService.isBrandExist(brandName)
        if(isBrandExist){
          res.redirect('/admin/addBrand?message=brand name already exist')

        }else{
           await brandService.updateBrand(brandId,brandName)
           res.redirect('/admin/addBrand')
        }
        
    } catch (error) {
        console.log(error);
        
    }

   },


   productdetails : async(req,res)=>{

    try {

        const productId = req.params.id
        console.log(productId);
        const product = await productService.findSingleProduct(productId)
        product[0].price=product[0].price.toLocaleString('en-IN',{style:'currency',currency:'INR'})
        console.log(product);
        res.render('adminView/singleproduct',{layout:"adminLayout",product})
        
    } catch (error) {

        console.log(error);
        
    }
    

   },


   renderOrderList : async(req,res)=>{

    try {
        console.log("order");
        const orderClass='active'
        const orders = await orderService.findAllOrders()
        console.log(orders);
        for(var i=0;i<orders.length;i++){
           orders[i].grandTotal = orders[i].grandTotal.toLocaleString('en-IN',{style:'currency',currency:'INR'})
           orders[i].date =  orders[i].date.toLocaleString()
        }
         // console.log(orders);
         res.render('adminView/orders',{layout:"adminLayout",orders,orderClass})
        
    } catch (error) {
        console.log(error);
        
    }
   },


   changeOrderStatus : async(req,res)=>{

    try {


    let {orderId,paymentStatus,status,userId}=req.body
    if(status==='cancelled' &&paymentStatus ==='paid'){
     const order = await orderService.findPriceOfOneOrder(orderId)
     const amount = order[0].grandTotal
     const isWalletExist = await walletService.findOneWallet(userId)
     if(isWalletExist){
        await walletService.updateWallet(userId,amount)
        await orderService.orderStatusChange(orderId,status)
        await orderService.paymentStatusChange(orderId,'refund')
     }else{
     await  walletService.createWallet(userId,amount)
     await orderService.orderStatusChange(orderId,status)
     await orderService.paymentStatusChange(orderId,'refund')
     }

    }else if(status ==='returned'){
        const order = await orderService.findPriceOfOneOrder(orderId)
        const amount = order[0].grandTotal
        const isWalletExist = await walletService.findOneWallet(userId)
        if(isWalletExist){
        await walletService.updateWallet(userId,amount)
        await orderService.orderStatusChange(orderId,status)
        await orderService.paymentStatusChange(orderId,'refund')
        }else{
        await  walletService.createWallet(userId,amount)
        await orderService.orderStatusChange(orderId,status)
        await orderService.paymentStatusChange(orderId,'refund')
        }

    }else{

    await orderService.orderStatusChange(orderId,status)

    }
        res.json({
            status:"status changed"
        })
        
    } catch (error) {
        console.log(error);
        
    }
    
   },


   orderDetails : async(req,res)=>{


    try {

        const orderId = req.params.id
        const orderClass='active'
        // console.log(orderId);
        const orders = await orderService.orderandUserDetails(orderId)
        var total =0
        for(var i=0;i<orders.length;i++){
            total = total+orders[i].subtotal
            orders[i].grandTotal = orders[i].grandTotal.toLocaleString('en-IN',{style:'currency',currency:'INR'})
            orders[i].productDetails.price =  orders[i].productDetails.price.toLocaleString('en-IN',{style:'currency',currency:'INR'})
            orders[i].subtotal = orders[i].subtotal.toLocaleString('en-IN',{style:'currency',currency:'INR'})
            orders[i].offerPrice = orders[i].offerPrice.toLocaleString('en-IN',{style:'currency',currency:'INR'})
            orders[i].date =  orders[i].date.toLocaleString()
    
        }
        total=total.toLocaleString('en-IN',{style:'currency',currency:'INR'})
        res.render('adminView/orderdetail',{layout:"adminLayout",orders,orderClass,total})
        
    } catch (error) {

        console.log(error);
        
    }

   },


   renderAddBanner : async (req,res)=>{

    try {
       console.log('banner');
        const bannerClass='active'
        const banners = await bannerService.findAllBanner()
        console.log(banners);
        res.render('adminView/banner',{layout:"adminLayout",banners,bannerClass})
        
    } catch (error) {
        console.log(error);
    }

   },


   addBanner:async(req,res)=>{
    try{

        // console.log(req.body);
        let {bannerText} = req.body
         console.log(req.files);
         const banners=[]
         for(var i=0;i<req.files.length;i++){
            const {url} = await cloudinary.uploader.upload(req.files[i].path)
            banners.push(url)
         }
         console.log(banners);
         await bannerService.addBanner(bannerText,banners)
        res.redirect('/admin/add-banner')

    }catch(err){
        console.log(err);
    }
    

   },


   editBanner : async (req,res)=>{
    try{
        let {bannerText} = req.body
        const bannerId= req.params.id
        const editBanners=[]
        for(var i=0;i<req.files.length;i++){
            const {url}=await cloudinary.uploader.upload(req.files[i].path)
            editBanners.push(url)
        }
        // console.log(editBanners);
     const banner=await bannerService.findOneBanner(bannerId)
    //  console.log(banner);
     const banners=[...banner.banners.slice(editBanners.length),...editBanners]
     await bannerService.editbanner(bannerId,bannerText,banners)
     res.redirect('/admin/add-banner')
    }catch(err){
        console.log(err);
    }

   },


   removeBanner : async (req,res)=>{
    try {

        const bannerId = req.params.id
        await bannerService.removeBanner(bannerId)
        res.redirect('/admin/add-banner')
        
    } catch (error) {
        console.log(error);
    }
   
   },

   renderBrandBanner :async (req,res)=>{
    try {

        const brandClass='active'
        const brands = await brandService.findAllBrand()
        // console.log(brands);
        res.render('adminView/brandBanner',{layout:"adminLayout", brandClass,brands})
        
    } catch (error) {

        console.log(error);
        
    }
   },

   addBrandImage : async (req,res)=>{

    try {

        const brandId = req.params.id
        // console.log(brandId);
        // console.log(req.file);
        const {url}= await cloudinary.uploader.upload(req.file.path)
        console.log(url);
        const image = url
        await brandService.addImage(brandId,image)
        res.redirect('/admin/brand-banner')
        
    } catch (error) {
        console.log(error);
 
    }
   },


   renderCouponPage : async (req,res)=>{

    try {
        console.log("coupon");
        let message = req.query.message
        const couponClass = "active"
        await couponService.checkCouponExpired()
        const coupons =  await couponService.findAllCoupon()
        for(var i=0;i<coupons.length;i++){
            coupons[i].createdDate = coupons[i].createdDate.toLocaleString()
            coupons[i].expiryDate =   coupons[i].expiryDate.toLocaleString()
        }
        res.render('adminView/coupons',{layout:'adminLayout',couponClass,coupons,message})
    
        
    } catch (error) {

        console.log(error);
        
    }

   },


   addCoupon : async(req,res)=>{

    try {

        let {couponCode,min_amount,discount,expiryDate}=req.body
        const coupon =  await couponService.isCouponExist(couponCode)
    
        if(coupon){
            res.redirect('/admin/coupon-list?message="coupon already exist"')
    
        }else{
    
        min_amount=parseInt(min_amount)
        discount=parseInt(discount)
        await couponService.addCoupon(couponCode,min_amount,discount,expiryDate)
        res.redirect('/admin/coupon-list')
    
        }
        
    } catch (error) {

        console.log(error);
        
    }

   },


   deleteCoupon : async (req,res)=>{
    try {

        const couponId = req.params.id
        await couponService.deleteCoupon(couponId)
        res.redirect('/admin/coupon-list')
        
    } catch (error) {

        console.log(error);
        
    }

   },


   salesReport :async (req,res)=>{
    try {

        const salesClass='active'
        const orders =  await orderService.deliverdOrders()
        // console.log(orders);
        orders.forEach((order) => {
           order.grandTotal = order.grandTotal.toLocaleString('en-IN',{style:'currency',currency:'INR'})
           order.date = order.date.toLocaleString()
        
        });
    res.render('adminView/salesReport',{layout:"adminLayout",salesClass,orders})
        
    } catch (error) {
        console.log(error)
    }
   },


   filterDate : async (req,res)=>{
    try {

        const salesClass='active'
        let{startDate,endDate} = req.body
        const orders = await orderService.filterOrderDate(startDate,endDate)
        orders.forEach((order) => {
            order.grandTotal = order.grandTotal.toLocaleString('en-IN',{style:'currency',currency:'INR'})
            order.date = order.date.toLocaleString()
            
        });
       res.render('adminView/salesReport',{layout:"adminLayout",salesClass,orders})
        
    } catch (error) {
        console.log(error);
        
    }
   }




   
}