import { connect } from 'react-redux'
import MyEvents from '../components/events/list'
import { fetchMyEvents, setEvent, setSnackbar } from '../actions/events'
import C from '../utilities/constants'
import store from '../store'

const mapStateToProps = (state) => ({
  data: state.myEventsReducer,
  status: state.snackbarReducer
})

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMyEvents: () => {
      let ref = C.FIREBASE.database().ref('events').orderByChild('created_by/uid').equalTo(store.getState().myEventsReducer.userId)
      ref.on('value', snapshot => {
        var obj = snapshot.val()
        var arr = []
        if (obj === null) {
          dispatch(fetchMyEvents(arr))
        }
        arr = Object.keys(obj).map(function (key) {
          obj[key].id = key
          obj[key].start = new Date(obj[key].start)
          obj[key].end = new Date(obj[key].end)
          // to refresh event details when list gets refreshed
          if (store.getState().eventDetails) {
            if (store.getState().eventDetails.currentEvent.id === key) {
              dispatch(setEvent(obj[key]))
            }
          }
          return obj[key]
        })
        dispatch(fetchMyEvents(arr))
      })
    },
    setEvent: (event) => {
      dispatch(setEvent(event))
    },
    setSnackbar: (snackbarStatus) => {
      dispatch(setSnackbar(snackbarStatus))
    }
  }
}

const MyEventsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyEvents)

export default MyEventsContainer
