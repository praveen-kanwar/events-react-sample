import { connect } from 'react-redux'
import App from '../App'
import { setSnackbar, setPlaceholder } from '../actions/events'

const mapStateToProps = (state) => ({
  status: state.snackbarReducer
})

const mapDispatchToProps = (dispatch) => {
  return {
    setSnackbar: (snackbarStatus) => {
      dispatch(setSnackbar(snackbarStatus))
    },
    setPlaceholder: (placeholder) => {
      dispatch(setPlaceholder(placeholder))
    }
  }
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(App)

export default AppContainer
