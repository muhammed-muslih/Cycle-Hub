const bcrypt = require("bcrypt")
const  userService = require('../services/userService')
module.exports = {
    userRegister : async (req,res)=>{
        console.log(req.body);
        let {firstName,lastName,email, password, phoneno} = req.body;
        const isEmailAlreadyExist = await userService.emailExistOrNot(email)
        if(isEmailAlreadyExist){
            res.redirect('/signup?message=email already exist')
        }else{
            req.session.userName=firstName
            req.session.loggedIn=true
            password = await bcrypt.hash(password,10)
            console.log(password);
            let userId= await userService.addUser(firstName,lastName,email, password, phoneno)
            console.log(userId);
            if(userId){
                res.redirect('/')
            }

        }
        
    },
    verifyUser :async (req,res)=>{
        let {email,password}=req.body
        const user = await userService.emailExistOrNot(email)
        console.log(user);

        if(user.isBlocked){
            res.redirect('/login?message=user is blocked')   
        }else{
            
            if(user){

                let ispasswordCorrect= await bcrypt.compare(password,user.password)
                if(ispasswordCorrect){
                    req.session.userName=user.firstName
                    req.session.loggedIn=true
                    console.log("user is exist");
                    res.redirect('/')
    
                }else{
                    
                    res.redirect('/login?message=password not match')
                }
    
            }else{
                console.log("account does not exist");
            }

        } 
    }
   
}