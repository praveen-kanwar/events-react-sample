import { createStore, applyMiddleware, combineReducers } from 'redux'
import promise from 'redux-promise-middleware'
import eventsReducer from './reducers/events'
import myEventsReducer from './reducers/my-events'
import eventDetails from './reducers/event-details'
import snackbarReducer from './reducers/snackbar'

export default createStore(
  combineReducers({
    myEventsReducer,
    eventsReducer,
    eventDetails,
    snackbarReducer
  }),
    applyMiddleware(
      promise()
    )
)
