const initalState = {
  open: false,
  message: ''
}

function snackbarReducer (state = initalState, action) {
  switch (action.type) {
    case 'SET_SNACKBAR':
      return { ...state, open: action.payload.open, message: action.payload.message }
    default:
      return state
  }
}

export default snackbarReducer
