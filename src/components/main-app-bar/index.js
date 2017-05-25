import React, { Component } from 'react'
import AddCircle from '../../../node_modules/material-ui/svg-icons/content/add-circle'
import {
  AppBar,
  FlatButton
} from 'material-ui'
import CreateEvent from '../events/create'
import SideMenuDrawer from '../side-menu-drawer/'
import './index.css'

class MainAppBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false,
      navDrawerOpen: false
    }
  }

  handleTouchTapLeftIconButton = () => {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen
    })
  }

  handleChangeRequestNavDrawer = (open) => {
    this.setState({
      navDrawerOpen: open
    })
  }

  handleOpen = () => {
    this.setState({isOpen: true})
  }

  handleClose = () => {
    this.setState({
      isOpen: false
    })
  }

  render () {
    return (
      <div>
        <AppBar
          onLeftIconButtonTouchTap={this.handleTouchTapLeftIconButton}
          zDepth={1}
          title={<a href={'/'}><img src={require('../../../images/twg-ed-logo.svg')}
            alt={'Logo'}
            className='twg-ed-logo' /></a>}
          showMenuIconButton
          iconElementRight={
            <FlatButton
              className='CREATE-EVENT'
              label='Create Event'
              onTouchTap={this.handleOpen}
              icon={<AddCircle />} />
        } />
        <SideMenuDrawer
          logoutHandler={this.props.logoutHandler}
          open={this.state.navDrawerOpen}
          onRequestChangeNavDrawer={this.handleChangeRequestNavDrawer} />
        <CreateEvent
          onRequestClose={this.handleClose}
          isOpen={this.state.isOpen}
          edit={false}
        />
      </div>
    )
  }
}

export default MainAppBar
