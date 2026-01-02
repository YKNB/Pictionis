import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database'
import 'firebase/compat/storage';

const firebaseConfig = {
  // apiKey: 'AIzaSyAOWHBpPhKoNhcGFKHH_Q_0AtL2gV-imgQ',
  // authDomain: 'production-a9404.firebaseapp.com',
  // databaseURL: 'https://production-a9404.firebaseio.com',
  // projectId: 'production-a9404',
  // storageBucket: 'production-a9404.appspot.com',
  // messagingSenderId: '525472070731',
  // appId: '1:525472070731:web:ee873bd62c0deb7eba61ce',
  apiKey: "AIzaSyB1HR0nd5RfZbHXZUJuZ6hBjGLrUpFJKQM",
  authDomain: "fir-auth-7c0b7.firebaseapp.com",
  databaseURL: "https://fir-auth-7c0b7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fir-auth-7c0b7",
  storageBucket: "fir-auth-7c0b7.appspot.com",
  messagingSenderId: "223689763951",
  appId: "1:223689763951:web:1a6a4dafa9214611e2b19a",
  measurementId: "G-YY4WDFR0ET"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();

export const database = firebase.database()

export const storage = firebase.storage(); 

export const loginWithEmail = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

export const registerWithEmail = async (email, password, name) => {
  const { user } = await auth.createUserWithEmailAndPassword(email, password);
  
  database.ref(`users/${user.uid}`).set({
    name
  })
}

export const logout = () => auth.signOut();