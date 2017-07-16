import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDdW7V8bdfzQmCTUuBepBM2qgktYm-77bQ",
    authDomain: "mochat-3fd86.firebaseapp.com",
    databaseURL: "https://mochat-3fd86.firebaseio.com",
    projectId: "mochat-3fd86",
    storageBucket: "",
    messagingSenderId: "369231466921"
};

firebase.initializeApp(config);

export default firebase;
