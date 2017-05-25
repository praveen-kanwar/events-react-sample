import React, { Component } from 'react'
import {
  Dialog,
  DatePicker,
  TextField,
  TimePicker,
  FlatButton,
  Toggle,
  Checkbox
} from 'material-ui'
import C from '../../utilities/constants'
import TagChips from '../tag-chips/'
import ObjectSelector from '../object-selector/'
import moment from 'moment'
import * as actions from '../../actions/events'
import store from '../../store'
import EventHeader from './eventheader'
import ReoccurringOptions from './reoccurring-options'
import CircularProgress from 'material-ui/CircularProgress'
import EventSpeakerAvatar from './event-speaker-avatar'

const date = new Date()
const time = new Date()

const styles = {
  header: {
    top: 10,
    float: 'center',
    height: '230px',
    justifyContent: 'center',
    display: 'flex'
  },
  container: {
    width: '100%'
  },
  startTime: {
    width: '50%',
    display: 'inline-block',
    float: 'left'
  },
  endTime: {
    width: '50%',
    display: 'inline-block',
    float: 'left'
  },
  uploadButton: {
    verticalAlign: 'middle',
    color: '#fff'
  },
  uploadInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0
  }
}

const localStorage = window.localStorage
const mandatoryMessage = 'Mandatory field!'
let DatesOk = true

var uploadTask = null
var speakerImageUploadTask = null

let userDetail

class CreateEvent extends Component {
  constructor (props) {
    super(props)
    userDetail = JSON.parse(localStorage.getItem('userData'))
    let eventObj = props.eventObject
    if (!eventObj) {
      eventObj = {}
    }
    this.state = {
      loader: false,
      tagList: [],
      categoryList: [],
      isOpen: props.isOpen,
      edit: props.edit,
      eventObject: eventObj,
      snackOpen: false,
      hasSpeaker: false,
      eventImageFile: null,
      eventImageUrl: '',
      speakerImageFile: null,
      speakerImageUrl: userDetail.avatar,
      speakerName: userDetail.name,
      eventTitle: '',
      eventTitleError: '',
      eventDate: date,
      eventDateError: '',
      eventStartTime: time,
      eventStartTimeError: '',
      eventEndTime: moment(time).add(1, 'h').toDate(),
      eventEndTimeError: '',
      notes: '',
      description: '',
      descriptionError: '',
      chips: [],
      venueId: '',
      venue: '',
      venueError: '',
      categoryId: '',
      categoryColor: '',
      category: '',
      categoryError: '',
      isReoccuringOptionOpen: false,
      reoccuringOptions: null,
      isToggled: false,
      reoccuringId: '',
      isUpdateAllChecked: false
    }
  }

  handleClose = () => {
    this.clearState()
    this.props.onRequestClose()
  }

  componentWillReceiveProps (nextProps) {
    let eventObj = nextProps.eventObject
    if (eventObj) {
      let eventStart = new Date(nextProps.eventObject.start)
      let eventEnd = new Date(nextProps.eventObject.end)
      let tags = []
      if (nextProps.eventObject.tags) {
        tags = nextProps.eventObject.tags
      }
      this.setState({
        eventTitleError: '',
        venueError: '',
        categoryError: '',
        descriptionError: '',
        eventObject: nextProps.eventObject,
        eventKey: nextProps.eventKey,
        edit: nextProps.edit,
        isOpen: nextProps.isOpen,
        eventImageUrl: nextProps.eventObject.eventImage,
        hasSpeaker: nextProps.eventObject.hasSpeaker,
        speakerImageUrl: nextProps.eventObject.speaker.avatar,
        speakerName: nextProps.eventObject.speaker.name,
        eventTitle: nextProps.eventObject.title,
        eventDate: eventStart,
        eventStartTime: eventStart,
        eventEndTime: eventEnd,
        venueId: nextProps.eventObject.venue.key,
        venue: nextProps.eventObject.venue.name,
        categoryId: nextProps.eventObject.category.key,
        category: nextProps.eventObject.category.name,
        categoryColor: nextProps.eventObject.category.color,
        notes: nextProps.eventObject.notes,
        description: nextProps.eventObject.description,
        chips: tags,
        isReoccuringOptionOpen: false,
        reoccuringOptions: null,
        isToggled: nextProps.eventObject.isReoccuring,
        reoccuringId: nextProps.eventObject.reoccuringId
      })
    } else {
      this.setState({
        edit: nextProps.edit,
        isOpen: nextProps.isOpen,
        isReoccuringOptionOpen: false
      })
    }
  }

