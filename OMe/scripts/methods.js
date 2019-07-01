function load(){
    window.setTimeout(loadSignIn, 5000);
}
function loadMessenger(){
  window.open('messenger.html', '_self');
}
function loadSignIn(){
    window.open('signin.html', '_self');
}
function loadSignUp(){
    window.open('signup.html', '_self');
}

function checkAuth(){
  var auth = JSON.parse(localStorage.getItem('fireBaseAuth'));
  console.log(auth);
  if( auth != null ){
    alert("User "+auth.currentUser.email+" already logged in!");
    loadMessenger();
  }
}

function confirmAuth(){
  var auth = JSON.parse(localStorage.getItem('fireBaseAuth'));

  if( auth == null ){
    alert("User must log in before accessing OMe!");
    loadSignIn();
  }
}

function getExtendedDate(timestamp){
  var date = new Date(timestamp);
  var year = date.getFullYear();
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var month = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
      ];
  var hh = date.getHours();
  var mm = date.getMinutes();

  var ampm = hh >= 12 ? 'pm' : 'am';
  hh = hh % 12;
  hh = hh ? hh : 12; // the hour '0' should be '12'
  var zero = mm<10?'0':'';

  return hh + ':'+ zero+mm +''+ ampm +' - ' + month[monthIndex] + ' '+ day+', '+year;
}

function getDate(timestamp){
  var currentTime = getTimestamp();
  var date = new Date(timestamp);

  var timeElapsed = {
    minutes: parseInt((currentTime-timestamp)/1000/60),
    hours: parseInt((currentTime-timestamp)/1000/60/60),
    days: parseInt((currentTime-timestamp)/1000/60/60/24),
    weeks: parseInt((currentTime-timestamp)/1000/60/60/24/7),
    months: parseInt((currentTime-timestamp)/1000/60/60/24/7/4),
  }

  var month = ["",
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
      ];
  var day = [
      "Sun", "Mon", "Tue",
      "Wed", "Thu", "Fri", "Sat",
      ];

  switch (true){
    case (timeElapsed.months>=1): // More than a month ago
      return month[date.getDay()]+' '+date.getDate()+', '+date.getFullYear();
      break;
    case (timeElapsed.days>=7):   // More than a week ago
      return month[date.getMonth()]+' '+date.getDate();
      break;
    case (timeElapsed.days>=1): // More than a day ago
      return  day[date.getDay()];
      break;
    case (timeElapsed.hours>=1):   // More than an hour ago
      return  timeElapsed.hours>1?timeElapsed.hours+" hours ago":"1 hour ago";
      break;
    case (timeElapsed.minutes>=1):   // More than a minute ago
      return timeElapsed.minutes>1?timeElapsed.minutes+" minutes ago":"1 minute ago";
      break;
    default:
      return "just now";
      break;
  }
}

function getTimestamp(){
  return new Date().getTime();
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}