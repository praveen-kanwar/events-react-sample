function eventDetails (state = null, action) {
  switch (action.type) {
    case 'SET_EVENT':
      window.localStorage.setItem('currentEvent', JSON.stringify(action.payload))
      return { ...state, currentEvent: action.payload }
    default:
      return state
  }
}

export default eventDetails
