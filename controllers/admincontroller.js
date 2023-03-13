const userService = require('../services/userService')

module.exports={
    adminDashboardRender:(req,res)=>{
        res.render('adminView/dashBoard',{layout:"adminLayout"})
    },
    renderUserList : async (req,res)=>{
        const users = await userService.findAllUser()
        res.render('adminView/userView',{layout:"adminLayout",users})
    },
    userBlockAndUnBlock: async (req,res)=>{
        try {
            const userId = req.params.id
            console.log(userId);
            await userService.ChangeUserStatus(userId)
            res.redirect('/admin/user-list')
        } catch(err){
            console.log(err);
        }
    }
    
}