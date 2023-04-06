{/* <script src="https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js"></script> */}
$(document).ready(function(){

    $("#fname").blur(function(){
        validate_fname()
    });
    $("#lname").blur(function(){
        validate_lname()
    });
    $("#email").blur(function(){
        validate_email()
    });

    $("#phone").blur(function(){
        validate_phone()
    });


    var fname
    function validate_fname(){
        var condition =/^[a-zA-Z]*$/;
        fname = $("#fname").val()
        if(condition.test(fname) &&  fname !== ""){
            $("#fname-error").html('')
        }else{
            $('#fname-error').html("should contain only character")
            $('#fname-error').show()
            error_fname = true
        }
    }


    var lname
    function validate_lname(){
        var condition =/^[a-zA-Z]*$/;
        lname = $("#lname").val()
        if(condition.test(lname) &&  lname !== ""){
            $("#lname-error").html('')
        }else{
            $('#lname-error').html("should contain only character")
            error_lname = true
        }
    }


    var email
    function validate_email(){
        var condition =/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        email = $("#email").val()
        if(condition.test(email) &&  email !== ""){
            $("#email-error").html('')
        }else{
            $('#email-error').html("invalid email")
            error_email = true
        }

    }


    var phone
    function validate_phone(){
         phone = $("#phone").val().trim()
        if(phone.length === 10){
            $("#phone-error").html('')

        }else{
            $('#phone-error').html("enter valid phone number")
            error_phone = true
        }
    }

      $('#profile-add-btn').click(async function(e){
        e.preventDefault()


        
        var inputFields = document.querySelectorAll('.textBox')
          inputFields.forEach(function(field){
            field.setAttribute('disabled','disabled')
            field.style.border = 'none'
          })


        console.log("hello");
        error_fname=false
        error_lname = false
        error_email = false
        error_phone = false
        validate_fname()
        validate_lname()
        validate_email()
        validate_phone()

        if(error_fname===false && error_lname === false && error_email ===false &&  error_phone === false){

         const res = await axios({
            method:'post',
            url:"/change-user-profile",
            data:{
                firstName:fname,
                lastName:lname,
                email:email,
                phoneno:phone
            }
         })

         if(res.data.status==='changed'){

            Toastify({
                text:"profile updated",
                duration: 3000,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: false, // Prevents dismissing of toast on hover
                style: {
                    background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(25,192,36,1) 29%, rgba(27,210,36,0.9697128851540616) 35%,",
                },
            }).showToast() 
            setTimeout(function() {
            location.reload()
            },2000)
         }else{
            Toastify({
                text:"details not updated",
                duration: 3000,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: false, // Prevents dismissing of toast on hover
                style: {
                    background: " linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(233,7,7,1) 9%, rgba(233,7,7,1) 90%, rgba(252,176,69,1) 100%);",
                },
            }).showToast()
         }

        }else{
            console.log("please fill all field");
        }

    })


})