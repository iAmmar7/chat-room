if(window.location.hash === "") { 
  window.location.hash = "DefaultRoom";
}
var hashValue = window.location.hash;
hashValue = hashValue.substring(1); 

window.addEventListener("DOMContentLoaded", () => {
  render(hashValue);
})

var membersList = [];

function render(hashValue) {

  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      // changeRoom(hashValue);

      var currentUser = firebase.auth().currentUser;
      return firebase.database().ref('/Users/' + currentUser.uid).once('value').then((snapshot) => {
        var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        var color = (snapshot.val() && snapshot.val().color) || 'Anonymous';

        pushUserRoomMembers(hashValue, currentUser.uid, username, color);

        if(hashValue) {
          console.log(hashValue);
          var roomsData = db.ref(`Rooms/${hashValue}/`);
          roomsData.on('value', gotData, errData);

          var avalaibaleRooms = db.ref(`Rooms/`);
          avalaibaleRooms.on('value', gotAvailabeRooms, errData);

          if(hashValue === "DefaultRoom") {
            console.log(hashValue);
            generateURL.style.display = 'none';
          } else {
            generateURL.style.display = 'initial';
          }

        }
      })
    }  else {
      window.location.href = "../../sign-in.html"
      console.log("User not logged in");
    }
  })
}

function gotData(data) {
  var roomName = data.val().RoomName;
  var members = data.val().Members;

  room__name.firstElementChild.innerHTML = "";
  users__container.innerHTML = "";
  messages__container.innerHTML = "";

  if(members) {


    // check foir nwew members
    // if yes gthen show popoup

    // reset new members list
    membersList = [];
    console.log(membersList);
    var memKeys = Object.keys(members);

    for (var i=0; i < memKeys.length; i++) {
      var k = memKeys[i];
      var username = members[k].username;
      var color = members[k].color;

      if(members[k].isActive) {
        displayMembers(username, color, k);
        membersList.push(i);
    console.log(membersList);

      }
    }
  }

  if(data.val().Messages) {
    var messages = data.val().Messages;
    var msgKeys = Object.keys(messages);

    for (var i=0; i < msgKeys.length; i++) {
      var k = msgKeys[i];
      var msg = messages[k].message;
      var name = messages[k].username;
      var clr = messages[k].color;
      var time = messages[k].date;

      displayMessages(name, msg, time, clr, roomName);
    }
  }

  var h2 = document.createElement('h2');
  h2.innerHTML = `${roomName}`;
  room__name.insertBefore(h2, room__name.firstChild);
}

function gotAvailabeRooms(data) {
  var currentUser = firebase.auth().currentUser.uid;
  var userCount;
  var roomName;
  var allRooms = data.val();

  console.log(allRooms);

  rooms__container.innerHTML = "";

  for (var i in allRooms) {
    userCount = 0;
    roomName = null;
    var roomMembers = allRooms[i].Members;

    for (var j in roomMembers) {

      if(currentUser === j) {
        roomName = allRooms[i].RoomName;
      }
      if(roomMembers[j].isActive) {
        userCount++;
      }
    }
    if(roomName) {
      displayRooms(roomName, userCount, i);
    }
  }
}

function errData(err) {
  console.log("Error", err);
}


//        Display Members
// ================================
function displayMembers(user, clr, id) {
  var currentUser = firebase.auth().currentUser.uid;
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

  if(id === currentUser) {
    li.style.backgroundColor = "black";
  }
  users__container.appendChild(li);
}

//        Display Messages
// ================================
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

//        Display Rooms
// ================================
function displayRooms(name, count, id) {
  var li = document.createElement('li');
  li.onclick = function() {
    return changeRoom(id);
  }

  li.innerHTML = `<li class="each-room">
                    <p>${name}</p>
                    <span>Active Members: ${count}</span>
                  </li>`;

  if(id === window.location.hash.substring(1)) {
    li.style.backgroundColor = "black";
  }
  rooms__container.appendChild(li);
}

window.addEventListener('onhashchange', () => {
  firebase
    .database()
    .ref(`Rooms/${window.location.hash.substring(1)}/Members/${currentUser}/`)
    .update({
      isActive: false
    })
})
function changeRoom(roomId) {
  var currentUser = firebase.auth().currentUser.uid;
  console.log("here");
  firebase
    .database()
    .ref(`Rooms/${window.location.hash.substring(1)}/Members/${currentUser}/`)
    .update({
      isActive: false
    })
  render(roomId);
  window.location.hash = roomId;
  location.reload();
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

      var currentUser = firebase.auth().currentUser;
      return firebase.database().ref(`/Rooms/${hashValue}/Members/` + currentUser.uid).once('value').then((snapshot) => {
        var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        var color = (snapshot.val() && snapshot.val().color) || 'Anonymous';

      if(msg) {
        var date = new Date();
        var time =  date.toLocaleTimeString();
        writeMessageData(user.uid, username, msg, color, time, hashValue);
      }

      document.getElementById("msg").value = "";
      })
    }
  })
}

function writeMessageData(userId, name, text, clr, date, value) {
  firebase.database()
    .ref(`Rooms/${window.location.hash.substring(1)}/Messages/`)
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
createRoom.addEventListener('click', () => {
  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      var currentUser = firebase.auth().currentUser;
      return firebase.database().ref('/Users/' + currentUser.uid).once('value').then((snapshot) => {
        var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        var color = (snapshot.val() && snapshot.val().color) || 'Anonymous';

        var createDate = new Date().toDateString();
        var roomName = prompt("Enter a name of your Room: ").trim();
        if(roomName) {
          addRoom(currentUser.uid, username, roomName, createDate, color);
        } else {
          alert("Please enter a valid name");
        }
      });
    }
  });
})

function addRoom(userId, name, room, date) {
  var roomId = firebase
    .database()
    .ref('Rooms')
    .push({
      AdminId: userId,
      AdminName: name,
      RoomName: room,
      CreationDate: date
    }).key;

    changeRoom(roomId);
}

function pushUserRoomMembers(roomId, userId, name, color) {
  firebase
    .database()
    .ref(`Rooms/${roomId}/Members/` + userId)
    .set({
      username: name,
      color: color,
      isActive: true,
    })
}


generateURL.addEventListener('click', () => {
  alert(window.location.href);
})