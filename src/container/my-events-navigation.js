import { connect } from 'react-redux'
import MyEventsNavigation from '../my-events-navigation'
import { fetchMyEvents, fetchYesEvents, fetchNoEvents, fetchMaybeEvents, setEvent, setSnackbar } from '../actions/events'
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
      ref.on('value', function (snapshot) {
        let arr = []
        let futureArr = []
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
        let nextMonth = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
        arr.forEach((child) => {
          if (child.start >= now && child.start <= nextMonth) {
            futureArr.push(child)
          }
        })
        futureArr.sort(function (a, b) {
          if (a.start < b.start) {
            return -1
          } else if (a.start > b.start) {
            return 1
          }
          return 0
        })
        dispatch(fetchMyEvents(futureArr))
      })
    },
    fetchEventsAsPerActions: (action) => {
      let ref = C.FIREBASE.database().ref('events').orderByChild('users/' + store.getState().myEventsReducer.userId + '/response').equalTo(action)
      ref.on('value', function (snapshot) {
        let arr = []
        let futureArr = []
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
        let nextMonth = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
        arr.forEach((child) => {
          if (child.start >= now && child.start <= nextMonth) {
            futureArr.push(child)
          }
        })
        futureArr.sort(function (a, b) {
          if (a.start < b.start) {
            return -1
          } else if (a.start > b.start) {
            return 1
          }
          return 0
        })
        if (action === 'Yes') {
          dispatch(fetchYesEvents(futureArr))
        } else if (action === 'No') {
          dispatch(fetchNoEvents(futureArr))
        } else if (action === 'Maybe') {
          dispatch(fetchMaybeEvents(futureArr))
        }
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
)(MyEventsNavigation)

export default MyEventsContainer
