import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAKQF_t6-UUwGZzJBqXYTtpdeyWyPC3z_0",
    authDomain: "owlhacksproject.firebaseapp.com",
    projectId: "owlhacksproject",
    storageBucket: "owlhacksproject.appspot.com",
    messagingSenderId: "50760214517",
    appId: "1:50760214517:web:9c940e4429fb634eb422bc",
    measurementId: "G-72SV9DS10G"
  };


const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;