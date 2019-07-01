$(document).ready(function(){

	$.fn.searchDropdown = function(){
		return this.each(function(){
			var obj = $(this)
			$('.searchContact').keyup(function(keyboard) {
			$('.contactList').fadeIn(400);
			
			$('.contactList').hover(function(){ },
				function(){
					$(this).hide();
				});
			});
			
			$('.contactList').on('click', function (e) {
				e.preventDefault(); 
				partner.uid = e.target.id;
				console.log(getTimestamp()+" new partner "+partner.uid);

				
				usersReference.child(partner.uid).once("value").then(function(userData) {
			        var profilePic = userData.child("profilePic").val();
			        var firstName = userData.child("firstname").val();
			        var lastName = userData.child("lastname").val();
			        $('.searchContact').val(firstName+ " " +lastName);
      			});

				
				

				// new stuff
				var data = {
			      message: $('#message').val(),
			      sourceID: fireBaseUser.uid,
			      destinationID: partner.uid,
			      timestamp: getTimestamp(),
			    };
				chatsReference.child(data.sourceID).child(data.destinationID).set({
			        author: "You",
			        lastMessage: "",
			        timestamp: data.timestamp
			    });


			    $('.contactList').hide();
				$('.searchContact').fadeOut();
			});
		});
	};
	$('.searchContact').searchDropdown();

	// $('#sendMessage').on('click', function (e) {
	// 	location.reload();
	// });
	
});