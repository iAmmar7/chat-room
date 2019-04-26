window.addEventListener("DOMContentLoaded", () => {
  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      window.location.href = "../../../room.html"
      console.log("User not logged in");
    } else {
      console.log("Login Page");
    }
  })
});


sigin__form.addEventListener("submit", (e) => {
  e.preventDefault();

  var email = document.getElementById("your_email").value;
  var pass = document.getElementById("your_pass").value;

  firebase.auth()
    .signInWithEmailAndPassword(email, pass)
    .then(res => {
      alert(res, "Succesfull");

      pushToDefaultRoom(res.user.uid);
      userOnline(res.user.uid);
      setTimeout(() => {
        window.location.href = "../../room.html";
      }, 1000);
    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      alert(errorMessage);
      console.log(errorCode);
    });
});

function userOnline(userId) {
  firebase
    .database()
    .ref('Users/' + userId)
    .update({
      online: true
    });

  // firebase
  //   .database()
  //   .ref('Rooms/DefaultRoom/Members/' + userId)
  //   .update({
  //     isActive: true,
  //     online: true
  //   });
}

function pushToDefaultRoom(id) {
  var users = db.ref(`Users/${id}`);
  users.on('value', (data) => gotUser(data, id));
  // users.on('value', gotUser, gotErr)

  console.log('This is user id',  id);
}

function gotUser(data, id) {
  var firebaseObj = data.val();
  console.log(firebaseObj, firebaseObj.username);
  
  // firebase
  //   .database()
  //   .ref(`Rooms/DefaultRoom/Members/` + id)
  //   .set({
  //     username: firebaseObj.username,
  //     color: firebaseObj.color,
  //     isActive: true,
  //     online: true
  //   })
}

function gotErr(error) {
  alert("Line 76: " + error);
}