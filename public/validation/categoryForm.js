$(document).ready(function(){
    $('#category-form').validate({
        errorClass: 'errors',
        rules:{
          categoryName:{
            required:true,
            minlength:4
          }

        }

      })


      $('#editCategoryForm').validate({
        errorClass: 'errors',
        rules:{
          categoryName:{
            required:true,
            minlength:4
          }
  
        }
  
      })
})


