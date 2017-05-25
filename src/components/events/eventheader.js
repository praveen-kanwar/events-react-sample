import React, { Component } from 'react'
import { CardHeader, CardMedia } from 'material-ui/Card'
import { FlatButton } from 'material-ui'
import ImageAddAPhoto from '../../../node_modules/material-ui/svg-icons/image/add-a-photo'
import {fullWhite} from 'material-ui/styles/colors'

const defaultImgUrl = 'https://firebasestorage.googleapis.com/v0/b/twg-events.appspot.com/o/13559029_1077288872336690_2392370488469708321_o.jpg?alt=media&token=d2ce6ee3-e83f-4cc1-9e65-083a4303dab9'

const styles = {
  header: {
    top: 10,
    height: '230px',
    justifyContent: 'center',
    marginLeft: 40,
    marginRight: 40,
    textAlign: 'center',
    display: 'flex'
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

class EventHeader extends Component {
  constructor (props) {
    super(props)
    let eventObj = this.props.eventObject
    let editEvnt = true
    let eventImageText = 'UPDATE IMAGE'
    let eventUrl = defaultImgUrl
    if (JSON.stringify(eventObj) === '{}') {
      editEvnt = false
      eventImageText = 'UPLOAD IMAGE'
    } else if (eventObj.eventImage) {
      eventUrl = eventObj.eventImage
    }
    this.state = {
      eventHeaderStyle: Object.assign({}, {
        top: 10,
        background: 'url(' + defaultImgUrl + ') center center no-repeat',
        backgroundImage: 'url(' + eventUrl + ')',
        backgroundSize: 'cover',
        overflow: 'hidden'
      }),
      detailEvent: this.props.detailEvent,
      eventObject: eventObj,
      createEvent: editEvnt,
      eventImageName: eventImageText
    }
  }

  componentWillReceiveProps (nextProps, nextState) {
    this.setState({
      detailEvent: nextProps.detailEvent,
      eventObject: nextProps.eventObject
    })
  }

  eventImageSelected = (e) => {
    e.preventDefault()
    let reader = new window.FileReader()
    let imageFile = e.target.files[0]
    let imageName = e.target.files[0].name
    this.setState({
      eventImageName: imageName
    })
    reader.onloadend = () => {
      this.setState({
        eventHeaderStyle: Object.assign({}, {
          top: 10,
          background: 'url(' + defaultImgUrl + ') center center no-repeat',
          backgroundImage: 'url(' + reader.result + ')',
          backgroundSize: 'cover',
          overflow: 'hidden'
        })
      })
      this.props.eventImageChange(imageFile, reader.result)
    }
    reader.readAsDataURL(imageFile)
  }

  adjustDetailHeaderStyle = (eventObject) => {
    let style = {}
    if (eventObject.eventImage) {
      style = Object.assign({}, {
        background: 'url(' + defaultImgUrl + ') center center no-repeat',
        backgroundImage: 'url(' + eventObject.eventImage + ')',
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

  getDisplayContent = () => {
    let content
    if (this.state.detailEvent) {
      content = (
        <CardMedia
          style={this.adjustDetailHeaderStyle(this.state.eventObject)}
          mediaStyle={Object.assign(styles.header, { height: '280px' })}
          overlay={
            <CardHeader
              title={this.getChiefGuestName(this.state.eventObject)}
              subtitle={this.state.eventObject.category.name}
              avatar={this.getAvatarUrl(this.state.eventObject)} />} />)
    } else {
      content = (
        <CardMedia
          style={this.state.eventHeaderStyle}
          mediaStyle={styles.header}
          overlay={<CardHeader
            title={
              <FlatButton
                icon={<ImageAddAPhoto color={fullWhite} />}
                label={this.state.eventImageName}
                color={fullWhite}
                labelPosition='after'
                style={styles.uploadButton}
                containerElement='label'>
                <input
                  id='thefile'
                  type='file'
                  accept='image/*'
                  style={styles.uploadInput}
                  onChange={this.eventImageSelected} />
              </FlatButton>}
      />} />
      )
    }

    return content
  }

  render () {
    return (
      this.getDisplayContent()
    )
  }
}

EventHeader.propTypes = {
  eventImageChange: React.PropTypes.func,
  eventObject: React.PropTypes.object.isRequired
}

export default EventHeader
