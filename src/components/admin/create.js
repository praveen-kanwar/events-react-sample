import React, { Component } from 'react'
import {
  Dialog,
  TextField,
  FlatButton
} from 'material-ui'
import C from '../../utilities/constants'
import { SketchPicker } from 'react-color'
import './create.css'
import * as GlobalFunctions from '../../utilities/functions'
import * as actions from '../../actions/events'
import store from '../../store'

const mandatoryMessage = 'Mandatory field!'

class AddDialog extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false,
      label: '',
      labelError: '',
      color: '#333333',
      textColor: '#FFFFFF'
    }
  }

  handleClose = () => {
    this.clearState()
    this.props.onRequestClose()
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      isOpen: nextProps.isOpen,
      label: nextProps.label || '',
      color: nextProps.color || '#333333',
      textColor: GlobalFunctions.getTextColor(nextProps.color || '#333333')
    })
  }

  labelChange = (label) => {
    if (label.target.value.length < C.configMaxLength) {
      this.setState({ label: label.target.value })
    }
  }

  clearState () {
    this.setState(
      {
        isOpen: false,
        label: '',
        labelError: '',
        color: '#333333',
        textColor: '#FFFFFF'
      })
  }

  checkFields () {
    let allFieldsOK = true
    if (this.state.label.trim().length < 1) {
      this.setState({
        labelError: mandatoryMessage
      })
      allFieldsOK = false
    } else {
      this.setState({
        labelError: ''
      })
    }
    return allFieldsOK
  }

  create = () => {
    const {
      id,
      uuid,
      type,
      update
    } = this.props
    const {
      label,
      color
    } = this.state
    if (this.checkFields()) {
      let typeLabel = 'Venue'
      if (type === 'categories') {
        typeLabel = 'Category'
      }
      if (!update) {
        let ref = C.FIREBASE.app().database().ref(type)
        ref.push({
          key: id,
          name: label,
          color: type === 'categories' ? color : null
        }).then((newRoast) => {
          this.clearState()
          this.props.onRequestClose()
          store.dispatch(actions.setSnackbar({open: true, message: `${typeLabel} has been created.`}))
        })
      } else {
        let ref = C.FIREBASE.app().database().ref(type).child(uuid)
        ref.set({
          key: id,
          name: label,
          color: type === 'categories' ? color : null
        }).then((newRoast) => {
          let ref = C.FIREBASE.database().ref('events').orderByChild('venue/key').equalTo(id)
          if (type === 'categories') {
            ref = C.FIREBASE.database().ref('events').orderByChild('category/key').equalTo(id)
          }
          ref.once('value', function (snapshot) {
            snapshot.forEach(function (obj) {
              let updateRef = C.FIREBASE.database().ref('events').child(obj.getKey())
              if (type === 'categories') {
                updateRef.update({
                  category: {
                    key: id,
                    name: label,
                    color: color
                  }
                })
              } else if (type === 'venues') {
                updateRef.update({
                  venue: {
                    key: id,
                    name: label
                  }
                })
              }
            })
          }).then((newRoast) => {
            this.clearState()
            this.props.onRequestClose()
            store.dispatch(actions.setSnackbar({open: true, message: `${typeLabel} has been updated.`}))
          })
        })
      }
    }
  }

  handleChangeComplete = (color) => {
    this.setState({
      color: color.hex,
      textColor: GlobalFunctions.getTextColor(color.hex)
    })
  }

  render () {
    const { isOpen } = this.state

    let actionLabel = 'Create'
    if (this.props.update) {
      actionLabel = 'Update'
    }
    const actions = [
      <FlatButton
        label='Cancel'
        primary={false}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label={`${actionLabel}`}
        primary
        onTouchTap={this.create}
      />
    ]
    let typeLabel = 'Venue'
    let showColorPicker = false
    if (this.props.type === 'categories') {
      typeLabel = 'Category'
      showColorPicker = true
    }
    return (
      <div>
        <Dialog
          autoScrollBodyContent
          title={`${actionLabel} a ${typeLabel}`}
          actions={actions}
          modal={false}
          open={isOpen}
          onRequestClose={this.handleClose}>
          <TextField
            floatingLabelText='Label'
            fullWidth
            value={this.state.label}
            errorText={this.state.labelError}
            onChange={this.labelChange} />
          {showColorPicker &&
            <div className='dialog-wrapper'>
              <SketchPicker className='dialog-item-left'
                color={this.state.color}
                onChangeComplete={this.handleChangeComplete}
              />
              <span className='dialog-item-right'>
                <div className='rcorners1'
                  style={{
                    background: this.state.color,
                    color: this.state.textColor
                  }}
                >
                  Event Label
                </div>
              </span>
            </div>
          }
        </Dialog>
      </div>
    )
  }
}

AddDialog.propTypes = {
  onRequestClose: React.PropTypes.func.isRequired,
  isOpen: React.PropTypes.bool.isRequired,
  update: React.PropTypes.bool.isRequired,
  type: React.PropTypes.string.isRequired,
  id: React.PropTypes.string.isRequired,
  color: React.PropTypes.string,
  label: React.PropTypes.string,
  uuid: React.PropTypes.string
}

export default AddDialog
