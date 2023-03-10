module.exports = {
    homePageRender:(req,res,next)=>{
        res.render('userView/homePage',{login:false,signup:false});
    },
    loginPageRender:(req,res)=>{
        res.render('userView/userLogin',{login:true,signup:false})
    },
    signupPageRender:(req,res)=>{
        res.render('userView/userSignup',{signup:true,login:false})
    }
}