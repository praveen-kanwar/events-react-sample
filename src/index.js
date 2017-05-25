import React from 'react'
import ReactDOM from 'react-dom'
import App from './container/app'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import Navigation from './container/events'
import EventDetails from './container/event-details'
import MyEventsNavigation from './container/my-events-navigation'
import MyEvents from './container/my-events'
import MyAttendance from './container/my-attendance'
import Admin from './components/admin/'
import { Provider } from 'react-redux'
import Store from './store'
import EventList from './container/event-list'
import EventCalendar from './container/event-calendar'

injectTapEventPlugin()

ReactDOM.render(
  <Provider store={Store}>
    <Router history={hashHistory} >
      <Route path='/' component={App} >
        <Route component={Navigation} >
          <IndexRoute component={EventList} />
          <Route path='eventCalendar' component={EventCalendar} />
        </Route>
        <Route path='myEvents' component={MyEventsNavigation} >
          <IndexRoute component={MyEvents} />
          <Route path='myAttendance' component={MyAttendance} />
        </Route>
        <Route path='admin' component={Admin} />
        <Route path='event(:id)' component={EventDetails} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
