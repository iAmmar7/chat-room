signout.addEventListener('click', (e) => {
  e.preventDefault();

  var userId = firebase.auth().currentUser.uid;
  userOffline(userId);

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
}