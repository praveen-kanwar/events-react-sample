import firebase from 'firebase'

const firebaseConf = {
  apiKey: "AIzaSyAHMxFMyZUAK2EGzTyum0f6AV8ysbR9VrY",
  authDomain: "kp-events.firebaseapp.com",
  databaseURL: "https://kp-events.firebaseio.com",
  projectId: "kp-events",
  storageBucket: "kp-events.appspot.com",
  messagingSenderId: "399580005768"
}
firebase.initializeApp(firebaseConf)

const C = {
  // Auth actions.
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT: 'LOGOUT',
  LISTENING_TO_AUTH: 'LISTENING_TO_AUTH',

  // Auth states.
  LOGGED_IN: 'LOGGED_IN',
  LOGGING_IN: 'LOGGING_IN',
  LOGGED_OUT: 'LOGGED_OUT',

  // MISC.
  FIREBASE: firebase,

  // Field Lengths
  titleMaxLength: 65,
  notesMaxLength: 24,
  configMaxLength: 20
}

export default C
