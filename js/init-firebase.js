  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBXgO8lsXb99e0UldjEgxQtZZft4gul8tg",
    authDomain: "chat-room-12345.firebaseapp.com",
    databaseURL: "https://chat-room-12345.firebaseio.com",
    projectId: "chat-room-12345",
    storageBucket: "chat-room-12345.appspot.com",
    messagingSenderId: "827404637249"
  };
  firebase.initializeApp(config);

  console.log("Firebase Connected!!")
  const auth = firebase.auth();
  const db = firebase.database();

  