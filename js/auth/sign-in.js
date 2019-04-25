
sigin__form.addEventListener("submit", (e) => {
  e.preventDefault();

  var email = document.getElementById("your_email").value;
  var pass = document.getElementById("your_pass").value;

  firebase.auth()
    .signInWithEmailAndPassword(email, pass)
    .then(res => {
      alert(res, "Succesfull");

      window.location.href = "../../room.html";
      userOnline(res.user.uid);
      pushToDefaultRoom(res.user.uid);
    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      alert(errorMessage)
    });
});

function userOnline(userId) {
  firebase
    .database()
    .ref('Users/' + userId)
    .update({
      online: true
    });
}

function pushToDefaultRoom(userId) {
  var users = db.ref(`Users/${userId}`);
  users.on('value', (data) => gotUser(data, userId));
  // fetch user obj 
  // then push it into list  of mems
}

function gotUser(data, userId) {
  console.log(data, userId);
  var onlineObj = data.val();
  delete onlineObj.email;
  delete onlineObj.online;
  var obj = {...onlineObj, isActive : true};
  firebase
    .database()
    .ref('DefaultRoom/Members/' + userId)
    .set(
      obj
    )
}
