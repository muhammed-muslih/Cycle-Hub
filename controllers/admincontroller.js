const userService = require('../services/userService')
const productService = require('../services/productServices')
const categoryService = require('../services/categoryService')
const cloudinary = require('../util/cloudinary')
const brandService = require('../services/brandService')


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
        const category = await categoryService.findListedAllCategory()
        const brand = await brandService.findListedBrand()
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
    const iscategoryAlreadyExist = await categoryService.isCategoryAlreadyExist(categoryName)
    if(iscategoryAlreadyExist){
        res.redirect('/admin/categoryList?message=Category name already exist')
    }else{
        await categoryService.addCategory(categoryName)
        res.redirect('/admin/categoryList')
    }

   },

   renderCategoryList:async (req,res)=>{
    const message = req.query.message
    console.log(message);
    const category= await categoryService.findAllCategory()
    // const oneCategory = await categoryService.findoneCategory(id)
    res.render('adminview/CategoryList',{layout:"adminLayout",category,message})

   },

   renderproductList : async(req,res)=>{
    const products = await productService.findAllProduct()
    res.render('adminView/productView',{layout:"adminLayout", products})

   },

   renderBrandList : async (req,res)=>{
    let message = req.query.message
    console.log(message);
    const brands = await brandService.findAllBrand()
    res.render('adminView/brandList',{layout:"adminLayout",brands,message})
   },

   addBrand:async (req,res)=>{
    let {brandName}=req.body
    const isBfrandExist = await brandService.isBrandExist(brandName)
    if(isBfrandExist){
        res.redirect('/admin/addBrand?message=brand name already exist')

    }else{
        await brandService.addBrand(brandName)
        res.redirect('/admin/addBrand')
    }
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

        await productService.findSingleProduct(productId),
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
    
   },
   categoryListorunlist: async (req,res)=>{

    const categoryId= req.params.id
    await categoryService.categoryListOrUnlist(categoryId)
    res.redirect('/admin/CategoryList')

   },
   editCategory:async(req,res)=>{
    const categoryId = req.params.id
    let {categoryName}=req.body
    const iscategoryAlreadyExist = await categoryService.isCategoryAlreadyExist(categoryName)
    if(iscategoryAlreadyExist){
        res.redirect('/admin/categoryList?message=Category name already exist')
    }else{
        await categoryService.updateCategory(categoryId,categoryName)
        res.redirect('/admin/categoryList')
    }
    

   },
   brandListOrUnlist : async (req,res)=>{
    const brandId = req.params.id
    await brandService.brandListorunlist(brandId)
    res.redirect('/admin/addBrand')
   },
   updateBrand : async (req,res)=>{
    const brandId = req.params.id
    let {brandName}=req.body
    const isBrandExist = await brandService.isBrandExist(brandName)
    if(isBrandExist){
        res.redirect('/admin/addBrand?message=brand name already exist')

    }else{
        await brandService.updateBrand(brandId,brandName)
        res.redirect('/admin/addBrand')
    }
   }
   
   
   
        

    
}