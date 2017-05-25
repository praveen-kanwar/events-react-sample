import React from 'react'
import Home from 'material-ui/svg-icons/action/home'
import Settings from 'material-ui/svg-icons/action/settings'
import ActionEvent from 'material-ui/svg-icons/action/event'
import ActionPowerSettingsNew from 'material-ui/svg-icons/action/power-settings-new'
import {
  Drawer,
  List,
  ListItem,
  Divider
} from 'material-ui'
import { Link } from 'react-router'
import * as GlobalFunctions from '../../utilities/functions'

let headerBackground = require('./images/twg-ed-banner.svg')
let twgEdLogo = require('../../../images/twg-ed-logo.svg')

const styles = {
  drawer: {
    textAlign: 'left'
  },
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  header: {
    position: 'absolute',
    width: '342px',
    height: '258px',
    backgroundColor: '#ffffff',
    backgroundImage: 'url(' + headerBackground + ')',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    overflow: 'hidden'
  },
  headerLogo: {
    position: 'absolute',
    width: '79px',
    height: '21px',
    top: '50%',
    left: '50%',
    marginLeft: '-39.5px',
    marginTop: '-10.5px'
  },
  userDetail: {
    backgroundColor: '#f7f7f7',
    position: 'absolute',
    width: '342px',
    height: '79px',
    top: '258px'
  },
  userAvatar: {
    position: 'absolute',
    width: '45.5px',
    height: '47px',
    borderRadius: '50%',
    top: '16px',
    left: '18px'
  },
  userName: {
    position: 'absolute',
    width: '258px',
    height: '24px',
    top: '20px',
    left: '80px',
    textAlign: 'left',
    fontFamily: 'Copernicus',
    fontSize: '14px',
    fontWeight: '500',
    fontStyle: 'italic',
    lineHeight: '1.71',
    color: '#6c717a'
  },
  userEmail: {
    position: 'absolute',
    width: '258px',
    height: '22px',
    top: '40px',
    left: '80px',
    textAlign: 'left',
    fontFamily: 'PostGrotesk-Book',
    fontSize: '14px',
    lineHeight: '1.57',
    color: '#6c717a'
  },
  listContainer: {
    paddingTop: '20.65px',
    position: 'absolute',
    width: '342px',
    height: 'auto',
    top: '330px'
  },
  list: {
    position: 'absolute',
    width: '342px'
  },
  link: {
    textDecoration: 'none'
  },
  listItem: {
    paddingLeft: '20.65px',
    fontFamily: 'PostGrotesk',
    fontSize: '15px',
    fontWeight: 500,
    letterSpacing: '0.2px',
    color: '#4d4d4e'
  },
  divider: {
    marginTop: '25px',
    marginBottom: '32px',
    marginLeft: '28px',
    marginRight: '28px',
    color: '#d8d8d8'
  }
}

let actionButtonColor = '#d8d8d8'

const localStorage = window.localStorage

class SideMenuDrawer extends React.Component {
  constructor (props) {
    super(props)
    let userDetail = JSON.parse(localStorage.getItem('userData'))
    this.state = {
      open: false,
      userObj: userDetail,
      userName: `${userDetail.name}`,
      userEmail: `${userDetail.email}`,
      userPic: `${userDetail.avatar}`,
      isAdmin: false
    }
  }

  componentDidMount () {
    GlobalFunctions.isAdmin(this, JSON.parse(localStorage.getItem('userData')).key)
  }

  render () {
    return (
      <Drawer
        width={342}
        docked={false}
        style={styles.drawer}
        open={this.props.open}
        onRequestChange={this.props.onRequestChangeNavDrawer}>
        <div style={styles.container}>
          <div style={styles.header}>
            <img
              style={styles.headerLogo}
              src={twgEdLogo}
              alt='TWG Logo' />
          </div>
          <div style={styles.userDetail}>
            <img
              style={styles.userAvatar}
              src={this.state.userPic}
              alt='User Pic' />
            <div style={styles.userName}>
              {this.state.userName}
            </div>
            <div style={styles.userEmail}>
              {this.state.userEmail}
            </div>
          </div>
          <div style={styles.listContainer}>
            <List style={styles.list}>
              <Link
                to='/'
                style={styles.link}>
                <ListItem
                  style={styles.listItem}
                  primaryText='Home'
                  leftIcon={<Home color={actionButtonColor} />}
                  onTouchTap={this.props.onRequestChangeNavDrawer.bind(this, false)}
                />
              </Link>
              <Link
                to='myEvents'
                style={styles.link}>
                <ListItem
                  style={styles.listItem}
                  primaryText='My Events'
                  leftIcon={<ActionEvent color={actionButtonColor} />}
                  onTouchTap={this.props.onRequestChangeNavDrawer.bind(this, false)}
                />
              </Link>
              {this.state.isAdmin &&
                <Link
                  to='admin'
                  style={styles.link}>
                  <ListItem
                    style={styles.listItem}
                    primaryText='Administrator'
                    leftIcon={<Settings color={actionButtonColor} />}
                    onTouchTap={this.props.onRequestChangeNavDrawer.bind(this, false)}
                  />
                </Link>
              }
              <Divider style={styles.divider} />
              <ListItem
                style={styles.listItem}
                primaryText='Logout'
                leftIcon={<ActionPowerSettingsNew color={actionButtonColor} />}
                onTouchTap={this.props.logoutHandler}
              />
            </List>
          </div>
        </div>
      </Drawer>
    )
  }
}

export default SideMenuDrawer
