import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
    apiKey: "AIzaSyDfZ0JWxb8kJqcpfNg55xVYAtLjKnLfwdU",
    authDomain: "parking-app-e41fd.firebaseapp.com",
    databaseURL: "https://parking-app-e41fd.firebaseio.com",
    projectId: "parking-app-e41fd",
    storageBucket: "parking-app-e41fd.appspot.com",
    messagingSenderId: "82792230608",
    appId: "1:82792230608:web:eaa75c3812780db210f8d5",
    measurementId: "G-SZ8NCNHVZ5"
  };

firebase.initializeApp(config);
export const auth = firebase.auth;
export const db = firebase.database().ref();