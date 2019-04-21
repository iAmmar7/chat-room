// var displayname = document.querySelector(".username");

window.addEventListener("DOMContentLoaded", () => {
  
  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      console.log(1);

      var users = db.ref().child('Users');
      var currentUser = firebase.auth().currentUser;
      return firebase.database().ref('/Users/' + currentUser.uid).once('value').then((snapshot) => {
        var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        
        displayname.innerHTML = `${username}'s`;

        console.log(2);

        console.log(username);
        console.log(3);
        console.log(users);

      })
    } else {
      console.log("User not logged in");
    }
  })
})

send__message.addEventListener('click', () => {
  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      var msg = document.getElementById("msg").value;
      console.log(msg);
      document.getElementById("msg").value = "";
    }
  })
})



