const initalState = {
  events: [],
  yesEvents: [],
  noEvents: [],
  maybeEvents: [],
  loading: true,
  showPlaceHolder: false,
  placeholderMessage: '',
  showAttendingPlaceHolder: false,
  attendingPlaceholderMessage: '',
  deleteRedirectPath: '/',
  userId: userIDCheck(JSON.parse(window.localStorage.getItem('userData')))
}

function userIDCheck (userData) {
  if (userData) {
    return userData.key
  } else {
    return ''
  }
}

function myEventsReducer (state = initalState, action) {
  let showPlaceHolder = false
  let placeholderMessage = ''
  let showAttendingPlaceHolder = false
  let attendingPlaceholderMessage = ''
  let events
  let switchControl = action
  if (typeof switchControl !== 'undefined') {
    switchControl = action.type
  } else {
    switchControl = ''
  }
  switch (switchControl) {
    case 'FETCH_MY_EVENT':
      events = action.payload
      if (events.length === 0) {
        showPlaceHolder = true
        placeholderMessage = 'You have not created any events'
      }
      return { ...state, loading: false, events: events, showPlaceHolder, placeholderMessage, deleteRedirectPath: 'myEvents' }

    case 'FETCH_YES_EVENT':
      events = action.payload
      if (state.yesEvents.length === 0 && state.noEvents.length === 0 && state.maybeEvents.length === 0) {
        showAttendingPlaceHolder = true
        attendingPlaceholderMessage = 'You have not responded to any events'
      }
      return { ...state, loading: false, yesEvents: events, showAttendingPlaceHolder, attendingPlaceholderMessage }

    case 'FETCH_NO_EVENT':
      events = action.payload
      if (state.yesEvents.length === 0 && state.noEvents.length === 0 && state.maybeEvents.length === 0) {
        showAttendingPlaceHolder = true
        attendingPlaceholderMessage = 'You have not responded to any events'
      }
      return { ...state, loading: false, noEvents: events, showAttendingPlaceHolder, attendingPlaceholderMessage }

    case 'FETCH_MAYBE_EVENT':
      events = action.payload
      if (state.yesEvents.length === 0 && state.noEvents.length === 0 && state.maybeEvents.length === 0) {
        showAttendingPlaceHolder = true
        attendingPlaceholderMessage = 'You have not responded to any events'
      }
      return { ...state, loading: false, maybeEvents: events, showAttendingPlaceHolder, attendingPlaceholderMessage }
    case 'INIT_STORE':
      return {...state,
        events: [],
        yesEvents: [],
        noEvents: [],
        maybeEvents: [],
        loading: true,
        showPlaceHolder: false,
        placeholderMessage: '',
        showAttendingPlaceHolder: false,
        attendingPlaceholderMessage: '',
        userId: action.userId
      }
    default:
      return state
  }
}

export default myEventsReducer
