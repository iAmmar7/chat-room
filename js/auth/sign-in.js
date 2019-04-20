
sigin__form.addEventListener("submit", (e) => {
  e.preventDefault();

  var email = document.getElementById("your_email").value;
  var pass =  document.getElementById("your_pass").value;
  
  firebase.auth()
  .signInWithEmailAndPassword(email, pass)
  .then(res => {
    alert(res, "Succesfull");
    window.location.href = "../../room.html";
  })
  .catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    alert(errorMessage)
  });
});