  handleReoccurringOptionToggle = () => {
    if (!this.state.isToggled) {
      this.setState({isReoccuringOptionOpen: true, isToggled: true})
    } else {
      this.setState({isToggled: false})
    }
  }

  handleReoccurringOptionClose = () => {
    this.setState({
      isReoccuringOptionOpen: false,
      isToggled: false
    })
  }

  handleUpdateAllCheck = () => {
    this.setState({
      isUpdateAllChecked: !this.state.isUpdateAllChecked
    })
  }

  saveReoccuringDetail = (reoccuringData) => {
    this.setState({
      reoccuringOptions: reoccuringData,
      isReoccuringOptionOpen: false
    })
  }

  eventImageChange = (imageFile, image) => {
    this.setState({
      eventImageFile: imageFile,
      eventImageUrl: image
    })
  }

  hasSpeaker = () => {
    if (this.state.hasSpeaker) {
      this.setState({hasSpeaker: false})
    } else {
      this.setState({
        hasSpeaker: true,
        speakerImageUrl: userDetail.avatar,
        speakerName: userDetail.name
      })
    }
  }

  speakerNameChanged = (speakerNameChange) => {
    this.setState({ speakerName: speakerNameChange })
  }

  speakerImageChanged = (imageFile, imageUrl) => {
    this.setState({
      speakerImageFile: imageFile,
      eventSpeakerImageUrl: imageUrl
    })
  }

  eventTitle = (event) => {
    if (event.target.value.length < C.titleMaxLength) {
      this.setState({ eventTitle: event.target.value })
    }
  }

  descriptionChange = (event) => {
    this.setState({ description: event.target.value })
  }

  notesChange = (event) => {
    if (event.target.value.length < C.notesMaxLength) {
      this.setState({ notes: event.target.value })
    }
  }

  dateChange = (event, date) => {
    let today = new Date()
    date.setHours(this.state.eventStartTime.getHours())
    date.setMinutes(this.state.eventStartTime.getMinutes())
    date.setSeconds(this.state.eventStartTime.getSeconds())
    date.setMilliseconds(this.state.eventStartTime.getMilliseconds())
    if (date < today) {
      DatesOk = false
      this.setState({
        eventDate: date,
        eventDateError: 'Time travel huh!',
        eventStartTimeError: 'Time travel huh!'
      })
    } else {
      DatesOk = true
      this.setState({
        eventDate: date,
        eventStartTimeError: '',
        eventDateError: ''
      })
    }
  }

  startTimeChange = (event, time) => {
    let chosenDate = new Date()
    time.setYear(this.state.eventDate.getFullYear())
    time.setMonth(this.state.eventDate.getMonth())
    time.setDate(this.state.eventDate.getDate())
    if (time >= chosenDate) {
      DatesOk = true
      let newTime = moment(time).add(1, 'h').toDate()
      this.setState({
        eventStartTime: time,
        eventEndTime: newTime,
        eventStartTimeError: '',
        eventDateError: ''
      })
    } else {
      DatesOk = false
      this.setState({
        eventStartTime: time,
        eventDateError: 'Time travel huh!',
        eventStartTimeError: 'Time travel huh!'
      })
    }
  }

  endTimeChange = (event, time) => {
    if (time > this.state.eventStartTime) {
      DatesOk = true
      this.setState({
        eventEndTime: time,
        eventEndTimeError: ''
      })
    } else {
      DatesOk = false
      this.setState({
        eventEndTimeError: 'Time going backward eh!'
      })
    }
  }

