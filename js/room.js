// var displayname = document.querySelector(".username");
// window.scrollTo(0,document.body.scrollHeight);
// window.scrollTo(0,document.querySelector(".each-message").scrollHeight);

// window.onload=function () {
//   var objDiv = document.getElementById("scroll");
//   objDiv.scrollTop = objDiv.scrollHeight;
//   console.log(objDiv.scrollTop);
// }

window.addEventListener("DOMContentLoaded", () => {
  
  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      console.log(1);

      var users = db.ref('Users');
      users.on('value', gotUsers, errData);

      var messages = db.ref('DefaultRoom/Messages');
      messages.on('value', gotMessages, errData)

      // var currentUser = firebase.auth().currentUser;
      // return firebase.database().ref('/Users/' + currentUser.uid).once('value').then((snapshot) => {
      //   var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        
      //   displayname.innerHTML = `${username}'s`;

      //   console.log(username);

      // })
    } else {
      window.location.href = "../../sign-in.html"
      console.log("User not logged in");
      window.location.href = "../../sign-in.html";
    }
  })
})

function gotUsers(data) {
  var obj = data.val();
  var keys = Object.keys(obj);
  console.log(keys);
  users__container.innerHTML = "";
  for (var i=0; i < keys.length; i++) {
    var k = keys[i];
    var username = obj[k].username;
    var color = obj[k].color;
    console.log(username, color);

    if(obj[k].online) {
      displayUsers(username, color);
    }
  }
}
function errData(err) {
  console.log("Error", err);
}

function displayUsers(user, clr) {
  var li = document.createElement('li');
  li.innerHTML = `<li class="each-user">
                    <div class="avatar" style="background: ${clr}">
                      <i class="fas fa-user-alt"></i>
                    </div>
                    <div class="name">
                      <p class="username">${user}</p>
                      <i class="fas fa-circle"></i>
                    </div>
                  </li>`;
  users__container.appendChild(li);
}

function gotMessages(data) {
  var obj = data.val();
  var keys = Object.keys(obj);
  console.log(keys);
  messages__container.innerHTML = "";
  for (var i=0; i < keys.length; i++) {
    var k = keys[i];
    var msg = obj[k].message;
    var name = obj[k].username;
    var clr = obj[k].color;
    var time = obj[k].date;
    console.log(msg, name, time, clr);

    displayMessages(name, msg, time, clr);
  }
}

function displayMessages(username, message, date, color) {
  var li = document.createElement('li');
  li.innerHTML = `<li class="each-message">
                    <div class="avatar" style="background: ${color}">
                      <i class="fas fa-user-alt"></i>
                    </div>
                    <div class="message">
                      <div class="name-time">
                        <p class="username">${username}</p>
                        <span>${date}</span>
                      </div>
                      <p class="text">${message}</p>
                    </div>
                  </li>`;
  messages__container.appendChild(li);

  var objDiv = document.getElementById("scroll");
  objDiv.scrollTop = objDiv.scrollHeight;
}


function sendMessage() {
  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      var msg = document.getElementById("msg").value.trim();
      console.log(msg);

      var currentUser = firebase.auth().currentUser;
      return firebase.database().ref('/Users/' + currentUser.uid).once('value').then((snapshot) => {
        var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        var color = (snapshot.val() && snapshot.val().color) || 'Anonymous';
        console.log(username, color);

      if(msg) {
        var date = new Date();
        var time =  date.toLocaleTimeString();
        console.log("sending");
        writeMessageData(user.uid, username, msg, color, time);
      }

      document.getElementById("msg").value = "";
      })
    }
  })
}

document.addEventListener('keypress', function(event) {
  if(event.keyCode === 13 || event.which === 13) {
    sendMessage();
  }
})
send__message.addEventListener('click', () => {
  sendMessage();
})

function writeMessageData(userId, name, text, clr, date) {
  firebase.database()
    .ref('DefaultRoom/Messages')
    .push({
      userId: userId,
      username: name,
      color: clr,
      message: text,
      date: date
    });
}



