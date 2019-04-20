signout.addEventListener('click', (e) => {
  e.preventDefault();

  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.href = "../../sign-in.html";
    })
    .catch(err => () => alert(err))
})