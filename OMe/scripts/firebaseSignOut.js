$(document).ready(function(){
	//Sign Out
	$('#SignOut').on('click', function (e) {
	  e.preventDefault();
	  firebase.auth().signOut().then(function() {
	    localStorage.setItem('fireBaseUser', null); 
	    localStorage.setItem('fireBaseAuth', null);
	    loadSignIn();
	  }, function(error) {
	    console.log(error);
	    alert(error);
	  });
	});
});