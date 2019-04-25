signout.addEventListener('click', (e) => {
  e.preventDefault();

  var userId = firebase.auth().currentUser.uid;
  userOffline(userId);
  if(window.location.hash === "") {
    
  }

  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.href = "../../sign-in.html";
    })
    .catch(err => () => alert(err))
})

function userOffline(userId) {
  firebase
    .database()
    .ref('Users/' + userId)
    .update({
      online: false
    });

  firebase
    .database()
    .ref(`Rooms/DefaultRoom/Members/${userId}/`)
    .update({
      online: false,
      isActive: false
    })
}