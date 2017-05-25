import React, { Component } from 'react'
import { Avatar } from 'material-ui'
import Truncate from 'react-truncate'

const styles = {
  eventDetail: {
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    height: '100%',
    width: '100%',
    opacity: '0',
    transition: '.5s ease'
  },
  detailHeader: {
    color: 'white',
    fontFamily: 'PostGrotesk',
    fontSize: '20px',
    position: 'absolute',
    top: 44,
    bottom: '0',
    left: 40,
    right: '0',
    height: 22,
    width: 'auto'
  },
  avatarOne: {
    position: 'absolute',
    top: 94,
    left: 41,
    height: '50px',
    width: '50px'
  },
  avatarTwo: {
    position: 'absolute',
    top: 94,
    left: 79.6,
    height: '50px',
    width: '50px'
  },
  avatarThree: {
    position: 'absolute',
    top: 94,
    left: 120.7,
    height: '50px',
    width: '50px'
  },
  avatarFour: {
    position: 'absolute',
    top: 94,
    left: 159.9,
    height: '50px',
    width: '50px'
  },
  avatarFive: {
    position: 'absolute',
    top: 94,
    left: 201.7,
    height: '50px',
    width: '50px'
  },
  avatarPlus: {
    position: 'absolute',
    top: 94,
    left: 242,
    height: '50px',
    width: '50px'
  },
  aboutHeader: {
    color: 'white',
    fontFamily: 'PostGrotesk',
    fontSize: '20px',
    position: 'absolute',
    top: 205,
    bottom: '0',
    left: 40,
    right: 40,
    height: 22
  },
  aboutDetail: {
    color: 'white',
    fontSize: '16px',
    fontFamily: 'Copernicus book',
    position: 'absolute',
    top: 252,
    bottom: '0',
    left: 40,
    right: 40,
    height: 100
  },
  taggedHeader: {
    color: 'white',
    fontSize: '20px',
    fontFamily: 'PostGrotesk',
    position: 'absolute',
    top: 400,
    bottom: '0',
    left: 40,
    right: 40,
    height: 22
  },
  taggedDetail: {
    color: 'white',
    fontSize: '16px',
    fontFamily: 'Copernicus book',
    position: 'absolute',
    top: 447,
    bottom: '0',
    left: 40,
    right: 40,
    height: 24
  }
}

class EventDetailTupple extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hover: props.hoverState,
      eventObject: props.eventObject
    }
  }

  componentWillReceiveProps (nextProps, nextState) {
    this.setState({
      hover: nextProps.hoverState,
      eventObject: nextProps.eventObject
    })
  }

  getAvatarDivStyle = (position) => {
    let style
    if (position === 1) {
      style = styles.avatarOne
    } else if (position === 2) {
      style = styles.avatarTwo
    } else if (position === 3) {
      style = styles.avatarThree
    } else if (position === 4) {
      style = styles.avatarFour
    } else if (position === 5) {
      style = styles.avatarFive
    } else if (position === 6) {
      style = styles.avatarPlus
    }
    return style
  }

  getAttendeesAvatarPile = (userAttendingEvent, attendeesCount) => {
    let sliceAt = attendeesCount
    if (attendeesCount > 5) {
      sliceAt = 6
    }
    let attendeesAvatarPile = userAttendingEvent.slice(0, sliceAt)
    attendeesAvatarPile.reverse()
    let returnContent = (
      <div>
        {attendeesAvatarPile.map((eventObj, i) => {
          let content
          if (sliceAt === 6 && i === 0) {
            content = (
              <div
                style={this.getAvatarDivStyle((sliceAt - i))}
                key={i}>
                <Avatar
                  style={{fontSize: '18px'}}
                  color={'#8B92A2'}
                  backgroundColor={'#D6E3F4'}
                  size={50}>
                  <b>{'+' + (attendeesCount - 5)}</b>
                </Avatar>
              </div>)
          } else {
            content = (
              <div
                style={this.getAvatarDivStyle((sliceAt - i))}
                key={i}>
                <Avatar style={{border: 'solid 2px #FFF'}} size={50} src={eventObj.avatar} />
              </div>)
          }
          return content
        })}
      </div>
    )
    return returnContent
  }

  render () {
    let eventDetailStyle
    if (this.state.hover) {
      eventDetailStyle = Object.assign({}, styles.eventDetail, { opacity: '0.9', backgroundColor: this.state.eventObject.category.color })
    } else {
      eventDetailStyle = Object.assign({}, styles.eventDetail, { opacity: '0' })
    }
    let attendeesCount = 0
    let userAttendingEvent = []
    let avatarPile = ''
    if (this.state.eventObject.users) {
      for (var key in this.state.eventObject.users) {
        var value = this.state.eventObject.users[key].response
        if (value === 'Yes') {
          userAttendingEvent.push(this.state.eventObject.users[key])
        }
      }
      attendeesCount = userAttendingEvent.length
      avatarPile = this.getAttendeesAvatarPile(userAttendingEvent, attendeesCount)
    }
    return (
      <div
        style={eventDetailStyle}>
        <div
          style={styles.detailHeader}>
          {attendeesCount > 0 ? `${attendeesCount} people attending` : 'No attendees yet'}
        </div>
        {avatarPile}
        <div
          style={styles.aboutHeader}>
          <b>About this session</b>
        </div>
        <div
          style={styles.aboutDetail}>
          <Truncate lines={5} ellipsis={<span>... <a href='#' /></span>}>
            {this.state.eventObject.description}
          </Truncate>
        </div>
        <div
          style={styles.taggedHeader}>
          <b>Tagged with</b>
        </div>
        <div
          style={styles.taggedDetail}>
          <Truncate lines={2} ellipsis={<span>... <a href='#' /></span>}>
            {this.state.eventObject.tags ? this.state.eventObject.tags.join(', ') : ''}
          </Truncate>
        </div>
      </div>
    )
  }
}

export default EventDetailTupple
