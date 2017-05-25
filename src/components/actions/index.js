import React, { Component } from 'react'
import {
  RaisedButton,
  FlatButton,
  Dialog,
  CircularProgress,
  Tabs,
  Tab
} from 'material-ui'
import C from '../../utilities/constants'
import Colors from '../../utilities/colors'
import EditAction from 'material-ui/svg-icons/content/create'
import DeleteAction from 'material-ui/svg-icons/action/delete'
import CreateEvent from '../events/create'
import * as actions from '../../actions/events'
import store from '../../store'
import { hashHistory } from 'react-router'
import './index.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

const styles = {
  button: {
    marginRight: 12,
    marginTop: 4
  }
}

const localStorage = window.localStorage

class ButtonActions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      processingRequest: false,
      userId: props.userId,
      yesColor: Colors.white,
      maybeColor: Colors.white,
      noColor: Colors.white,
      yesLabelColor: Colors.black,
      maybeLabelColor: Colors.black,
      noLabelColor: Colors.black,
      showDelete: false,
      isOpen: false,
      actionValue: '',
      muiTheme: getMuiTheme({
        palette: {
          accent1Color: '#3db262'
        },
        tabs: {
          backgroundColor: '#FFF',
          textColor: '#39393a',
          selectedTextColor: '#3db262'
        }
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps) {
      this.setState({
        userId: nextProps.userId
      })
    }
    if (nextProps !== this.props) {
      if (nextProps.eventObject) {
        this.setInitialState(nextProps.eventObject)
      }
    }
  }

  componentDidMount () {
    if (this.props) {
      this.setState({
        userId: this.props.userId
      })
      this.setInitialState(this.props.eventObject)
    }
  }

  setInitialState = (eventObject) => {
    var obj = eventObject.users
    if (obj) {
      let users = Object.keys(obj).map(function (key) {
        return {id: key, action: obj[key].response}
      })
      users.forEach((user) => {
        if (user.id === this.state.userId) {
          this.setButtonsColor(user.action)
        }
      })
    }
  }

  setButtonsColor = (action) => {
    switch (action) {
      case 'Yes':
        this.setState({
          muiTheme: getMuiTheme({
            palette: {
              accent1Color: Colors.yesColor
            },
            tabs: {
              backgroundColor: Colors.white,
              textColor: '#39393a',
              selectedTextColor: Colors.yesColor
            }
          })
        })
        break
      case 'Maybe':
        this.setState({
          muiTheme: getMuiTheme({
            palette: {
              accent1Color: Colors.maybeColor
            },
            tabs: {
              backgroundColor: Colors.white,
              textColor: '#39393a',
              selectedTextColor: Colors.maybeColor
            }
          })
        })
        break
      case 'No':
        this.setState({
          muiTheme: getMuiTheme({
            palette: {
              accent1Color: Colors.noColor
            },
            tabs: {
              backgroundColor: Colors.white,
              textColor: '#39393a',
              selectedTextColor: Colors.noColor
            }
          })
        })
        break
      default: break
    }
    this.setState({
      actionValue: action
    })
  }

  editAction = () => {
    this.setState({
      isOpen: true
    })
  }

  handleDeleteOpen = () => {
    this.setState({
      showDelete: true
    })
  }

  handleDeleteClose = () => {
    this.setState({
      showDelete: false,
      processingRequest: false
    })
  }

  handleDeleteConfirm = () => {
    this.setState({
      processingRequest: true
    })
    this.deleteEvent()
  }

  deleteEvent = () => {
    let eventRef = C.FIREBASE.app().database().ref(`events`).child(this.props.eventId)
    eventRef.remove().then((newRoast) => {
      // Event Deleted successfully
      this.deleteSpeakerImage()
    }).catch(function (error) {
      console.log(JSON.stringify(error))
    })
  }

  deleteSpeakerImage = () => {
    let speakerImageRef
    if (this.props.eventObject.hasSpeaker) {
      if (this.props.eventObject.speaker.fileName) {
        let imagePath = 'eventImages/speakerImages/' + this.props.eventObject.speaker.fileName
        speakerImageRef = C.FIREBASE.storage().ref().child(imagePath)
      }
    }
    if (speakerImageRef) {
      speakerImageRef.delete().then(() => {
        // Image Deleted successfully
        this.deleteEventImage()
      }).catch(function (error) {
        console.log(JSON.stringify(error))
      })
    } else {
      this.deleteEventImage()
    }
  }

  deleteEventImage = () => {
    let imageRef
    if (this.props.eventObject.eventImage) {
      let imagePath = 'eventImages/' + this.props.eventObject.eventImageName
      imageRef = C.FIREBASE.storage().ref().child(imagePath)
    }
    if (imageRef) {
      imageRef.delete().then(() => {
        // Image Deleted successfully
        store.dispatch(actions.setSnackbar({open: true, message: 'Deleted successfully'}))
        this.handleDeleteClose()
        hashHistory.push(this.props.deleteRedirectPath || '/')
      }).catch(function (error) {
        console.log(JSON.stringify(error))
      })
    } else {
      store.dispatch(actions.setSnackbar({open: true, message: 'Deleted successfully'}))
      this.handleDeleteClose()
      hashHistory.push(this.props.deleteRedirectPath || '/')
    }
  }

  handleDeleteAllConfirm = () => {
    let ref = C.FIREBASE.database().ref('events').orderByChild('reoccuringId').equalTo(this.props.eventObject.reoccuringId)
    ref.once('value', snapshot => {
      let obj = snapshot.val()
      if (obj) {
        let itemsToBeDeleted = Object.keys(obj).length
        var deletedItem = 0
        Object.keys(obj).map(function (key) {
          let eventRef = C.FIREBASE.app().database().ref(`events`).child(key)
          eventRef.remove().then((newRoast) => {
            deletedItem++
            if (itemsToBeDeleted === deletedItem) {
              store.dispatch(actions.setSnackbar({open: true, message: 'Deleted successfully'}))
              this.handleDeleteClose()
              hashHistory.push(this.props.deleteRedirectPath || '/')
            }
          })
          return key
        }, this)
      }
    })
  }

  handleClose = () => {
    this.setState({
      isOpen: false
    })
  }

  handleChange (eventId, action) {
    // add user action to events
    let userDetail = JSON.parse(localStorage.getItem('userData'))
    let eventRef = C.FIREBASE.app().database().ref(`events`).child(eventId).child(`users`).child(this.state.userId)
    let eventObjectToBeSent = {
      name: userDetail.name,
      avatar: userDetail.avatar,
      email: userDetail.email,
      response: action
    }
    eventRef.set(eventObjectToBeSent).then((newRoast) => {
    // add events where action is taken by the user - to user object
      let userRef = C.FIREBASE.app().database().ref(`users`).child(this.state.userId).child(`events`).child(eventId)
      userRef.set(action).then((newRoast) => {
        store.dispatch(actions.setSnackbar({open: true, message: `You have replied '${action}' to this event`}))
      })
    })
  }

  getActionButton = () => {
    var deleteActions
    if (this.state.processingRequest) {
      deleteActions = [
        <CircularProgress
          thickness={7}
        />
      ]
    } else {
      deleteActions = [
        <FlatButton
          label='Cancel'
          onTouchTap={this.handleDeleteClose}
        />,
        <RaisedButton
          label='Delete'
          backgroundColor={Colors.deleteColor}
          labelColor={Colors.white}
          style={{marginLeft: 10}}
          onTouchTap={this.handleDeleteConfirm}
        />
      ]
      if (this.props.eventObject.isReoccuring) {
        deleteActions.push(<RaisedButton
          label='Delete All'
          style={{marginLeft: 10}}
          backgroundColor={Colors.deleteColor}
          labelColor={Colors.white}
          onTouchTap={this.handleDeleteAllConfirm}
        />)
      }
    }
    return deleteActions
  }

  render () {
    return (
      <div style={{marginBottom: 20}}>
        <hr className='Line' />
        {this.props.createdBy === this.state.userId && <div style={{height: 42}}>
          <RaisedButton
            label='Edit'
            backgroundColor={Colors.editColor}
            labelColor={Colors.white}
            icon={<EditAction />}
            onTouchTap={this.editAction}
            style={styles.button}
            />
          <RaisedButton
            label='Delete'
            backgroundColor={Colors.deleteColor}
            labelColor={Colors.white}
            icon={<DeleteAction />}
            onTouchTap={this.handleDeleteOpen}
            />
          <CreateEvent
            onRequestClose={this.handleClose}
            isOpen={this.state.isOpen}
            edit
            eventObject={this.props.eventObject}
            eventKey={this.props.eventObject.id}
          />
        </div>
        }
        {this.props.createdBy !== this.state.userId &&
        <MuiThemeProvider muiTheme={this.state.muiTheme}>
          <Tabs
            style={{width: 280}} value={this.state.actionValue} onChange={this.handleChange.bind(this, this.props.eventObject.id)}>
            <Tab
              key={0}
              value={'Yes'}
              label={'Yes'}
              style={{width: '33.33%', height: 42, fontFamily: 'PostGrotesk Book', letterSpacing: 1}} />
            <Tab
              key={1}
              value={'Maybe'}
              label={'Maybe'}
              style={{width: '33.33%', height: 42, fontFamily: 'PostGrotesk Book', letterSpacing: 1}} />
            <Tab
              key={2}
              value={'No'}
              label={'No'}
              style={{width: '33.33%', height: 42, fontFamily: 'PostGrotesk Book', letterSpacing: 1}} />
          </Tabs>
        </MuiThemeProvider>
        }
        <Dialog
          title='Confirm delete'
          actions={this.getActionButton()}
          modal={false}
          open={this.state.showDelete}
          onRequestClose={this.handleDeleteClose}
        >
          {`Are you sure you want to delete this event?`}
        </Dialog>
      </div>
    )
  }
}

export default ButtonActions
