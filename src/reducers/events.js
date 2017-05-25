const initalState = {
  upcomingEvents: [],
  events: [],
  loading: true,
  showPlaceHolder: false,
  placeholderMessage: '',
  userId: userIDCheck(JSON.parse(window.localStorage.getItem('userData')))
}

function userIDCheck (userData) {
  if (userData) {
    return userData.key
  } else {
    return ''
  }
}

function eventsReducer (state = initalState, action) {
  let events
  let upcomingEvents
  let switchControl = action
  let showPlaceHolder = false
  let placeholderMessage = ''
  if (typeof switchControl !== 'undefined') {
    switchControl = action.type
  } else {
    switchControl = ''
  }
  switch (switchControl) {
    case 'FETCH_EVENT':
      events = action.payload
      // There is no need to return a placeholder message here because these events are only used in the calendar
      // In which we don't need to show any placeholder!
      return { ...state, loading: false, events }
    case 'FETCH_UPCOMING_EVENT':
      upcomingEvents = action.payload
      if (upcomingEvents.length === 0) {
        showPlaceHolder = true
        placeholderMessage = 'No Upcoming events'
      }
      return { ...state, loading: false, upcomingEvents, showPlaceHolder, placeholderMessage }
    default:
      return state
  }
}

export default eventsReducer
