const productServices = require('../services/productServices')
const categoryServices = require('../services/categoryService');
const brandService = require('../services/brandService');


module.exports = {
    homePageRender:async(req,res,next)=>{
        const user=req.session.userName
        console.log(user);
        if(req.session.loggedIn){
            res.render('userView/homePage',{user,loggedIn:true});
        }else{
            res.render('userView/homePage',{loggedIn:false});
        }
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

    renderShopePage :  async (req,res)=>{
        const user=req.session.userName
        const categoryId = req.query.categoryId
        const brandId = req.query.brandId
        console.log(categoryId);
        console.log("brand....",brandId);
        if(categoryId){
            const products = await productServices.findCategoryProduct(categoryId)
            const category = await categoryServices.findListedAllCategory()
            const brands = await brandService.findListedBrand()
            for (let i = 0; i < products.length; i++) {
                products[i].price = products[i].price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
              }
            res.render('userView/shopePage',{products,category,brands,user,loggedIn:true})

        }else if(brandId){
            const products = await productServices.findBrandProduct(brandId)
            const category = await categoryServices.findListedAllCategory()
            const brands = await brandService.findListedBrand()
            for (let i = 0; i < products.length; i++) {
                products[i].price = products[i].price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
              }
            res.render('userView/shopePage',{products,category,brands,user,loggedIn:true})

        }else{
            const brands = await brandService.findListedBrand()
            const products=await productServices.findAllProduct()
            const category = await categoryServices.findListedAllCategory()
            for (let i = 0; i < products.length; i++) {
                products[i].price = products[i].price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
              }
            res.render('userView/shopePage',{products,category,brands,user,loggedIn:true})

        }
            
    },
    renderSingleProductView : async(req,res)=>{
        const user=req.session.userName
        const productId = req.params.id
        const product = await productServices.findSingleProduct(productId)
        product[0].price=product[0].price.toLocaleString('en-IN',{style:'currency',currency:'INR'})
        console.log(product);
        res.render('userView/singleproductView',{product,user,loggedIn:true})

    }
    
}