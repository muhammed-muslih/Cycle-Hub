$(document).ready(function(){


       // Add a custom validation method for preventing leading white space
       jQuery.validator.addMethod("noLeadingSpace", function(value, element) {
      // Test if the input value starts with a white space
       return this.optional(element) || /^\S.*$/.test(value);
          }, "Leading spaces are not allowed.");

       // Add the "noLeadingSpace" rule to your form input


    $('#address-form').validate({
        errorClass: 'errors',
        rules:{
            firstName: {
                required:true,
                minlength:4,
                noLeadingSpace: true // Add the "noLeadingSpace" rule to prevent leading white space
            } ,
            lastName:   {
                required:true,
                noLeadingSpace: true    
            },
            address:{
                required:true,
                minlength:6,
                noLeadingSpace: true 
            },
            district:{
                required:true,
                noLeadingSpace: true 
            },
            city:{
                required:true,
                noLeadingSpace: true 
            },
            pincode:{
                required:true,
                noLeadingSpace: true 
            },
            phone:{
                required:true,
                digits:true,
                minlength:10,
                maxlength:10,
                noLeadingSpace: true 
                
            }
        },
        messages:{
            firstName:{
                required:'please enter firstName',
                minlength:'firstName must be at least 4 characters long'
            },
            lastName:{
                required:'please enter lastName',
                minlength:'lastName must be at least 4 characters long'

            },
            phone:{
                digits:' enter valid phone number'
            }

        }
    })
})