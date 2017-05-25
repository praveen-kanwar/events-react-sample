import React, { Component } from 'react'
import {
  Avatar
} from 'material-ui'
import './list.css'
import ButtonsAction from '../actions/'
import { hashHistory } from 'react-router'
import moment from 'moment-timezone'
import CircularProgress from 'material-ui/CircularProgress'
import CustomPlaceholder from '../../components/global/custom-placeholder'
import EventDetailTupple from './event-detail-tupple'

var listOfEvents = []

const styles = {
  header: {
    float: 'centre',
    height: '250px',
    display: 'flex',
    cursor: 'pointer',
    textAlign: 'center'
  },
  cardContainer: {
    width: '30.67%',
    display: 'inline-block',
    position: 'relative',
    margin: '2% 0% 0% 2%'
  },
  eventCard: {
    opacity: '1',
    display: 'block',
    width: '100%',
    height: '100%'
  },
  dummyDiv: {
    cursor: 'pointer',
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    height: 470,
    width: '100%',
    opacity: '0'
  }
}

class EventList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hover: false,
      hoverPosition: 0,
      userList: [],
      userId: window.localStorage.getItem('userData') ? (JSON.parse(window.localStorage.getItem('userData'))).key : ''
    }
  }

  onItemClicked = (eventObj, deleteRedirectPath) => {
    const {setEvent} = this.props
    eventObj.deleteRedirectPath = deleteRedirectPath
    setEvent(eventObj)
    var path = `/event:${eventObj.id}`
    hashHistory.push(path)
  }

  onMouseEnterHandler = (target) => {
    this.setState({
      hoverPosition: target,
      hover: true
    })
  }
  onMouseLeaveHandler = (target) => {
    this.setState({
      hoverPosition: target,
      hover: false
    })
  }

  getAvatarUrl = (eventObj) => {
    let avatarUrl
    if (eventObj.hasSpeaker) {
      avatarUrl = eventObj.speaker.avatar
    } else {
      avatarUrl = eventObj.avatar
    }
    return avatarUrl
  }

  getChiefGuestName = (eventObj) => {
    let chiefGuestName
    if (eventObj.hasSpeaker) {
      chiefGuestName = eventObj.speaker.name
    } else {
      chiefGuestName = eventObj.created_by.name
    }
    return chiefGuestName
  }

  render () {
    const {data} = this.props
    listOfEvents = this.props.listOfEvents || data.upcomingEvents || data.events
    var showEmptyState = this.props.showEmptyState || data.showPlaceHolder
    var emptyStateMessage = this.props.emptyStateMessage || data.placeholderMessage
    var deleteRedirectPath = this.props.deleteRedirectPath || data.deleteRedirectPath
    return (
      <div className='events-wrapper'>
        {listOfEvents.map((eventObj, i) => {
          let eventCardStyle
          let hoverState = false
          if (this.state.hover && (this.state.hoverPosition === i)) {
            eventCardStyle = Object.assign({}, styles.eventCard, { opacity: '0.3' })
            hoverState = true
          } else {
            eventCardStyle = Object.assign({}, styles.eventCard, { opacity: '1' })
            hoverState = false
          }
          return (
            <div
              key={i}
              style={styles.cardContainer}>
              <div
                style={eventCardStyle}>
                <Avatar className='Avatar' size={80} src={this.getAvatarUrl(eventObj)} />
                <div
                  className='BG'>
                  <div
                    style={{
                      width: '100%'
                    }}
                    className='Rectangle-overlay' />
                  <div
                    style={{backgroundColor: `${eventObj.category.color}`}}
                    className='Rectangle'>
                    <div
                      style={{color: '#FFF'}}
                      className='Category'>
                      {eventObj.category.name}
                    </div>
                  </div>
                  <div
                    className='Rectangle-information'>
                    <div className='Creator-name'>
                      {this.getChiefGuestName(eventObj)}
                    </div>
                    <div className='Date'>
                      {`${moment(eventObj.start).format('dddd, MMMM DD')} at
                      ${moment(eventObj.start).format('hh:mm a')}`}
                    </div>
                    <div className='Venue'>
                      {`${eventObj.venue.name} • ${eventObj.notes}`}
                    </div>
                    <div className='Title'>
                      {eventObj.title}
                    </div>

                  </div>
                  <div className='Actions-container'>
                    <ButtonsAction
                      className='Actions'
                      eventId={eventObj.id}
                      createdBy={eventObj.created_by.uid}
                      eventObject={eventObj}
                      userId={this.state.userId}
                      deleteRedirectPath={deleteRedirectPath}
                    />
                  </div>
                </div>
              </div>
              <EventDetailTupple hoverState={hoverState} eventObject={eventObj} />
              <div
                style={styles.dummyDiv}
                onClick={this.onItemClicked.bind(this, eventObj, deleteRedirectPath)}
                onMouseEnter={this.onMouseEnterHandler.bind(this, i)}
                onMouseLeave={this.onMouseLeaveHandler.bind(this, i)} />
            </div>
          )
        }
        )}
        {
          (this.props.listOfEvents && this.props.listOfEvents.length > 0) ? null : (data.loading ? <CircularProgress style={{marginLeft: '50%', marginTop: '5%'}} /> : null)
        }
        <CustomPlaceholder show={showEmptyState} message={emptyStateMessage} />
      </div>
    )
  }
}

export default EventList
