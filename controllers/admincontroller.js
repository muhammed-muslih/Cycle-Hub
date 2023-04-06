const userService = require('../services/userService')
const productService = require('../services/productServices')
const categoryService = require('../services/categoryService')
const cloudinary = require('../util/cloudinary')
const brandService = require('../services/brandService')
const orderService = require('../services/orderServices')
const bannerService = require('../services/bannerServices')
const couponService = require("../services/couponServices")



module.exports={
    adminDashboardRender:(req,res)=>{

       const dashBoardClass='active'
        res.render('adminView/dashBoard',{layout:"adminLayout",dashBoardClass})
       
    },


    renderUserList : async (req,res)=>{
        const userClass='active'
        const users = await userService.findAllUser()
        res.render('adminView/userView',{layout:"adminLayout",users,userClass})
    },


    userBlockAndUnBlock: async (req,res)=>{
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
        const message = req.query.message
        if(req.session.adminLoggedIn){
            res.redirect('/admin')
        }else{
        res.render('adminView/adminLogin',{layout:"adminLayout",adminLogin:true,message})
        }

    },


    sessionDestroy : (req,res)=>{
        req.session.admin=null
        req.session.adminLoggedIn = false
        res.redirect('/admin')

    },


    renderProductAddPage : async (req,res)=>{
        const category = await categoryService.findListedAllCategory()
        const brand = await brandService.findListedBrand()
        res.render('adminView/addProduct',{layout:"adminLayout",category,brand})
    },


    addProduct: async (req,res)=>{

        const productIdExist = await productService.productIdExist(req.body.productId)
        if(productIdExist){
            
            res.redirect('/admin/productList?message=productId already exist')
        }else{

            try{
                // console.log("ctaegory add",req.files);
                console.log(req.body);
                let {productName,productId,productDescription,category,brand,price,quantity,variants}=req.body
                console.log(variants);
                console.log(brand[0]);
                let isDelete = false
                const images=[]
                for(let i=0;i<req.files.length;i++){
                    const {url} = (await cloudinary.uploader.upload(req.files[i].path))
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
    let {categoryName} = req.body
    const iscategoryAlreadyExist = await categoryService.isCategoryAlreadyExist(categoryName)
    if(iscategoryAlreadyExist){
        res.redirect('/admin/categoryList?message=Category name already exist')
    }else{
        await categoryService.addCategory(categoryName)
        res.redirect('/admin/categoryList')
    }

   },


   renderCategoryList:async (req,res)=>{
    const categoryClass='active'
    const message = req.query.message
    console.log(message);
    const category= await categoryService.findAllCategory()
    // const oneCategory = await categoryService.findoneCategory(id)
    res.render('adminview/CategoryList',{layout:"adminLayout",category,message,categoryClass})

   },


   renderproductList : async(req,res)=>{
    const productClass='active'
    const message = req.query.message
    console.log(message);
    const products = await productService.findAllProduct()
    for(var i=0;i<products.length;i++){
        products[i].price = products[i].price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    }
    res.render('adminView/productView',{layout:"adminLayout", products,message,productClass})

   },


   renderBrandList : async (req,res)=>{
    const brandClass='active'
    let message = req.query.message
    console.log(message);
    const brands = await brandService.findAllBrand()
    res.render('adminView/brandList',{layout:"adminLayout",brands,message,brandClass})
   },


   addBrand:async (req,res)=>{
    let {brandName}=req.body
    const isBfrandExist = await brandService.isBrandExist(brandName)
    if(isBfrandExist){
        res.redirect('/admin/addBrand?message=brand name already exist')

    }else{
        await brandService.addBrand(brandName)
        res.redirect('/admin/addBrand')
    }
   },


   deleteProduct : async(req,res)=>{

    const productId = req.params.id
    console.log(productId);
    await productService.productStatus(productId)
    res.redirect('/admin/productList')

   },


   renderEditproductPage :async (req,res)=>{
    try{
        const productId= req.params.id
    const [product,category,brand] = await Promise.all([

        await productService.findSingleProduct(productId),
        await categoryService.findAllCategory(),
        await brandService.findAllBrand()
    ])
    res.render('adminView/editProduct',{layout:"adminlayout",product,category,brand})

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

    const categoryId= req.params.id
    await categoryService.categoryListOrUnlist(categoryId)
    res.redirect('/admin/CategoryList')

   },


   editCategory:async(req,res)=>{
    const categoryId = req.params.id
    let {categoryName}=req.body
    const iscategoryAlreadyExist = await categoryService.isCategoryAlreadyExist(categoryName)
    if(iscategoryAlreadyExist){
        res.redirect('/admin/categoryList?message=Category name already exist')
    }else{
        await categoryService.updateCategory(categoryId,categoryName)
        res.redirect('/admin/categoryList')
    }
    

   },


   brandListOrUnlist : async (req,res)=>{
    const brandId = req.params.id
    await brandService.brandListorunlist(brandId)
    res.redirect('/admin/addBrand')
   },


   updateBrand : async (req,res)=>{
    const brandId = req.params.id
    let {brandName}=req.body
    const isBrandExist = await brandService.isBrandExist(brandName)
    if(isBrandExist){
        res.redirect('/admin/addBrand?message=brand name already exist')

    }else{
        await brandService.updateBrand(brandId,brandName)
        res.redirect('/admin/addBrand')
    }
   },


   productdetails : async(req,res)=>{
    const productId = req.params.id
    const product = await productService.findSingleProduct(productId)
    console.log(product);
    product[0].price=product[0].price.toLocaleString('en-IN',{style:'currency',currency:'INR'})
    res.render('adminView/singleProduct',{layout:"adminlayout",product})

   },


   renderOrderList : async(req,res)=>{
    const orderClass='active'
    const orders = await orderService.findAllOrders()
    // console.log(orders);
    for(var i=0;i<orders.length;i++){
        orders[i].grandTotal = orders[i].grandTotal.toLocaleString('en-IN',{style:'currency',currency:'INR'})
        orders[i].date =  orders[i].date.toLocaleString()
    }
    res.render('adminView/orders',{layout:"adminlayout",orders,orderClass})
   },


   changeOrderStatus : async(req,res)=>{
    let {orderId,status}=req.body
    console.log(orderId);
    console.log(status);
     await orderService.orderStatusChange(orderId,status)
    
        res.json({
            status:"status changed"
        })
   },


   orderDetails : async(req,res)=>{
    const orderId = req.params.id
    const orderClass='active'
    console.log(orderId);
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
    res.render('adminView/orderdetail',{layout:"adminlayout",orders,orderClass,total})
   
   },


   renderAddBanner : async (req,res)=>{
    const bannerClass='active'
    const banners = await bannerService.findAllBanner()
    res.render('adminView/banner',{layout:"adminlayout",banners,bannerClass})
   },


   addBanner:async(req,res)=>{
    try{

        console.log(req.body);
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
        console.log(editBanners);
     const banner=await bannerService.findOneBanner(bannerId)
     console.log(banner);
     const banners=[...banner.banners.slice(editBanners.length),...editBanners]
     await bannerService.editbanner(bannerId,bannerText,banners)
     res.redirect('/admin/add-banner')
    }catch(err){
        console.log(err);
    }

   },


   removeBanner : async (req,res)=>{
    const bannerId = req.params.id
    await bannerService.removeBanner(bannerId)
    res.redirect('/admin/add-banner')
   },


   renderCouponPage : async (req,res)=>{
    let message = req.query.message
    const couponClass = "active"
    await couponService.checkCouponExpired()
    const coupons =  await couponService.findAllCoupon()
    console.log(coupons);
    for(var i=0;i<coupons.length;i++){
        coupons[i].createdDate = coupons[i].createdDate.toLocaleString()
        coupons[i].expiryDate =   coupons[i].expiryDate.toLocaleString()
    }
    res.render('adminView/coupons',{layout:'adminlayout',couponClass,coupons,message})

   },


   addCoupon : async(req,res)=>{
    let {couponCode,min_amount,discount,expiryDate}=req.body
    console.log(req.body);
    const coupon =  await couponService.isCouponExist(couponCode)

    if(coupon){
        res.redirect('/admin/coupon-list?message="coupon already exist"')

    }else{

    min_amount=parseInt(min_amount)
    discount=parseInt(discount)
    await couponService.addCoupon(couponCode,min_amount,discount,expiryDate)
    res.redirect('/admin/coupon-list')

    }
   },

   deleteCoupon : async (req,res)=>{
    const couponId = req.params.id
    await couponService.deleteCoupon(couponId)
    res.redirect('/admin/coupon-list')
   },

   salesReport :async (req,res)=>{
    const salesClass='active'
    const orders =  await orderService.deliverdOrders()
    // console.log(orders);
     orders.forEach((order) => {
        order.grandTotal = order.grandTotal.toLocaleString('en-IN',{style:'currency',currency:'INR'})
        order.date = order.date.toLocaleString()
        
    });
    res.render('adminView/salesReport',{layout:"adminlayout",salesClass,orders})

   },
   filterDate : async (req,res)=>{
    const salesClass='active'
    console.log(req.body);
    let{startDate,endDate} = req.body
    const orders = await orderService.filterOrderDate(startDate,endDate)
    orders.forEach((order) => {
        order.grandTotal = order.grandTotal.toLocaleString('en-IN',{style:'currency',currency:'INR'})
        order.date = order.date.toLocaleString()
        
    });
   res.render('adminView/salesReport',{layout:"adminlayout",salesClass,orders})
   }




   
}