  venueChange = (event, venueKey, value, color) => {
    this.setState({
      venue: value,
      venueId: venueKey
    })
  }

  categoryChange = (event, categoryKey, value, color) => {
    this.setState({
      category: value,
      categoryId: categoryKey,
      categoryColor: color
    })
  }

  handleRequestAdd (chip) {
    this.setState({
      chips: [...this.state.chips, chip]
    })
  }

  handleRequestDelete (deletedChip) {
    this.setState({
      chips: this.state.chips.filter((c) => c !== deletedChip)
    })
  }

  clearState () {
    this.setState(
      {
        loader: false,
        isOpen: false,
        snackOpen: false,
        uploadEventText: 'UPLOAD EVENT IMAGE',
        eventImageFile: null,
        eventImageUrl: '',
        hasSpeaker: false,
        speakerImageFile: null,
        speakerImageUrl: userDetail.avatar,
        speakerName: userDetail.name,
        eventTitle: '',
        eventTitleError: '',
        eventDate: date,
        eventDateError: '',
        eventStartTime: time,
        eventStartTimeError: '',
        eventEndTime: moment(time).add(1, 'h').toDate(),
        eventEndTimeError: '',
        notes: '',
        description: '',
        descriptionError: '',
        chips: [],
        venueId: '',
        venue: '',
        venueError: '',
        categoryId: '',
        categoryColor: '',
        category: '',
        categoryError: '',
        reoccuringId: '',
        isReoccuringOptionOpen: false,
        reoccuringOptions: null,
        isToggled: false,
        isUpdateAllChecked: false
      })
  }

  checkFields () {
    let allFieldsOK = true
    if (this.state.eventTitle.trim().length < 1) {
      this.setState({
        eventTitleError: mandatoryMessage
      })
      allFieldsOK = false
    } else {
      this.setState({
        eventTitleError: ''
      })
    }
    if (this.state.venue.trim().length < 1) {
      this.setState({
        venueError: mandatoryMessage
      })
      allFieldsOK = false
    } else {
      this.setState({
        venueError: ''
      })
    }
    if (this.state.category.trim().length < 1) {
      this.setState({
        categoryError: mandatoryMessage
      })
      allFieldsOK = false
    } else {
      this.setState({
        categoryError: ''
      })
    }
    if (this.state.description.trim().length < 1) {
      this.setState({
        descriptionError: mandatoryMessage
      })
      allFieldsOK = false
    } else {
      this.setState({
        descriptionError: ''
      })
    }
    return allFieldsOK
  }

