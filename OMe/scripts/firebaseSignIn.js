$(document).ready(function(){
  
  //Login
  $('#SignIn').on('click', function (e) {
    e.preventDefault();
    if( $('#loginEmail').val() != '' && $('#loginPassword').val() != '' ){
    //login the user
    var data = {
      email: $('#loginEmail').val(),
      password: $('#loginPassword').val()
    };
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    firebase.auth().signInWithEmailAndPassword(data.email, data.password)
      .then(function(authData) {
        console.log("Authenticated successfully with payload:", authData);
        console.log("ID:", auth.currentUser.uid);
        localStorage.setItem('fireBaseUser', JSON.stringify(auth.currentUser)); 
        localStorage.setItem('fireBaseAuth', JSON.stringify(auth)); 
        loadMessenger();
      })
      .catch(function(error) {
        console.log("Login Failed!", error);
        alert(error);
      });
    }
  });
  
})