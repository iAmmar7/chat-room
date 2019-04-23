var color = ['black', 'blue', 'purple', 'orange', 'red'];

signup__form.addEventListener("submit", (e) => {
  e.preventDefault();

  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var pass = document.getElementById("pass").value;

  var random_color = Math.floor((Math.random() * 6));

  firebase.auth()
    .createUserWithEmailAndPassword(email, pass)
    .then(res => {
      alert(res);

      writeUserData(res.user.uid, name, res.user.email, color[random_color]);

      window.location.href = "../../sign-in.html";
    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;

      alert(errorCode, errorMessage)
    });
});


function writeUserData(userId, name, email, color) {
  firebase.database()
    .ref('Users/' + userId)
    .set({
      username: name,
      email: email,
      color: color,
      online: false
    });
}

// import { elements } from "./base";

// //----------------------------------------------------------
// //               SignUp
// //----------------------------------------------------------

// elements.signup__button.addEventListener("click", () => {
//   elements.login__button.style.display = "none";
//   elements.signup__button.style.display = "none";
//   elements.Signup__form.style.display = "block";
// });

// elements.signup.addEventListener("click", () => {
//   var email__signup = document.getElementById("email__signup").value;
//   var password__signup = document.getElementById("password__signup").value;
//   var name__signup = document.getElementById("name__signup").value;

//   firebase
//     .auth()
//     .createUserWithEmailAndPassword(email__signup, password__signup)
//     .then(function(user) {
//       writeUserData(user.user.uid, name__signup, user.user.email);
//     })
//     .catch(function(error) {
//       // Handle Errors here.
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       // ...

//       alert(errorMessage);
//     });
// });

// //----------------------------------------------------------
// //               Login
// //----------------------------------------------------------

// elements.login__button.addEventListener("click", () => {
//   elements.login__button.style.display = "none";
//   elements.signup__button.style.display = "none";
//   elements.login__form.style.display = "block";
// });
// elements.login.addEventListener("click", () => {
//   var email__signup = document.getElementById("email__login").value;
//   var password__signup = document.getElementById("password__login").value;
//   firebase
//     .auth()
//     .signInWithEmailAndPassword(email__signup, password__signup)
//     .then(function() {
//       window.location.href = "ChatRoom.html";
//     })
//     .catch(function(error) {
//       // Handle Errors here.
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       alert(errorCode, errorMessage);
//     });
// });

// function writeUserData(userId, name, email) {
//   firebase
//     .database()
//     .ref("users/" + userId)
//     .set({
//       username: name,
//       email: email
//     })
//     .then(function() {
//       window.location.href = "ChatRoom.html";
//     });
// }
