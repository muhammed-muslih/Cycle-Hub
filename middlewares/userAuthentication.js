const userServices = require('../services/userService')
const bannerServices = require('../services/bannerServices')
const brandService = require('../services/brandService')
const productServices = require('../services/productServices')



module.exports={
    userAuth: async(req,res,next)=>{
      const homeClass = 'active'

      if(req.session.loggedIn){
        const user = await userServices.emailExistOrNot(req.session.email)
            req.session.userId=user._id
        
        next()
      }else{
        const banner = await bannerServices.findBanner()
        const brands = await brandService.findListedBrand()
        const newProducts = await productServices.newArrivals()
        for (let i = 0; i < newProducts.length; i++) {
          newProducts[i].price = newProducts[i].price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
         }
        res.render('userView/homePage',{loggedIn:req.session.loggedIn,banner,brands,newProducts,homeClass});
      }
    },
    cartAuth : async (req,res,next)=>{
      if(req.session.loggedIn){
        const user = await userServices.emailExistOrNot(req.session.email)
        req.session.userId=user._id
        next()

      }else{
        res.render('userView/userLogin')
      }
    }
    
}
