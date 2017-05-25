import React, { Component } from 'react'
import {
  Chip,
  CardHeader,
  CardMedia,
  FlatButton,
  Card
} from 'material-ui'
import moment from 'moment-timezone'
import TextView from '../text-view/'
import CopyToClipboard from 'react-copy-to-clipboard'
import './details.css'
import CopyIcon from 'material-ui/svg-icons/content/content-copy'
import InviteesList from '../users/invitee-list'
import ButtonsAction from '../actions/'
import * as GlobalFunctions from '../../utilities/functions'
import * as actions from '../../actions/events'
import store from '../../store'
import CustomPlaceholder from '../../components/global/custom-placeholder'
import C from '../../utilities/constants'
import EventHeader from './eventheader'
import CircularProgress from 'material-ui/CircularProgress'

const styles = {
  wrapper: {
    marginTop: '10px',
    marginBottom: '10px',
    display: 'flex',
    flexWrap: 'wrap'
  },
  header: {
    float: 'centre',
    height: '250px',
    display: 'flex'
  },
  centerDiv: {
    justifyContent: 'center',
    display: 'flex',
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  dialogTitle: {
    color: '#000',
    fontSize: '40px',
    marginTop: '40px',
    textAlign: 'center'
  },
  copyButton: {
    color: '#000',
    position: 'relative',
    display: 'flex',
    float: 'right'
  },
  chip: {
    margin: 4
  },
  descriptionText: {
    color: '#6A6A6A',
    fontSize: '24px',
    marginTop: '20px',
    marginLeft: '10px',
    marginBottom: '0px'
  },
  notesText: {
    color: '#6A6A6A',
    fontSize: '18px',
    marginLeft: '10px'
  },
  card: {
    marginTop: '20px'
  },
  detailContainer: {
    background: '#fff',
    margin: '30px',
    position: 'relative'
  },
  cardContainer: {
    width: '30.67%',
    display: 'inline-block',
    position: 'relative',
    margin: '2% 0% 0% 2%'
  }
}

class EventDetails extends Component {
  constructor (props) {
    super(props)

    this.state = {
      userId: window.localStorage.getItem('userData') ? (JSON.parse(window.localStorage.getItem('userData'))).key : '',
      snackOpen: false,
      userList: [],
      expanded: false,
      eventDetails: null,
      loading: false
    }

    this.componentDidMount = this.componentDidMount.bind(this)
  }

  componentDidMount () {
    if (this.props.eventDetails) {
      this.getEventData(this.props.eventDetails.currentEvent)
    }
  }

  componentWillReceiveProps (nextProps, nextState) {
    if (nextProps.eventDetails) {
      this.getEventData(nextProps.eventDetails.currentEvent)
    }
  }

  componentWillMount () {
    if (!this.props.eventDetails) {
      this.setState({
        loading: true
      })
      let context = this
      let eventId = this.props.params.id.substring(1)
      var eventRef = C.FIREBASE.database().ref('events').child(eventId)
      eventRef.on('value', function (snapshot) {
        var eventObject = snapshot.val()
        eventObject.id = eventId
        context.getEventData(eventObject)
        context.setState({
          loading: false
        })
      })
    }
  }

  getEventData (eventObject) {
    if (eventObject) {
      this.setState({
        eventDetails: eventObject
      })
      JSON.parse(JSON.stringify(eventObject))
      let obj = eventObject.users
      let users
      if (obj) {
        users = Object.keys(obj).map(function (key) {
          return {id: key, action: obj[key].response}
        })
        if (users) {
          GlobalFunctions.fetchUserList(this, users)
        }
      }
    }
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded})
  };

  renderChip (data) {
    return (
      <Chip style={styles.chip} key={data}>
        {data}
      </Chip>
    )
  }

  handleSnackBarOpen = () => {
    store.dispatch(actions.setSnackbar({open: true, message: 'Copied to Clipboard'}))
  }

  adjustHeaderStyle = (eventObject) => {
    let style = {}
    if (eventObject.eventImage) {
      style = Object.assign({}, {
        background: ' url(' + eventObject.eventImage + ') center center no-repeat',
        backgroundSize: 'cover',
        overflow: 'hidden'
      })
    } else {
      style = Object.assign({}, {
        backgroundColor: eventObject.category.color
      })
    }
    return style
  }

  getContent = () => {
    const eventObject = this.state.eventDetails
    const textToCopy = `Join us on *${eventObject.venue.name}* at *${moment(eventObject.start).format('hh:mm A')}* for \`${eventObject.title}\`
                        \n${eventObject.description}\nP.S: ${eventObject.notes}`
    let displayContent = null
    let attendeesCount = this.state.userList.filter(function (item) {
      return (item.action !== 'No')
    }).length
    displayContent = (
      <div className='details_wrapper'>
        <EventHeader
          detailEvent
          eventObject={eventObject} />
        <CopyToClipboard className='right-gravity' text={textToCopy} onCopy={this.handleSnackBarOpen}>
          <FlatButton
            label='Copy Details'
            icon={<CopyIcon />}
            style={styles.copyButton}
           />
        </CopyToClipboard>
        <div style={styles.detailContainer}>
          <p style={styles.dialogTitle}>{eventObject.title}</p>
          <TextView
            text={`${moment(eventObject.start).format('dddd, MMMM DD YYYY')} at
                 ${moment(eventObject.start).format('hh:mm A')}`}
            textSizeCss={'text-size15'}
            iconLeft={'https://firebasestorage.googleapis.com/v0/b/twg-events.appspot.com/o/1490300584_calendar.svg?alt=media&token=41c45e29-4f93-47b7-b38a-63291103a8ff'} />
          <br />
          <TextView
            text={eventObject.venue.name}
            textSizeCss={'text-size15'}
            iconLeft={'https://firebasestorage.googleapis.com/v0/b/twg-events.appspot.com/o/1490309236_Location_Icon.svg?alt=media&token=2cf6c0fb-5bab-4f7f-a814-479e0734c077'} />
          <br />
          <p style={styles.descriptionText}>
            {eventObject.description}
          </p>
          <br />
          {eventObject.notes
          ? <p style={styles.notesText}>
            P.S: {eventObject.notes}
          </p>
          : null
        }
          <div style={styles.wrapper}>
            {eventObject.tags && eventObject.tags.map(this.renderChip, this)}
          </div>
          <ButtonsAction
            eventId={eventObject.id}
            userList={eventObject.users}
            createdBy={eventObject.created_by.uid}
            eventObject={eventObject}
            userId={this.state.userId}
            deleteRedirectPath={eventObject.deleteRedirectPath}
          />
          <Card>
            <CardHeader
              title={`Attendees (${attendeesCount})`}
              actAsExpander
              showExpandableButton
           />
            <CardMedia expandable>
              <InviteesList
                userList={this.state.userList} />
            </CardMedia>
          </Card>
        </div>
      </div>
    )
    return displayContent
  }

  render () {
    let content = ''
    if (this.state.eventDetails !== null) {
      content = this.getContent()
    } else {
      content = <div>
        {this.state.loading ? <CircularProgress style={{marginLeft: '50%', marginTop: '5%'}} />
        : <CustomPlaceholder show message='Error fetching event details' />}
      </div>
    }
    return (
      <div
        style={{minHeight: '100vh', background: '#FFF'}}>
        {content}
      </div>
    )
  }
}

export default EventDetails
