import React from 'react'
import {
    Avatar,
    List,
    Divider,
    CardHeader,
    CardActions
  } from 'material-ui'
import Colors from '../../utilities/colors'

class InviteesList extends React.Component {
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

  render () {
    return (
      <div>
        <List>
          {this.state.userList !== [] ? this.state.userList.map((userObj, i) => {
            if (userObj.action !== 'No') {
              let avatarColor = (userObj.action === 'Yes') ? Colors.yesColor : Colors.maybeColor
              return (
                <div key={i}>
                  <div className='attendee-wrapper'>
                    <Avatar className='color-left' style={{border: `solid ${avatarColor}`}} src={userObj.avatar} />
                    <CardHeader className='item-left'
                      title={userObj.displayName}
                  />
                    <CardActions className='item-right'>
                      {(userObj.action === 'Yes')
                      ? <p style={{color: Colors.yesColor, margin: 8}}> Attending </p>
                      : <p style={{color: Colors.maybeColor, margin: 8}}> May Attend </p>
                    }
                    </CardActions>
                  </div>
                  <Divider />
                </div>
              )
            }
            return null
          }) : null}
        </List>
      </div>
    )
  }
}

export default InviteesList
