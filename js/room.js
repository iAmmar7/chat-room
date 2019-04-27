document.getElementById('msg').focus();

if (window.location.hash === "") {
  window.location.hash = "DefaultRoom";
}
var hashValue = window.location.hash;
hashValue = hashValue.substring(1);

window.addEventListener("DOMContentLoaded", () => {
  render(hashValue);
})

if (!activeMembersList) {
  var activeMembersList = [];
}
var roomList = [];

function render(hashValue) {

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // changeRoom(hashValue);

      var currentUser = firebase.auth().currentUser;
      return firebase.database().ref('/Users/' + currentUser.uid).once('value').then((snapshot) => {
        var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        var color = (snapshot.val() && snapshot.val().color) || 'Anonymous';

        pushUserRoomMembers(hashValue, currentUser.uid, username, color);

        if (hashValue) {
          var roomsData = db.ref(`Rooms/${hashValue}/`);
          roomsData.on('value', gotData, errData);

          var avalaibaleRooms = db.ref(`Rooms/`);
          avalaibaleRooms.on('value', gotAvailabeRooms, errData);

          if (hashValue === "DefaultRoom") {
            generateURL.style.display = 'none';
          } else {
            generateURL.style.display = 'initial';
          }

        }
      })
    } else {
      window.location.href = "../../sign-in.html"
      console.log("User not logged in");
    }
  })
}

function gotData(data) {
  var currentUser = firebase.auth().currentUser.uid;
  var roomName = data.val().RoomName;
  var members = data.val().Members;
  var admin = data.val().AdminId;
  var userExist = false;
  // console.log(newActiveMembers);
  var newActiveMembers = activeMembersList;
  console.log(newActiveMembers.length, activeMembersList.length);
  // console.log("Store: " + store_activeMembers.length);

  room__name.firstElementChild.innerHTML = "";
  users__container.innerHTML = "";
  messages__container.innerHTML = "";

  if (members) {
    // check for new members
    // if yes then show popoup

    // reset new members list
    activeMembersList = [];
    var memKeys = Object.keys(members);

    for (var i = 0; i < memKeys.length; i++) {
      var k = memKeys[i];
      var username = members[k].username;
      var color = members[k].color;

      if (members[k].isActive) {
        displayMembers(username, color, k, admin);
        activeMembersList.push(k);
      }
      if(currentUser === k) {
        userExist = true;
      }
    }

    if(!userExist) {
      changeRoom("DefaultRoom");
    }
    // activeMembersList = [];

    // console.log(members);
    // console.log("App: " + activeMembersList.length);
    // console.log(activeMembersList.length);
    // console.log("Store: " + store_activeMembers.length);

    console.log(newActiveMembers.length, activeMembersList.length);

    // var newActiveMembers = activeMembersList;
    // console.log(newActiveMembers);
    // newActiveMembers = [];
  }

  if (data.val().Messages) {
    var messages = data.val().Messages;
    var msgKeys = Object.keys(messages);

    for (var i = 0; i < msgKeys.length; i++) {
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
  roomList = [];

  rooms__container.innerHTML = "";

  for (var i in allRooms) {
    userCount = 0;
    roomName = null;
    var roomMembers = allRooms[i].Members;
    roomList.push(i);

    for (var j in roomMembers) {

      if (currentUser === j) {
        roomName = allRooms[i].RoomName;
      }
      if (roomMembers[j].isActive) {
        userCount++;
      }
    }
    if (roomName) {
      displayRooms(roomName, userCount, i);
    }
  }
}

function errData(err) {
  console.log("Error", err);
}


//        Display Members
// ================================
function displayMembers(user, clr, id, adminId) {
  var currentUser = firebase.auth().currentUser.uid;
  var li = document.createElement('li');

  // if (id != adminId) {
    li.onclick = function () {
      removeMember(id, adminId);
    // }
  }
  li.innerHTML = `<li class="each-user">
                    <div class="avatar" style="background: ${clr}">
                      <i class="fas fa-user-alt"></i>
                    </div>
                    <div class="name">
                      <p class="username">${user}</p>
                      <i class="fas fa-circle"></i>
                    </div>
                  </li>`;

  if (id === currentUser) {
    li.style.backgroundColor = "rgb(19, 10, 73)";
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
  li.onclick = function () {
    return changeRoom(id);
  }

  li.innerHTML = `<li class="each-room">
                    <p>${name}</p>
                    <span>Active Members: ${count}</span>
                  </li>`;

  if (id === window.location.hash.substring(1)) {
    li.style.backgroundColor = "rgb(19, 10, 73)";
  }
  rooms__container.appendChild(li);
}

// window.addEventListener('onhashchange', () => {
//   firebase
//     .database()
//     .ref(`Rooms/${window.location.hash.substring(1)}/Members/${currentUser}/`)
//     .update({
//       isActive: false
//     })
// })

function changeRoom(roomId) {
  var currentUser = firebase.auth().currentUser.uid;
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
send__message.addEventListener('click', () => {
  alert("msg field by icon");
  sendMessage();
})

function sendMessage() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var msg = document.getElementById("msg").value.trim();

      var currentUser = firebase.auth().currentUser;
      return firebase.database().ref(`/Rooms/${hashValue}/Members/` + currentUser.uid).once('value').then((snapshot) => {
        var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        var color = (snapshot.val() && snapshot.val().color) || 'Anonymous';

        if (msg) {
          var date = new Date();
          var time = date.toLocaleTimeString();
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
    if (user) {
      var currentUser = firebase.auth().currentUser;
      return firebase.database().ref('/Users/' + currentUser.uid).once('value').then((snapshot) => {
        var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        var color = (snapshot.val() && snapshot.val().color) || 'Anonymous';

        var createDate = new Date().toDateString();
        var roomName = prompt("Enter a name of your Room: ").trim();
        if (roomName) {
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

//      Change Room By Link
//=====================================
searchRoomicon.addEventListener('click', () => {
  changeRoomByLink();
});

function changeRoomByLink() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var roomLink = document.getElementById("room").value.trim();
      var correctRoomLink;
      if (roomLink) {
        roomList.forEach(element => {
          if (element === roomLink) {
            correctRoomLink = roomLink;
          }
        });
        if (correctRoomLink) {
          changeRoom(correctRoomLink);
        } else {
          alert("No room found!!\nDid you make a typo?");
        }
      }
    }
  })
}

//      Enter KeyPress Event
//==========================================
document.addEventListener('keypress', function (event) {
  if (event.keyCode === 13 || event.which === 13) {
    if (document.activeElement === document.getElementById('msg')) {
      sendMessage();
    }
    if (document.activeElement === document.getElementById('room')) {
      changeRoomByLink();
    }
  }
})


//      Other Events
//======================================
generateURL.addEventListener('click', () => {
  alert(hashValue);
})

goToAnotherRoom.addEventListener('focus', () => {
  document.getElementById('room').focus();
  searchRoomicon.style.color = "white";
})

//        Remove User
//=========================================
function removeMember(id, adminId) {
  currentUser = firebase.auth().currentUser.uid;

  if(id != adminId) {
    if (adminId === currentUser) {
      firebase.database().ref(`/Rooms/${hashValue}/Members/`).once("value").then(function(snapshot) {
        snapshot.forEach(function(child) {
          if (id === child.key) {
            console.log('Removing child '+ child.key);
            child.ref.remove();
          }
        });
      });
    }
  }
}