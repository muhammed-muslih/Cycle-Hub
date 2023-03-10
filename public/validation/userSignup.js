$(document).ready(function(){
    $("#fname-error").hide();
    $("#email-error").hide();
    $("#password-error").hide();
    $("#lname-error").hide();
    $("#phone-error").hide();
    $("#cpassword-errorr").hide();

    var error_fname = false;
    var error_email = false;
    var error_password = false;
    var error_lname = false;
    var error_phone = false;
    var error_cpassword = false;


    $("#fname").blur(function(){
        validate_fname()
    });
    $("#lname").blur(function(){
        validate_lname()
    });
    $("#email").blur(function(){
        validate_email()
    });
    $("#password").blur(function(){
        validate_password()
    });
    $("#cpassword").blur(function(){
        validate_cpassword()
    });
    $("#phone").blur(function(){
        validate_phone()
    });




    function validate_fname(){
        var condition =/^[a-zA-Z]*$/;
        var fname = $("#fname").val()
        if(condition.test(fname) &&  fname !== ""){
            $("#fname-error").hide();
        }else{
            $('#fname-error').html("should contain only character")
            $('#fname-error').show()
            error_fname = true
        }
    }


    function validate_lname(){
        var condition =/^[a-zA-Z]*$/;
        var lname = $("#lname").val()
        if(condition.test(lname) &&  lname !== ""){
            $("#lname-error").hide();
        }else{
            $('#lname-error').html("should contain only character")
            $('#lname-error').show()
            error_lname = true
        }
    }

    function validate_email(){
        var condition =/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        var email = $("#email").val()
        if(condition.test(email) &&  email !== ""){
            $("#email-error").hide();
        }else{
            $('#email-error').html("invalid email")
            $('#email-error').show()
            error_email = true
        }

    }

    function validate_password(){
        var password = $("#password").val()
        if(password.length >= 8){
            $("#password-error").hide();
        }else{
            $('#password-error').html("require minimum 8 characters")
            $('#password-error').show()
            error_password = true
        }

    }
    function  validate_cpassword(){
        var password = $("#password").val()
        var cpassword =$("#cpassword").val()
        if(password===cpassword && cpassword !==""){
            $("#cpassword-error").hide();
        }else{
            $('#cpassword-error').html("passwords did not match")
            $('#cpassword-error').show()
            error_cpassword = true
        }

    }


    function validate_phone(){
        var phone = $("#phone").val()
        if(phone.length === 10){
            $("#phone-error").hide();
        }else{
            $('#phone-error').html("enter valid phone number")
            $('#phone-error').show()
            error_phone = true
        }
    }

    $("#signupSubmit").submit(function(){

         error_fname = false;
         error_email = false;
         error_password = false;
         error_lname = false;
         error_phone = false;
         error_cpassword = false;

         validate_fname()
         validate_lname()
         validate_email()
         validate_password()
         validate_cpassword()
         validate_phone()

        if(error_fname===false && error_email === false && error_password ===false &&
            error_lname === false && error_phone === false &&error_cpassword === false) {
                return true
            }else{
                return false
            }
    })




})