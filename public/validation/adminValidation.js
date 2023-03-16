$(document).ready(function(){

    $("#email-error").hide();
    $("#password-error").hide();
    
    
    var error_email = false;
    var error_password = false;
    
    $("#email").keyup(function(){
        validate_email()
    });
    $("#password").keyup(function(){
        validate_password()
    });
    
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
    
    
    $('#loginSubmit').submit(function(){
    
        error_email = false;
        error_password = false;
    
        validate_email()
        validate_password()
    
    
        if(error_email === false && error_password ===false) {
                return true
            }else{
                return false
            }
    
    })
    
    })