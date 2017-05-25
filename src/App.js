import React, { Component } from 'react'
import '../node_modules/react-big-calendar/lib/css/react-big-calendar.css'
import './App.css'
import './global/fonts.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Paper from 'material-ui/Paper'
import MainAppBar from './components/main-app-bar/'
import Login from './Login'
import C from './utilities/constants'
import firebase from 'firebase'
import CustomSnackbar from './components/global/custom-snackbar'
import store from './store'
import * as actions from './actions/events'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#34B466',
    primary2Color: '#34B466',
    pickerHeaderColor: '#34B466',
    accent1Color: '#48bc75'
  },
  appBar: {
    color: '#34B466',
    textColor: '#FFF'
  },
  tabs: {
    backgroundColor: '#FFF',
    textColor: '#9d9d9d',
    selectedTextColor: '#3db262'
  }
})

const paperStyle = {
  backgroundColor: '#f8f8f8',
  width: '100%',
  height: '100%',
  minHeight: '100vh',
  textAlign: 'center',
  display: 'inline-block'
}

const localStorage = window.localStorage

class App extends Component {
  constructor (props) {
    super(props)
    let userLogStatus = localStorage.getItem('isLoggedIn')
    if (!userLogStatus) {
      userLogStatus = 'false'
    }
    this.state = {
      userLoginStatus: userLogStatus
    }
    this.loginHandler = this.loginHandler.bind(this)
    this.logoutHandler = this.logoutHandler.bind(this)
  }

  componentDidMount () {
    var isUserLoggedIn = localStorage.getItem('isLoggedIn')
    if (isUserLoggedIn) {
      this.setState({
        userLoginStatus: isUserLoggedIn
      })
    }
  }

  loginHandler () {
    let authProvider = null
    authProvider = new firebase.auth.GoogleAuthProvider()
    C.FIREBASE.auth().signInWithPopup(authProvider).then(function (result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken
          // The Signed-in user email
      var emailAddress = result.user.email
      var idx = emailAddress.lastIndexOf('@')
      if (idx > -1 && emailAddress.slice(idx + 1) === 'gmail.com') {
        const currentUser = C.FIREBASE.auth().currentUser
        const userObject = {
          'key': currentUser.uid,
          'name': currentUser.displayName,
          'email': currentUser.email,
          'avatar': currentUser.photoURL,
          'token': token
        }
        localStorage.setItem('isLoggedIn', true)
        localStorage.setItem('userData', JSON.stringify(userObject))
        store.dispatch(actions.initStore(userObject.key))
        this.writeUserData()
        this.setState({
          userLoginStatus: true
        })
      } else {
        localStorage.setItem('isLoggedIn', false)
        store.dispatch(actions.setSnackbar({open: true, message: 'Not a valid Gmail ID!'}))
        this.setState({
          userLoginStatus: localStorage.getItem('isLoggedIn')
        })
      }
    }.bind(this)).catch(function (error) {
      console.log(error)
      var errorCode = error.code
      var errorMessage = error.message
      var email = error.email
      store.dispatch(actions.setSnackbar({open: true, message: `Error Signing in with email ${email} : #${errorCode} : ${errorMessage}`}))
    })
  }

  logoutHandler (e) {
    C.FIREBASE.auth().signOut().then(function () {
      localStorage.setItem('isLoggedIn', false)
      this.setState({userLoginStatus: localStorage.getItem('isLoggedIn')})
      C.FIREBASE.database().ref('events').off()
    }.bind(this)).catch(function (error) {
      console.log('Error Signing out : ' + error)
    })
  }

  writeUserData () {
    let user = C.FIREBASE.auth().currentUser
    var topUserPostsRef = C.FIREBASE.database().ref('users/' + user.uid)
    topUserPostsRef.once('value').then(function (snapshot) {
      if (!snapshot.val()) {
        firebase.database().ref('users/' + user.uid).set({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email
        })
      }
    })
  }

  render () {
    let content = null
    if (this.state.userLoginStatus === 'false') {
      content = (
        <Login
          loginHandler={this.loginHandler}
            />
        )
    } else {
      content = (
        <div>
          <MainAppBar logoutHandler={this.logoutHandler} />
          <Paper style={paperStyle} zDepth={0}>
            {this.props.children}
          </Paper>
        </div>
        )
    }
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className='App'>
          {content}
          <CustomSnackbar data={store.getState().snackbarReducer} />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App
