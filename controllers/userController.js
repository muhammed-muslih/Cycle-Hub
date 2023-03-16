module.exports = {
    homePageRender:(req,res,next)=>{
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
    }
    
}