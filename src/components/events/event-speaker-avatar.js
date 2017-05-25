import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {
  Dialog,
  Avatar,
  TextField,
  FlatButton
} from 'material-ui'
import AvatarEditor from 'react-avatar-editor'

const styles = {
  container: {
    width: '100%',
    marginTop: 15
  },
  speakerAvatar: {
    display: 'inline-block',
    width: '10%',
    height: '100%'
  },
  speakerName: {
    display: 'inline-block',
    width: '90%',
    height: '100%'
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

class EventSpeakerAvatar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cropperOpen: false,
      editor: '',
      tempImageUrl: '',
      speakerName: this.props.speakerName,
      speakerImageUrl: this.props.speakerImageUrl,
      speakerImageFile: ''
    }
  }

  componentWillReceiveProps (nextProps, nextState) {
    this.setState({
      eventSpeakerName: nextProps.speakerName,
      eventSpeakerImageUrl: nextProps.speakerImageUrl
    })
  }

  eventSpeakerName = (event) => {
    this.setState({
      speakerName: event.target.value
    })
    this.props.speakerNameChangeFun(event.target.value)
  }

  speakerImageSelected = (e) => {
    e.preventDefault()
    let reader = new window.FileReader()
    let imageFile = e.target.files[0]
    reader.onloadend = () => {
      this.setState({
        tempImageUrl: reader.result,
        cropperOpen: true
      })
    }
    reader.readAsDataURL(imageFile)
  }

  setEditorRef = (editor) => {
    this.editor = editor
  }

  cropSpeakerImage = () => {
    let context = this
    const canvas = this.editor.getImage()
    canvas.toBlob(function (blob) {
      let reader = new window.FileReader()
      reader.onloadend = () => {
        context.setState({
          speakerImageUrl: reader.result
        })
        context.props.speakerImageUrlChangeFun(blob, reader.result)
        context.requestClose()
      }
      reader.readAsDataURL(blob)
    })
    // If you want the image resized to the canvas size (also a HTMLCanvasElement)
    // const canvasScaled = this.editor.getImageScaledToCanvas()
  }

  requestClose = () => {
    this.setState({
      cropperOpen: false
    })
    ReactDOM.findDOMNode(this.refs.imagePicker).value = ''
  }

  getActionButton = () => {
    let actionContent = ''
    actionContent = [
      <FlatButton
        label='Cancel'
        primary={false}
        keyboardFocused={false}
        onTouchTap={this.requestClose}
      />,
      <FlatButton
        label='Crop'
        primary={false}
        keyboardFocused={false}
        onTouchTap={this.cropSpeakerImage}
      />
    ]
    return actionContent
  }

  getImagePicker = () => {
    let imagePicker = (
      <input
        id='thefile'
        ref='imagePicker'
        type='file'
        accept='image/*'
        placeholder='Change Image'
        onChange={this.speakerImageSelected}
        style={styles.uploadInput} />
    )
    return imagePicker
  }

  getDisplayContent = () => {
    let content
    content = (
      <div>
        <div
          style={styles.container}>
          <div
            style={styles.speakerAvatar}>
            <Avatar
              src={this.state.speakerImageUrl}
              size={60} />
            {this.getImagePicker()}
            {this.state.cropperOpen &&
              <Dialog
                autoScrollBodyContent
                title={'Crop Image'}
                actions={this.getActionButton()}
                modal={false}
                open={this.state.cropperOpen}
                onRequestClose={this.requestClose}>
                <div
                  style={{
                    marginTop: 20,
                    justifyContent: 'center',
                    display: 'flex',
                    width: '100%',
                    height: '100%'
                  }}>
                  <AvatarEditor
                    ref={this.setEditorRef}
                    image={this.state.tempImageUrl}
                    width={200}
                    height={200}
                    border={50}
                    borderRadius={100}
                    scale={1}
                  />
                </div>
              </Dialog>
            }
          </div>
          <div
            style={styles.speakerName}>
            <TextField
              floatingLabelText='Speaker Name'
              defaultValue={this.state.speakerName}
              fullWidth
              onChange={this.eventSpeakerName} />
          </div>
        </div>
      </div>
    )
    return content
  }

  render () {
    return (
      this.getDisplayContent()
    )
  }
}

EventSpeakerAvatar.propTypes = {
  speakerName: React.PropTypes.string,
  speakerImageUrl: React.PropTypes.string,
  speakerNameChangeFun: React.PropTypes.func,
  speakerImageUrlChangeFun: React.PropTypes.func
}

export default EventSpeakerAvatar
