import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton'
import Paper from 'material-ui/Paper'
import MuiThemeProvider from '../node_modules/material-ui/styles/MuiThemeProvider'
import './index.css'

let imgUrl = require('../images/login-heading.svg')
let twgEdLogo = require('../images/twg-ed-logo.svg')

const styles = {
  container: {
    position: 'absolute',
    backgroundColor: '#F8F8F8',
    width: '100%',
    height: '100%',
    minHeight: '859.4px'
  },
  upperBackground: {
    position: 'absolute',
    backgroundColor: '#58b26b',
    backgroundImage: 'url(' + imgUrl + ')',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    overflow: 'hidden',
    width: '100%',
    height: '473px'
  },
  paper: {
    width: '390.4px',
    height: '498px'
  },
  loginCard: {
    position: 'absolute',
    width: '390.4px',
    height: '498px',
    top: '273px',
    left: '50%',
    marginLeft: '-195.2px'
  },
  loginCardUpper: {
    position: 'absolute',
    backgroundColor: '#58b26b',
    width: '390.4px',
    height: '200px'
  },
  loginCardUpperOverlay: {
    backgroundColor: '#449450',
    position: 'absolute',
    width: '391px',
    height: '7px'
  },
  loginCardUpperTWGLogo: {
    position: 'absolute',
    width: '79px',
    height: '21px',
    top: '50%',
    left: '50%',
    marginLeft: '-39.5px',
    marginTop: '-10.5px'
  },
  loginCardLower: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    width: '390.4px',
    height: '298px',
    top: '200px'
  },
  twgWelcomeLabel: {
    position: 'absolute',
    width: '312.4px',
    height: '34px',
    top: '51.5px',
    left: '50%',
    marginLeft: '-156.2px',
    fontFamily: 'PostGrotesk',
    fontSize: '27px',
    fontWeight: '500',
    lineHeight: '1.26',
    textAlign: 'center',
    color: '#37393e'
  },
  twgDescriptionLabel: {
    position: 'absolute',
    width: '247.9px',
    height: '22px',
    top: '96px',
    left: '50%',
    marginLeft: '-123.95px',
    fontFamily: 'PostGrotesk',
    fontSize: '16px',
    textAlign: 'center',
    color: '#6c717a'
  },
  border: {
    backgroundColor: '#d8d8d8',
    position: 'absolute',
    width: '316.3px',
    height: '1px',
    top: '163px',
    left: '50%',
    marginLeft: '-158.15px'
  },
  loginButton: {
    position: 'absolute',
    width: '312.2px',
    height: '50px',
    top: '205px',
    left: '50%',
    marginLeft: '-156.1px',
    borderRadius: '3px'
  },
  loginLabel: {
    fontFamily: 'PostGrotesk',
    fontStyle: 'normal',
    fontSize: '14px',
    letterSpacing: '1.5px',
    textAlign: 'center',
    color: '#ffffff'
  }
}

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoggedIn: false
    }
  }

  render () {
    return (
      <div style={styles.container}>
        <div style={styles.upperBackground} />
        <div style={styles.loginCard}>
          <MuiThemeProvider>
            <Paper style={styles.paper} zDepth={4} >
              <div style={styles.loginCardUpper}>
                <div style={styles.loginCardUpperOverlay} />
                <img
                  style={styles.loginCardUpperTWGLogo}
                  src={twgEdLogo}
                  alt='TWG Logo' />
              </div>
              <div style={styles.loginCardLower}>
                <div style={styles.twgWelcomeLabel}>
                  Welcome to TWG Ed
                </div>
                <div style={styles.twgDescriptionLabel}>
                  A real-time events platform
                </div>
                <div style={styles.border} />
                <FlatButton
                  style={styles.loginButton}
                  labelStyle={styles.loginLabel}
                  label='LOG IN WITH GOOGLE'
                  backgroundColor='#58b26b'
                  hoverColor='#51D84A'
                  onTouchTap={this.props.loginHandler} />
              </div>
            </Paper>
          </MuiThemeProvider>
        </div>
      </div>
    )
  }
}

export default Login
