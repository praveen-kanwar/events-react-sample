import React from 'react'
import {
    Avatar,
    List,
    Divider,
    CardHeader,
    CardActions,
    Toggle
  } from 'material-ui'
import '../index.css'
import C from '../../../utilities/constants'
import * as actions from '../../../actions/events'
import store from '../../../store'

class UsersList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userList: this.props.userList
    }
  }

  componentWillReceiveProps (nextProps, nextState) {
    this.setState({
      userList: nextProps.userList
    })
  }

  onToggleChange = (userId, e, toggle) => {
    let ref = C.FIREBASE.app().database().ref('users').child(userId)
    ref.update({
      isAdmin: toggle
    }).then((newRoast) => {
      var message = toggle ? 'Admin access given' : 'Admin access revoked'
      store.dispatch(actions.setSnackbar({open: true, message: message}))
    })
  }

  render () {
    return (
      <div>
        <List>
          {this.state.userList !== [] ? this.state.userList.map((userObj, i) => {
            return (
              <div key={i}>
                <div className='item-wrapper'>
                  <Avatar className='color-left' src={userObj.photoURL} />
                  <CardHeader className='name-left'
                    title={userObj.displayName}
                />
                  <CardActions className='toggle-right'>
                    <Toggle
                      defaultToggled={userObj.isAdmin ? userObj.isAdmin : false}
                      onToggle={this.onToggleChange.bind(this, userObj.uid)}
                  />
                  </CardActions>
                </div>
                <Divider />
              </div>
            )
          }) : null}
        </List>
      </div>
    )
  }
}

export default UsersList
