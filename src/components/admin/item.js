import React, { Component } from 'react'
import {Dialog, CardActions, CardHeader, RaisedButton, FlatButton, IconButton, Divider} from 'material-ui/'
import './index.css'
import EditAction from 'material-ui/svg-icons/content/create'
import DeleteAction from 'material-ui/svg-icons/action/delete'
import AddDialog from './create'
import C from '../../utilities/constants'
import Colors from '../../utilities/colors'
import * as actions from '../../actions/events'
import store from '../../store'

class Item extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false,
      type: '',
      key: '0',
      color: '',
      label: '',
      showDelete: false
    }
  }

  editAction = () => {
    this.setState({
      key: this.props.item.key,
      type: this.props.type,
      isOpen: true,
      color: this.props.item.color,
      label: this.props.item.name
    })
  }

  handleClose = () => {
    this.setState({
      isOpen: false
    })
  }

  handleDeleteOpen = () => {
    this.setState({
      showDelete: true
    })
  }

  handleDeleteClose = () => {
    this.setState({
      showDelete: false
    })
  }

  handleDeleteConfirm = () => {
    let ref = C.FIREBASE.app().database().ref(this.props.type).child(this.props.item.uuid)
    ref.remove().then(() => {
      let typeLabel = 'Venue'
      if (this.props.type === 'categories') {
        typeLabel = 'Category'
      }
      store.dispatch(actions.setSnackbar({open: true, message: `${typeLabel} has been deleted.`}))
    })
  }

  render () {
    let typeLabel = 'Venue'
    if (this.props.type === 'categories') {
      typeLabel = 'Category'
    }
    const deleteActions = [
      <FlatButton
        label='Cancel'
        onTouchTap={this.handleDeleteClose}
      />,
      <RaisedButton
        label='Delete'
        backgroundColor={Colors.deleteColor}
        labelColor={Colors.white}
        onTouchTap={this.handleDeleteConfirm}
      />
    ]
    return (
      <div>
        <div className='item-wrapper'>
          {this.props.item.color ? <span className='color-left'>{<b style={{color: this.props.item.color, fontSize: 40}}>■</b>}</span> : null}
          <CardHeader className='item-left'
            title={this.props.item.name}
          />
          <CardActions className='item-right'>
            <IconButton>
              <EditAction
                onTouchTap={this.editAction}
                color={Colors.editColor}
                />
            </IconButton>
            <IconButton>
              <DeleteAction
                onTouchTap={this.handleDeleteOpen}
                color={Colors.deleteColor}
                />
            </IconButton>
          </CardActions>
          <AddDialog
            onRequestClose={this.handleClose}
            isOpen={this.state.isOpen}
            type={this.state.type}
            id={this.state.key}
            color={this.state.color}
            label={this.state.label}
            update
            uuid={this.props.item.uuid}
          />
          <Dialog
            title='Confirm delete'
            actions={deleteActions}
            modal={false}
            open={this.state.showDelete}
            onRequestClose={this.handleDeleteClose}
          >
            {`Are you sure you want to delete this ${typeLabel}?`}
            <br />
            {`P.S: Any event that references this ${typeLabel} will still show its label!`}
          </Dialog>
        </div>
        <Divider />
      </div>
    )
  }
}

export default Item
