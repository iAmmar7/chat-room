// var displayname = document.querySelector(".username");

window.addEventListener("DOMContentLoaded", () => {
  
  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      console.log(1);

      var users = db.ref('Users');
      users.on('value', gotData, errData);

      var currentUser = firebase.auth().currentUser;
      return firebase.database().ref('/Users/' + currentUser.uid).once('value').then((snapshot) => {
        var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        
        displayname.innerHTML = `${username}'s`;

        console.log(username); 

      })
    } else {
      window.location.href = "../../sign-in.html"
      console.log("User not logged in");
      window.location.href = "../../sign-in.html";
    }
  })
})

function gotData(data) {
  var obj = data.val();
  var keys = Object.keys(obj);
  console.log(keys);
  for (var i=0; i < keys.length; i++) {
    var k = keys[i];
    var username = obj[k].username;
    var color = obj[k].color;
    console.log(username, color);
    
    displayUsers(username, color);
  }
}
function errData(err) {
  console.log("Error", err);
}

send__message.addEventListener('click', () => {
  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      var msg = document.getElementById("msg").value;
      console.log(msg);
      document.getElementById("msg").value = "";
    }
  })
})

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



