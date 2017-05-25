import React, { Component } from 'react'
import Snackbar from 'material-ui/Snackbar'
import * as actions from '../../actions/events'
import store from '../../store'

class CustomSnackbar extends Component {
  constructor (props) {
    super(props)
    this.state = { open: false,
      message: '' }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data) {
      this.setState({
        open: nextProps.data.open,
        message: nextProps.data.message})
    } else {
      this.setState({
        open: false,
        message: ''})
    }
  }

  closeSnackbar = () => {
    this.setState({ open: false })
    store.dispatch(actions.setSnackbar({open: false, message: ''}))
  }

  render () {
    return (
      <Snackbar
        open={this.state.open}
        message={this.state.message}
        autoHideDuration={4000}
        onRequestClose={this.closeSnackbar}
      />
    )
  }
}

export default CustomSnackbar
