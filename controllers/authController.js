const bcrypt = require("bcrypt")
const  userService = require('../services/userService')
const adminServices = require('../services/adminServices')
module.exports = {
    userRegister : async (req,res)=>{
        console.log(req.body);
        let {firstName,lastName,email, password, phoneno} = req.body;
        const isEmailAlreadyExist = await userService.emailExistOrNot(email)
        const isPhoneNoisAlreadyExist = await userService.phoneNoExistOrNOt(phoneno)
        if(isEmailAlreadyExist){
            res.redirect('/signup?message=email already exist')
        }else if(isPhoneNoisAlreadyExist){
            res.redirect('/signup?message=phone number already exist')

        }else{
           
            password = await bcrypt.hash(password,10)
            console.log(password);
            let user= await userService.addUser(firstName,lastName,email, password, phoneno)
            console.log(user);
            req.session.userName=firstName
            req.session.lastName=lastName
            req.session.email=email
            req.session.loggedIn=true
            if(user){
                res.redirect('/')
            }

        }
        
    },
    verifyUser :async (req,res)=>{
        let {email,password}=req.body
        const user = await userService.emailExistOrNot(email)
        console.log(user);            
            if(user){

                if(user.isBlocked){
                    res.redirect('/login?message=user is blocked')   
                }else{

                let ispasswordCorrect= await bcrypt.compare(password,user.password)
                if(ispasswordCorrect){
                    req.session.userName=user.firstName
                    req.session.lastName=user.lastName
                    req.session.userId=user._id
                    req.session.email=email
                    req.session.loggedIn=true
                    console.log(req.session.userName);
                    console.log("user is exist");
                    res.redirect('/')

                }else{
                    
                    res.redirect('/login?message=password not match')
                }
              }

            } else{
                res.redirect('/login?message=email not match')

            }
    
           

        
    },
    verifyAdmin : async (req,res)=>{
        let {email,password}=req.body
        const admin = await adminServices.adminValidation(email)
        if(admin){
            if(password===admin.password){
                req.session.admin=admin
                req.session.adminLoggedIn = true
                res.redirect('/admin')
            }else{
                console.log("password not match");
                res.redirect('/admin/adminLogin?message=invalid email or password')
            }
        }else{
            console.log("email not match");
            res.redirect('/admin/adminLogin?message=invalid email or password')
        }
    },
    verifyPhoneNumber : async (req,res)=>{
      let=  { verifyNumber}=req.body;
      console.log(verifyNumber);
    const isPhoneNoisExist = await userService.phoneNoExistOrNOt(verifyNumber)
    console.log(isPhoneNoisExist);
    if(isPhoneNoisExist){
        res.json({
            status:"phoneExists"
        })
    }else{

        res.json({
            status:"phoneNotExists"
        })

    }
    
    },
    otpSuccess : async (req,res)=>{
        let {verifyNumber} = req.body
        console.log("body",req.body);
        console.log(verifyNumber);
        const user = await userService.phoneNoExistOrNOt(verifyNumber)
        console.log(user);
        if(user){
            req.session.userName=user.firstName
            req.session.userId=user._id
            req.session.lastName=user.lastName
            req.session.loggedIn=true
            req.session.email=user.email
            console.log("user is exist");
            res.json({
                status:'verified',
                email:req.session.email
            })
        }
           
    }
   
}
