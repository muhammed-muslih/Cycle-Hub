const userService = require('../services/userService')
const productService = require('../services/productServices')
const categoryService = require('../services/categoryService')
const cloudinary = require('../util/cloudinary')
const brandService = require('../services/brandService')


module.exports={
    adminDashboardRender:(req,res)=>{
        if(req.session.adminLoggedIn){
            res.render('adminView/dashBoard',{layout:"adminLayout"})
        }else{
            res.redirect('/admin/adminLogin')
        }
    },
    renderUserList : async (req,res)=>{
        const users = await userService.findAllUser()
        res.render('adminView/userView',{layout:"adminLayout",users})
    },
    userBlockAndUnBlock: async (req,res)=>{
        try {
            const userId = req.params.id
            await userService.ChangeUserStatus(userId)
            res.redirect('/admin/user-list')
        } catch(err){
            console.log(err);
        }
    },
    renderAdminLoginPage : (req,res)=>{
        const message = req.query.message
        if(req.session.adminLoggedIn){
            res.redirect('/admin')
        }else{
        res.render('adminView/adminLogin',{layout:"adminLayout",adminLogin:true,message})
        }

    },
    sessionDestroy : (req,res)=>{
        req.session.admin=null
        req.session.adminLoggedIn = false
        res.redirect('/admin')

    },
    renderProductAddPage : async (req,res)=>{
        const category = await categoryService.findAllCategory()
        const brand = await brandService.findAllBrand()
        res.render('adminView/addProduct',{layout:"adminLayout",category,brand})
    },

    addProduct: async (req,res)=>{
        try{
            // console.log("ctaegory add",req.files);
            let {productName,productDescription,category,brand,price,quantity}=req.body
            console.log(brand[0]);
            let isDelete = false
            const images=[]
            for(let i=0;i<req.files.length;i++){
                const {url} = (await cloudinary.uploader.upload(req.files[i].path))
                images.push(url)
            }
            await productService.addProduct(productName,productDescription,category,brand,price,quantity,isDelete,images)
            res.redirect('/admin/productList')
        }catch(err){
            console.log(err);

        }   
   },
   addCategory: async(req,res)=>{
    let {categoryName} = req.body
    await categoryService.addCategory(categoryName)
    res.redirect('/admin/categoryList')

   },

   renderCategoryList:async (req,res)=>{
    const category= await categoryService.findAllCategory()
    res.render('adminview/CategoryList',{layout:"adminLayout",category})

   },

   renderproductList : async(req,res)=>{
    const products = await productService.findAllProduct()
    res.render('adminView/productView',{layout:"adminLayout", products})

   },

   renderBrandList : async (req,res)=>{
    const brands = await brandService.findAllBrand()
    res.render('adminView/brandList',{layout:"adminLayout",brands})
   },

   addBrand:async (req,res)=>{
    let {brandName}=req.body
    await brandService.addBrand(brandName)
    res.redirect('/admin/addBrand')
   },
   deleteProduct : async(req,res)=>{

    const productId = req.params.id
    console.log(productId);
    await productService.deleteProduct(productId)
    res.redirect('/admin/productList')

   },
   renderEditproductPage :async (req,res)=>{
    try{
        const productId= req.params.id
    console.log("product",productId);
    const [product,category,brand] = await Promise.all([

        await productService.findEditProduct(productId),
        await categoryService.findAllCategory(),
        await brandService.findAllBrand()
    ])
    res.render('adminView/editProduct',{layout:"adminlayout",product,category,brand})

    }catch(err){
        console.log(err);
    }
    
   },
   editProduct : async (req,res)=>{
    try{
        const productId=req.params.id
    let {productName,productDescription,category,brand,price,quantity} = req.body
    const images=[]
    console.log(req.files.image);

    for(let i=0;i<req.files.length;i++){
        const {url} = await cloudinary.uploader.upload(req.files[i].path)
        images.push(url)
    }
    console.log(images);
    const product = await productService.findProduct(productId)
    const newImages=[...product.images.slice(images.length),...images]

    await productService.editProduct(productId,productName,productDescription,category,brand,price,quantity, newImages)
    res.redirect('/admin/productList')

    }catch(err){
        console.log(err);
    }
    
   }
   
   
        

    
}