  createEvent = () => {
    if (this.checkFields() && DatesOk) {
      this.setState({
        loader: true
      })
      // If User Has Uploaded a image
      if (this.state.eventImageFile) {
        let fileName
        if (this.state.edit && this.state.eventObject !== '{}' && this.state.eventObject.eventImage) {
          fileName = this.state.eventObject.eventImageName
          uploadTask = C.FIREBASE.storage().ref().child('eventImages/' + this.state.eventObject.eventImageName).put(this.state.eventImageFile)
        } else {
          fileName = '' + userDetail.key + (new Date()).getTime() + '.jpg'
          uploadTask = C.FIREBASE.storage().ref().child('eventImages/' + fileName).put(this.state.eventImageFile)
        }
        uploadTask.on(C.FIREBASE.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
          // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        }, function (error) {
          // var error = error.code
          console.log(error.stack)
        }, function () {
          this.setState({
            eventImageUrl: uploadTask.snapshot.downloadURL
          })
          this.pushEventSpeakerImage(fileName)
        }.bind(this))
      } else {
        this.pushEventSpeakerImage('')
      }
    }
  }

  pushEventSpeakerImage = (eventFileName) => {
    if (this.state.hasSpeaker) {
      if (this.state.edit) {
        if (this.state.speakerImageFile) {
          let speakerFileName
          if (this.state.eventObject.speaker.fileName) {
            speakerFileName = this.state.eventObject.speaker.fileName
            speakerImageUploadTask = C.FIREBASE.storage().ref().child('eventImages/speakerImages/' + this.state.eventObject.speaker.fileName).put(this.state.speakerImageFile)
          } else {
            speakerFileName = '' + userDetail.key + (new Date()).getTime() + '.jpg'
            speakerImageUploadTask = C.FIREBASE.storage().ref().child('eventImages/speakerImages/' + speakerFileName).put(this.state.speakerImageFile)
          }
          speakerImageUploadTask.on(C.FIREBASE.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
              // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          }, (error) => {
              // var error = error.code
            console.log(error.stack)
          }, () => {
              // Image Updated successfully
            this.setState({
              speakerImageUrl: speakerImageUploadTask.snapshot.downloadURL
            })
            this.pushEventObjectToFirebase(eventFileName, speakerFileName)
          })
        } else {
          this.pushEventObjectToFirebase(eventFileName, '')
        }
      } else {
        if (this.state.speakerImageFile) {
          let speakerFileName = '' + userDetail.key + (new Date()).getTime() + '.jpg'
          speakerImageUploadTask = C.FIREBASE.storage().ref().child('eventImages/speakerImages/' + speakerFileName).put(this.state.speakerImageFile)
          speakerImageUploadTask.on(C.FIREBASE.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
            // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          }, (error) => {
            // var error = error.code
            console.log(error.stack)
          }, () => {
            this.setState({
              speakerImageUrl: speakerImageUploadTask.snapshot.downloadURL
            })
            this.pushEventObjectToFirebase(eventFileName, speakerFileName)
          })
        } else {
          this.pushEventObjectToFirebase(eventFileName, '')
        }
      }
    } else if (this.state.eventObject.hasSpeaker && this.state.eventObject.speaker.fileName) {
      let imagePath = 'eventImages/speakerImages/' + this.state.eventObject.speaker.fileName
      C.FIREBASE.storage().ref().child(imagePath).delete().then(() => {
        this.pushEventObjectToFirebase(eventFileName, '')
      }).catch(function (error) {
        console.log(JSON.stringify(error))
      })
    } else {
      this.pushEventObjectToFirebase(eventFileName, '')
    }
  }

  pushEventObjectToFirebase = (eventFileName, speakerFileName) => {
    const udUID = userDetail.key
    const udName = userDetail.name
    const avatar = userDetail.avatar

    let eventStartTime = new Date(this.state.eventDate)
    eventStartTime.setHours(this.state.eventStartTime.getHours())
    eventStartTime.setMinutes(this.state.eventStartTime.getMinutes())

    let eventEndTime = new Date(this.state.eventDate)
    eventEndTime.setHours(this.state.eventEndTime.getHours())
    eventEndTime.setMinutes(this.state.eventEndTime.getMinutes())

    let SpeakerObject = ''
    if (this.state.hasSpeaker) {
      SpeakerObject = {
        name: this.state.speakerName,
        fileName: speakerFileName,
        avatar: this.state.speakerImageUrl
      }
    }

    let eventObjectToBeSent = {
      created_by: {
        uid: udUID,
        name: udName
      },
      eventImageName: eventFileName,
      eventImage: this.state.eventImageUrl,
      avatar: avatar,
      hasSpeaker: this.state.hasSpeaker,
      speaker: SpeakerObject,
      title: this.state.eventTitle,
      description: this.state.description,
      notes: this.state.notes,
      start: (eventStartTime).getTime(),
      end: (eventEndTime).getTime(),
      venue: {
        key: this.state.venueId,
        name: this.state.venue
      },
      category: {
        key: this.state.categoryId,
        name: this.state.category,
        color: this.state.categoryColor
      },
      tags: this.state.chips,
      isReoccuring: this.state.isToggled,
      reoccuringOptions: this.state.reoccuringOptions,
      reoccuringId: this.state.reoccuringId
    }
    if (!this.state.edit) {
      let ref = C.FIREBASE.app().database().ref(`events`)
      var reoccurringEvents = []
      if (this.state.isToggled) {
        eventObjectToBeSent.reoccuringId = (new Date(eventObjectToBeSent.start)).getTime() + udUID
        let start = moment(eventObjectToBeSent.start)
        // So that even the last day selected is included
        let endDate = this.state.reoccuringOptions.endDate
        endDate.setHours(23)
        endDate.setMinutes(59)
        endDate.setSeconds(59)
        let end = moment(endDate)
        while (start.format('x') <= end.format('x')) {
          let tempEventObjectToBeSent = {
            created_by: {
              uid: udUID,
              name: udName
            },
            eventImageName: eventFileName,
            eventImage: this.state.eventImageUrl,
            avatar: avatar,
            hasSpeaker: this.state.hasSpeaker,
            speaker: SpeakerObject,
            title: this.state.eventTitle,
            description: this.state.description,
            notes: this.state.notes,
            start: (eventStartTime).getTime(),
            end: (eventEndTime).getTime(),
            venue: {
              key: this.state.venueId,
              name: this.state.venue
            },
            category: {
              key: this.state.categoryId,
              name: this.state.category,
              color: this.state.categoryColor
            },
            tags: this.state.chips,
            isReoccuring: this.state.isToggled,
            reoccuringId: (new Date(eventObjectToBeSent.start)).getTime() + udUID,
            reoccuringOptions: this.state.reoccuringOptions
          }
          let futureEndTime = new Date(tempEventObjectToBeSent.end)
          futureEndTime.setYear(new Date(start).getFullYear())
          futureEndTime.setMonth(new Date(start).getMonth())
          futureEndTime.setDate(new Date(start).getDate())
          tempEventObjectToBeSent.end = futureEndTime.getTime()
          if (this.state.reoccuringOptions.frequencyId === 'weeks') {
            let weekdays = this.state.reoccuringOptions.weekDays
            var weekCount = 0
            var dayChecked = 0
            var dayIdChecked = 0
            //eslint-disable-next-line
            weekdays.forEach((week) => {
              weekCount++
              if (week.isChecked || (weekCount === 7 && dayChecked === 0)) {
                dayChecked++
                dayIdChecked = week.isChecked ? week.id : moment(start).weekday()
                let tempTempEventObjectToBeSent = {
                  created_by: {
                    uid: udUID,
                    name: udName
                  },
                  eventImage: this.state.eventImageUrl,
                  avatar: avatar,
                  hasSpeaker: this.state.hasSpeaker,
                  speaker: SpeakerObject,
                  title: this.state.eventTitle,
                  description: this.state.description,
                  notes: this.state.notes,
                  start: (eventStartTime).getTime(),
                  end: (eventEndTime).getTime(),
                  venue: {
                    key: this.state.venueId,
                    name: this.state.venue
                  },
                  category: {
                    key: this.state.categoryId,
                    name: this.state.category,
                    color: this.state.categoryColor
                  },
                  tags: this.state.chips,
                  isReoccuring: this.state.isToggled,
                  reoccuringId: (new Date(eventObjectToBeSent.start)).getTime() + udUID,
                  reoccuringOptions: this.state.reoccuringOptions
                }
                start = start.startOf('week').add(dayIdChecked, 'days')
                let futureEndTime = new Date(tempTempEventObjectToBeSent.end)
                futureEndTime.setYear(new Date(start).getFullYear())
                futureEndTime.setMonth(new Date(start).getMonth())
                futureEndTime.setDate(new Date(start).getDate())
                tempTempEventObjectToBeSent.end = futureEndTime.getTime()
                let futureStartTime = new Date(start)
                futureStartTime.setHours(new Date(tempTempEventObjectToBeSent.start).getHours())
                futureStartTime.setMinutes(new Date(tempTempEventObjectToBeSent.start).getMinutes())
                futureStartTime.setSeconds(new Date(tempTempEventObjectToBeSent.start).getSeconds())
                start = moment(futureStartTime.getTime())
                if (start > moment()) {
                  if (start.format('x') <= end.format('x')) {
                    tempTempEventObjectToBeSent.start = (new Date(start)).getTime()
                    reoccurringEvents.push(tempTempEventObjectToBeSent)
                  }
                }
              }
            })
            start = start.add(this.state.reoccuringOptions.repeatInterval, this.state.reoccuringOptions.frequencyId)
          } else {
            tempEventObjectToBeSent.start = (new Date(start)).getTime()
            reoccurringEvents.push(tempEventObjectToBeSent)
            start = moment(start).add(this.state.reoccuringOptions.repeatInterval, this.state.reoccuringOptions.frequencyId)
          }
        }
      } else {
        reoccurringEvents.push(eventObjectToBeSent)
      }
      let eventsTobeAdded = reoccurringEvents.length
      let eventsAdded = 0
      reoccurringEvents.forEach((event) => {
        // todo - find a better way to upload all childs at once and get callback after all events are added
        ref.push(event).then((newRoast) => {
          eventsAdded++
          if (eventsAdded === eventsTobeAdded) {
            this.handleClose()
            store.dispatch(actions.setSnackbar({open: true, message: 'Event has been added.'}))
          }
        })
      })
    } else {
      if (this.state.isUpdateAllChecked) {
        let ref = C.FIREBASE.database().ref('events').orderByChild('reoccuringId').equalTo(this.props.eventObject.reoccuringId)
        ref.once('value', snapshot => {
          let obj = snapshot.val()
          if (obj) {
            let itemsToBeUpdated = Object.keys(obj).length
            var updatedItem = 0
            Object.keys(obj).map(function (key) {
              let eventDate = obj[key].start
              let startTime = new Date(eventDate)
              startTime.setHours(this.state.eventStartTime.getHours())
              startTime.setMinutes(this.state.eventStartTime.getMinutes())

              let endTime = new Date(eventDate)
              endTime.setHours(this.state.eventEndTime.getHours())
              endTime.setMinutes(this.state.eventEndTime.getMinutes())
              let tempTempEventObjectToBeSent = {
                created_by: {
                  uid: udUID,
                  name: udName
                },
                eventImage: this.state.eventImageUrl,
                avatar: avatar,
                hasSpeaker: this.state.hasSpeaker,
                speaker: SpeakerObject,
                title: this.state.eventTitle,
                description: this.state.description,
                notes: this.state.notes,
                start: startTime.getTime(),
                end: endTime.getTime(),
                venue: {
                  key: this.state.venueId,
                  name: this.state.venue
                },
                category: {
                  key: this.state.categoryId,
                  name: this.state.category,
                  color: this.state.categoryColor
                },
                tags: this.state.chips,
                isReoccuring: this.state.isToggled,
                reoccuringId: (new Date(eventObjectToBeSent.start)).getTime() + udUID,
                reoccuringOptions: this.state.reoccuringOptions
              }
              let eventRef = C.FIREBASE.app().database().ref(`events`).child(key)
              eventRef.set(tempTempEventObjectToBeSent).then((newRoast) => {
                updatedItem++
                if (itemsToBeUpdated === updatedItem) {
                  this.handleClose()
                  store.dispatch(actions.setSnackbar({open: true, message: 'Event has been edited.'}))
                }
              })
              return key
            }, this)
          }
        })
      } else {
        let ref = C.FIREBASE.app().database().ref(`events/` + this.props.eventKey)
        ref.set(eventObjectToBeSent).then((newRoast) => {
          this.handleClose()
          store.dispatch(actions.setSnackbar({open: true, message: 'Event has been edited.'}))
        })
      }
    }
  }

  getActionButton = (buttonTitle) => {
    let actionContent = ''
    if (this.state.loader) {
      actionContent = [
        <CircularProgress
          thickness={7}
        />
      ]
    } else {
      actionContent = [
        <FlatButton
          label='Cancel'
          primary={false}
          keyboardFocused={false}
          onTouchTap={this.handleClose}
        />,
        <FlatButton
          label={buttonTitle}
          primary
          keyboardFocused={false}
          onTouchTap={this.createEvent}
        />
      ]
    }
    return actionContent
  }

  render () {
    const { isOpen } = this.state
    let title = 'Create Event'
    let buttonTitle = 'Create'
    if (this.state.edit === true) {
      title = 'Edit Event'
      buttonTitle = 'Edit'
    }

    return (
      <div>
        <Dialog
          autoScrollBodyContent
          title={title}
          actions={this.getActionButton(buttonTitle)}
          modal={false}
          open={isOpen}
          onRequestClose={this.handleClose}>
          <EventHeader
            eventImageChange={this.eventImageChange}
            eventObject={this.state.eventObject} />
          <Checkbox
            style={{
              marginTop: 16
            }}
            checked={this.state.hasSpeaker}
            label='Has Speaker'
            onCheck={this.hasSpeaker}
          />
          {this.state.hasSpeaker &&
            <EventSpeakerAvatar
              speakerName={this.state.speakerName}
              speakerImageUrl={this.state.speakerImageUrl}
              speakerNameChangeFun={this.speakerNameChanged}
              speakerImageUrlChangeFun={this.speakerImageChanged}
              />
          }
          <TextField
            floatingLabelText='Event Name'
            fullWidth
            value={this.state.eventTitle}
            errorText={this.state.eventTitleError}
            onChange={this.eventTitle} />
          <DatePicker
            floatingLabelText='Event Date'
            hintText='Date Picker'
            fullWidth
            autoOk
            value={this.state.eventDate}
            errorText={this.state.eventDateError}
            onChange={this.dateChange} />
          <div style={styles.container}>
            <TimePicker
              style={styles.startTime}
              floatingLabelText='Event Start Time'
              hintText='Event Start Time'
              autoOk
              fullWidth={false}
              value={this.state.eventStartTime}
              errorText={this.state.eventStartTimeError}
              onChange={this.startTimeChange} />
            <TimePicker
              style={styles.endTime}
              floatingLabelText='Event End Time'
              hintText='Event End Time'
              autoOk
              fullWidth={false}
              value={this.state.eventEndTime}
              errorText={this.state.eventEndTimeError}
              onChange={this.endTimeChange} />
          </div>
          { !this.state.edit
            ? <div>
              <Toggle
                label='Repeat ..'
                labelPosition={'right'}
                defaultToggled={this.state.isToggled}
                onToggle={this.handleReoccurringOptionToggle}
                />
              <ReoccurringOptions
                minEndDate={this.state.eventDate}
                saveReoccuringDetail={this.saveReoccuringDetail}
                onRequestClose={this.handleReoccurringOptionClose}
                isOpen={this.state.isReoccuringOptionOpen} />
            </div>
            : this.state.isToggled ? <p> A reoccuring event </p> : null
          }
          <ObjectSelector
            floatingLabelText={'Venue'}
            objectType={'venues'}
            objectValue={this.state.venue}
            errorText={this.state.venueError}
            onChange={this.venueChange} />
          <ObjectSelector
            floatingLabelText={'Category'}
            objectType={'categories'}
            objectValue={this.state.category}
            errorText={this.state.categoryError}
            onChange={this.categoryChange} />
          <TextField
            floatingLabelText='Notes'
            fullWidth
            value={this.state.notes}
            onChange={this.notesChange} />
          <TextField
            floatingLabelText='Description'
            fullWidth
            value={this.state.description}
            errorText={this.state.descriptionError}
            onChange={this.descriptionChange} />
          <TagChips
            floatingLabelText='Tags'
            value={this.state.chips}
            dataSource={this.state.tagList}
            fullWidth
            onRequestAdd={(chip) => this.handleRequestAdd(chip)}
            onRequestDelete={(deletedChip) => this.handleRequestDelete(deletedChip)} />
          { this.state.isToggled && this.state.edit
              ? <Checkbox
                label='Update All occurances'
                style={styles.checkbox}
                onCheck={this.handleUpdateAllCheck}
              /> : null
          }
        </Dialog>

      </div>
    )
  }
}

CreateEvent.propTypes = {
  onRequestClose: React.PropTypes.func.isRequired,
  isOpen: React.PropTypes.bool.isRequired,
  edit: React.PropTypes.bool.isRequired
}

export default CreateEvent
