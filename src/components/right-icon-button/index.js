import React, { Component } from 'react'
import {grey400} from 'material-ui/styles/colors'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import C from '../../utilities/constants'
import * as actions from '../../actions/events'
import store from '../../store'

const iconButtonElement = (
  <IconButton
    touch
    tooltip='more'
    tooltipPosition='bottom-left' >
    <MoreVertIcon color={grey400} />
  </IconButton>
)
const localStorage = window.localStorage

class RightIconButton extends Component {
  click (eventId, action) {
    const userId = (JSON.parse(localStorage.getItem('userData'))).key

    if (action === 'Update' || action === 'Delete') {

    } else {
      // add user action to events
      let eventRef = C.FIREBASE.app().database().ref(`events`).child(eventId).child(`users`).child(userId)
      eventRef.set(action).then((newRoast) => {
        // add events where action is taken by the user - to user object
        let userRef = C.FIREBASE.app().database().ref(`users`).child(userId).child(`events`).child(eventId)
        userRef.set(action).then((newRoast) => {
          store.dispatch(actions.setSnackbar({open: true, message: `You have replied '${action}' to this event`}))
        })
      })
    }
  }

  render () {
    return (
      <div>
        {
          this.props.createdByMe
            ? <IconMenu iconButtonElement={iconButtonElement}>
              <MenuItem onClick={this.click.bind(this, this.props.eventId, 'Update')}>Update</MenuItem>
              <MenuItem onClick={this.click.bind(this, this.props.eventId, 'Delete')}>Delete</MenuItem>
            </IconMenu>
          : <IconMenu iconButtonElement={iconButtonElement}>
            <MenuItem onClick={this.click.bind(this, this.props.eventId, 'Yes')}>Yes</MenuItem>
            <MenuItem onClick={this.click.bind(this, this.props.eventId, 'No')}>No</MenuItem>
            <MenuItem onClick={this.click.bind(this, this.props.eventId, 'Maybe')}>Maybe</MenuItem>
          </IconMenu>
        }
      </div>
    )
  }
}

export default RightIconButton
