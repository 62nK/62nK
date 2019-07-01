//create firebase references
var auth = firebase.auth(); 
var database = firebase.database();
var usersReference = database.ref('users');
var messagesReference = database.ref('messages');
var chatsReference = database.ref('chats');