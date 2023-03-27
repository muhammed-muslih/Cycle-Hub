const userServices = require('../services/userService')
const cartServices = require('../services/cartService')

module.exports={
    userAuth: async(req,res,next)=>{

      if(req.session.loggedIn){
        const user = await userServices.emailExistOrNot(req.session.email)
            req.session.userId=user._id
        
        next()
      }else{
        res.render('userView/homePage',{loggedIn:req.session.loggedIn});
      }
    },
}
