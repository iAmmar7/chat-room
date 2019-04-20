var displayname = document.querySelector(".username");

window.addEventListener("DOMContentLoaded", () => {
  
  firebase.auth().onAuthStateChanged(user => {
    if(user) {

      var userId = firebase.auth().currentUser.uid;
      return firebase.database().ref('/Users/' + userId).once('value').then((snapshot) => {
        var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        
        displayname.innerHTML = `${username}'s`;

        console.log(username);
      })
    } else {
      console.log("User not logged in");
    }
  })
})
