$(document).ready(function(){

  //Login
  $('#SignUp').on('click', function (e) {
    e.preventDefault();
    
    var data = {
      firstName: $('#firstname').val(),
      lastName: $('#lastname').val(),
      email: $('#signUpEmail').val(),
      password: $('#signUpPassword').val()
    };

    auth.createUserWithEmailAndPassword(data.email, data.password).then(function(user) {
      usersReference.child(user.uid).set({
        firstname: data.firstName,
        lastname: data.lastName
      }); 
      user.sendEmailVerification().then(function() {
        alert("Check your mailbox before proceeding");
        loadSignIn();
      }, function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
    });     
  });
})