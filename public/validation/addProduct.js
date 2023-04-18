$(document).ready(function(){

    jQuery.validator.addMethod("greaterThanZero", function(value, element) {
        return parseInt(value) > 0;
      }, "Value must be greater than zero.");

    $('#product_form').validate({

        errorClass: 'errors',   
        rules:{
            productName:{
                required:true,
                minlength:8
            },
            productDescription:{
                required:true,
                minlength:15
            },
            category:{
                required:true
            },
            brand:{
                required:true
            },
            price:{
                required:true,
                digits : true,
                greaterThanZero:true
            },
            quantity:{
                required:true,
                digits:true,
                greaterThanZero:true
            },
            images:{
                required:true,
                extension: "jpg|jpeg|png"
            }
            
        }
    })
})