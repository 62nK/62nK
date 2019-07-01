var fireBaseUser = JSON.parse(localStorage.getItem('fireBaseUser'));

//var fireBaseUser = {uid:"GQNVs5DIVGXgZ0bwYtQkArq7QXj2"};  // disable this when you go online
var user = {uid: fireBaseUser.uid, profilePic: null, firstName: null, lastName: null};
var partner = {
  uid: null, 
  profilePic: null, 
  firstName: null, 
  lastName: null
};

// Fetch all messages of a conversation
$(document).on('change', 'input[name=displayConversation]', function() {
  if ($('input:checked', '#showConversation').val() == "newConversation"){
    var userinfo = '<p class="userinfo">To: </p>';
    $(".userinfo").replaceWith(userinfo);
    $(".searchContact").fadeIn(400);
  }
  else{
    partner.uid = $('input:checked', '#showConversation').val();
    messagesReference.child(fireBaseUser.uid).child(partner.uid).on('value', function(messagesSnapshot) {
      $(".convo").empty();
      $(".searchContact").hide();
      messagesSnapshot.forEach(messageSnapshot =>{
        var messageID = messageSnapshot.key;
        var direction = messageSnapshot.val().direction;
        var message = messageSnapshot.val().message;
        var date = getExtendedDate(messageSnapshot.val().timestamp);
        usersReference.child(partner.uid).once("value").then(function(userData) {
          partner.profilePic = userData.child("profilePic").val();
          partner.firstName = userData.child("firstname").val();
          partner.lastName = userData.child("lastname").val();
            var convo = '<div class="text"><div class="'+direction+'"><img src="images/user.png"><p>'+message+'</p></div><div class="'+direction+'_date">'+date+'</div></div>';
            var userinfo = '<p class="userinfo">'+partner.firstName+' '+partner.lastName+'</p>';
            $(".welcome").remove();
            $(".convo").append(convo);
            $(".userinfo").replaceWith(userinfo);
        });
      })
    });
  }
});

$(document).ready(function(){

// Get signed-in user's name
usersReference.child(fireBaseUser.uid).once("value").then(function(userData) {
        user.firstName = userData.child("firstname").val();
        user.lastName = userData.child("lastname").val();
        var welcome = '<div class="welcome">Hi '+user.firstName+' '+user.lastName+'!</div>';
        $(".welcome").replaceWith(welcome);
      });

// Search contact
  $( "#searchContact" ).keyup(function(keyboard) {
    if (keyboard.which <= 90 && keyboard.which >= 48 || keyboard.which==8){
      $(".contactList").empty();
      var searchString = $( "#searchContact" ).val();
      var endString = searchString + "z";
      if (searchString){
        usersReference.orderByChild('firstname').startAt(searchString).endAt(endString).on("value", function(contactsData) {
          $(".contactList").empty();
          contactsData.forEach(function(contactSnapshot) {
            var contact = {
                id: contactSnapshot.key,
                firstName: contactSnapshot.val().firstname,
                lastName: contactSnapshot.val().lastname,
            }
            console.log('search by firstname '+contact.id+':\nname: '+contact.firstName+' '+contact.lastName);
            var contactResult =  $('<li id="'+contact.id+'"></li>').text(contact.firstName+' '+contact.lastName);
            $(".contactList").append(contactResult);
          });
        });

        usersReference.orderByChild('lastname').startAt(searchString).endAt(endString).on("value", function(contactsData) {
          contactsData.forEach(function(contactSnapshot) {
            var contact = {
                id: contactSnapshot.key,
                firstName: contactSnapshot.val().firstname,
                lastName: contactSnapshot.val().lastname,
            }
            console.log('search by lastname '+contact.id+':\nname: '+contact.firstName+' '+contact.lastName);
            var contactResult =  $("<li></li>").text(contact.firstName+' '+contact.lastName);
            $(".contactList").append(contactResult);
          });
        });
      }
    }
    
  });

// fetch list of coversations
  chatsReference.child(fireBaseUser.uid).orderByChild('timestamp').on("value", function(chatsSnapshot) {
    chatsSnapshot.forEach(chat =>{
      var partnerUid = chat.key;
      var last = chat.val().lastMessage;
      var date = getDate(chat.val().timestamp);
      var author = chat.val().author;
      usersReference.child(partnerUid).once("value").then(function(userData) {
        var profilePic = userData.child("profilePic").val();
        var firstName = userData.child("firstname").val();
        var lastName = userData.child("lastname").val();
        if (author == "Other") author= firstName;
        var conversation = '<label id="'+partnerUid+'"><input type="radio" name="displayConversation" value="'+partnerUid+'" /><i class="material-icons">account_circle</i><p class=sender>'+firstName+' '+lastName+'</p><p class=date>'+date+'</p><p class="lastmessage">'+author+': '+last+'</p></label>';
        // Dynamic loading of conversations
        var myElem = document.getElementById(partnerUid);
        if (myElem != null){
          $("#"+partnerUid).remove();
          $("#showConversation").append(conversation);
        }else{
          $("#showConversation").append(conversation);
        }
      });
    })
  });

//Send
  $('#sendMessage').on('click', function (e) {
    e.preventDefault();
    var data = {
      message: $('#message').val(),
      sourceID: fireBaseUser.uid,
      destinationID: partner.uid,
      timestamp: getTimestamp(),
    };
    
    messagesReference.child(data.sourceID).child(data.destinationID).child(data.timestamp).set({
        message: data.message,
        direction: "outgoing",
        timestamp: data.timestamp
    });
    
    chatsReference.child(data.sourceID).child(data.destinationID).set({
        author: "You",
        lastMessage: data.message,
        timestamp: data.timestamp
    });


    messagesReference.child(data.destinationID).child(data.sourceID).child(data.timestamp).set({
      message: data.message,
      direction: "incoming",
      timestamp: data.timestamp
    });

    chatsReference.child(data.destinationID).child(data.sourceID).set({
        author: "Other",
        lastMessage: data.message,
        timestamp: data.timestamp
    });

    document.newMessageForm.reset();

  });
  
})