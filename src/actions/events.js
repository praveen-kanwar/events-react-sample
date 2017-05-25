export function fetchEvents (events) {
  return {
    type: 'FETCH_EVENT',
    payload: events
  }
}

export function fetchUpcomingEvents (events) {
  return {
    type: 'FETCH_UPCOMING_EVENT',
    payload: events
  }
}

export function fetchMyEvents (events) {
  return {
    type: 'FETCH_MY_EVENT',
    payload: events
  }
}

export function fetchYesEvents (events) {
  return {
    type: 'FETCH_YES_EVENT',
    payload: events
  }
}

export function fetchNoEvents (events) {
  return {
    type: 'FETCH_NO_EVENT',
    payload: events
  }
}

export function fetchMaybeEvents (events) {
  return {
    type: 'FETCH_MAYBE_EVENT',
    payload: events
  }
}

export function setEvent (event) {
  return {
    type: 'SET_EVENT',
    payload: event
  }
}

export function setSnackbar (snackbarStatus) {
  return {
    type: 'SET_SNACKBAR',
    payload: snackbarStatus
  }
}

export function initStore (userId) {
  return {
    type: 'INIT_STORE',
    payload: [],
    userId: userId
  }
}
