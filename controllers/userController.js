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
        const categoryId = req.query.categoryId
        const brandId = req.query.brandId
        console.log(categoryId);
        console.log("brand....",brandId);
        if(categoryId){
            const products = await productServices.findCategoryProduct(categoryId)
            const category = await categoryServices.findListedAllCategory()
            const brands = await brandService.findListedBrand()
            res.render('userView/shopePage',{products,category,brands})

        }else if(brandId){
            const products = await productServices.findBrandProduct(brandId)
            const category = await categoryServices.findListedAllCategory()
            const brands = await brandService.findListedBrand()
            res.render('userView/shopePage',{products,category,brands})

        }else{
            const brands = await brandService.findListedBrand()
            const products=await productServices.findAllProduct()
            const category = await categoryServices.findListedAllCategory()
            res.render('userView/shopePage',{products,category,brands})

        }
            
    },
    renderSingleProductView : async(req,res)=>{
        const productId = req.params.id
        console.log(productId);
        const product = await productServices.findSingleProduct(productId)
        console.log(product);
        res.render('userView/singleproductView',{product})

    }
    
}