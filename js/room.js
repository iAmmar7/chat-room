window.location.hash = 'DefaultRoom';
var hashValue = window.location.hash;
hashValue = hashValue.substring(1);

console.log(window.location.hash);

window.addEventListener("DOMContentLoaded", () => {

  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      console.log(1);

      if(window.location.hash === "#DefaultRoom") {
        console.log("Current Hash value: ", window.location.hash);
        // var users = db.ref('DefaultRoom/Members');
        // users.on('value', gotData, errData);

        var roomsData = db.ref('Rooms/DefaultRoom/');
        roomsData.on('value', gotData, errData);

        // var rooms = db.ref('UsersRoom/');
        // rooms.on('value', gotRooms, errData);

        generateURL.style.display = 'none';
      }

      // var currentUser = firebase.auth().currentUser;
      // return firebase.database().ref('/Users/' + currentUser.uid).once('value').then((snapshot) => {
      //   var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        
      //   displayname.innerHTML = `${username}'s`;

      //   console.log(username);

      // })
    } else {
      window.location.href = "../../sign-in.html"
      console.log("User not logged in");
    }
  })
})

function gotData(data) {
  var roomName = data.val().RoomName;
  var countActive = 0;
  console.log(roomName);

  var members = data.val().Members;
  var memKeys = Object.keys(members);

  users__container.innerHTML = "";
  rooms__container.innerHTML = "";
  messages__container.innerHTML = "";

  for (var i=0; i < memKeys.length; i++) {
    var k = memKeys[i];
    var username = members[k].username;
    var color = members[k].color;
    console.log(username, color);

    if(members[k].isActive) {
      displayMembers(username, color);
      countActive++;
    }
  }
  displayRooms(roomName, countActive);

  if(data.val().Messages) {
    var messages = data.val().Messages;
    var msgKeys = Object.keys(messages);

    for (var i=0; i < msgKeys.length; i++) {
      var k = msgKeys[i];
      var msg = messages[k].message;
      var name = messages[k].username;
      var clr = messages[k].color;
      var time = messages[k].date;
      console.log(msg, name, time, clr);

      displayMessages(name, msg, time, clr);
    }
  }
}

function errData(err) {
  console.log("Error", err);
}

function displayMembers(user, clr) {
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

function displayRooms(name, count) {
  var li = document.createElement('li');
  li.innerHTML = `<li class="each-room">
                    <p>${name}</p>
                    <span>Active Members: ${count}</span>
                  </li>`;
                  console.log(count);
  rooms__container.appendChild(li);
}

//            SEND MESSAGES
// ====================================
document.addEventListener('keypress', function(event) {
  if(event.keyCode === 13 || event.which === 13) {
    sendMessage();
  }
})
send__message.addEventListener('click', () => {
  sendMessage();
})

function sendMessage() {
  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      var msg = document.getElementById("msg").value.trim();
      console.log(msg);

      var currentUser = firebase.auth().currentUser;
      return firebase.database().ref(`/Rooms/${hashValue}/Members/` + currentUser.uid).once('value').then((snapshot) => {
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

function writeMessageData(userId, name, text, clr, date) {
  firebase.database()
    .ref('Rooms/DefaultRoom/Messages/')
    .push({
      userId: userId,
      username: name,
      color: clr,
      message: text,
      date: date
    });
}


//                    CREATE ROOM
// =================================================
// createRoom.addEventListener('click', () => {
//   firebase.auth().onAuthStateChanged(user => {
//     if(user) {
//       console.log("hello form create room");
//       var currentUser = firebase.auth().currentUser;
//       console.log(currentUser.uid);
//       return firebase.database().ref('/Users/' + currentUser.uid).once('value').then((snapshot) => {
//         var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
//         var color = (snapshot.val() && snapshot.val().color) || 'Anonymous';

//         var createDate = new Date().toDateString();
//         var roomName = prompt("Enter a name of your Room: ").trim();
//         if(roomName) {
//           addRoom(currentUser.uid, username, roomName, createDate, color);
//         } else {
//           alert("Please enter a valid name");
//         }
//       });
//     }
//   });
// })

// function addRoom(userId, name, room, date, clr) {
//   var roomId = firebase
//     .database()
//     .ref('UsersRoom')
//     .push({
//       AdminId: userId,
//       AdminName: name,
//       RoomName: room,
//       CreationDate: date
//     }).key;

//     pushToUserCreatedRoomMembers(roomId, userId, name, clr);
// }

// function pushToUserCreatedRoomMembers(roomId, userId, name, color) {
//   firebase
//     .database()
//     .ref(`UsersRoom/${roomId}/Members/` + userId)
//     .set({
//       username: name,
//       color: color,
//       isActive: false
//     })
// }