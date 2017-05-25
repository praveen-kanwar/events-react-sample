import React, {Component} from 'react'
import {Tabs, Tab} from '../node_modules/material-ui/Tabs'
import './App.css'
import { Link } from 'react-router'

const tabs = [
  {
    label: 'Upcoming Events',
    path: '/'
  },
  {
    label: 'Calendar View',
    path: '/eventCalendar'
  }
]

class Navigation extends Component {
  constructor (props) {
    super(props)
    if (this.props.location.pathname === '/') {
      this.state = {
        value: 0
      }
    } else {
      this.state = {
        value: 1
      }
    }
  }

  componentWillMount () {
    this.props.fetchEvents()
  }

  handleChange = (value) => {
    this.setState({value: value})
  };

  componentWillUpdate (nextProps, nextState) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      if (nextProps.location.pathname === '/') {
        this.setState({
          value: 0
        })
      } else {
        this.setState({
          value: 1
        })
      }
    }
  }

  render () {
    var content = (<div className='wrapper'>
      <Tabs value={this.state.value} onChange={this.handleChange}>
        {tabs.map(({ label, path }, index) => (
          <Tab
            key={index}
            value={index}
            label={label}
            style={{textTransform: 'none !important', fontFamily: 'PostGrotesk'}}
            containerElement={<Link to={path} />} >
            {this.props.children}
          </Tab>
        ))}
      </Tabs>
    </div>
    )
    return content
  }
}

export default Navigation
