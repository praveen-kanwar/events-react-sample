import { connect } from 'react-redux'
import Navigation from '../Navigation'
import { fetchEvents, fetchUpcomingEvents, setEvent, setSnackbar } from '../actions/events'
import C from '../utilities/constants'
import store from '../store'

const mapStateToProps = (state) => ({
  data: state.eventsReducer,
  status: state.snackbarReducer
})

const mapDispatchToProps = (dispatch) => {
  return {
    fetchEvents: () => {
      let ref = C.FIREBASE.app().database().ref(`events`).orderByChild('start')
      ref.on('value', function (snapshot) {
        let arr = []
        let upcomingArr = []
        snapshot.forEach(function (obj) {
          let child = obj.val()
          child.id = obj.getKey()
          child.start = new Date(child.start)
          child.end = new Date(child.end)
          arr.push(child)
          // to refresh event details when list gets refreshed
          if (store.getState().eventDetails) {
            if (store.getState().eventDetails.currentEvent.id === obj.getKey()) {
              dispatch(setEvent(child))
            }
          }
        })
        let now = new Date()
        let nextMonth = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
        arr.forEach((child) => {
          if (child.start >= now && child.start <= nextMonth) {
            upcomingArr.push(child)
          }
        })
        dispatch(fetchUpcomingEvents(upcomingArr))
        dispatch(fetchEvents(arr))
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

const EventsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Navigation)

export default EventsContainer
