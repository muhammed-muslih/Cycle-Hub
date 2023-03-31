const userServices = require('../services/userService')
const bannerServices = require('../services/bannerServices')

module.exports={
    userAuth: async(req,res,next)=>{

      if(req.session.loggedIn){
        const user = await userServices.emailExistOrNot(req.session.email)
            req.session.userId=user._id
        
        next()
      }else{
        const banner = await bannerServices.findBanner()
        console.log("...............",banner);
        res.render('userView/homePage',{loggedIn:req.session.loggedIn,banner});
      }
    },
    
}
