module.exports = {
    homePageRender:(req,res,next)=>{
        const user=req.session.userName
        console.log(user);
        res.render('userView/homePage',{user});
        
    },
    loginPageRender:(req,res)=>{
        const message= req.query.message
        console.log(message);
        res.render('userView/userLogin',{message:message,user:null})
    },
    signupPageRender:(req,res)=>{
        const message = req.query.message
        res.render('userView/userSignup',{message:message,user:null})   
    },
    sessionDestroy :(req,res)=>{
        req.session.destroy((err)=>{
            if(err){
                console.log(err);
            }else{
                res.redirect('/')
            }
        })

    }
    
}