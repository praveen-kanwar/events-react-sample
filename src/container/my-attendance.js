import { connect } from 'react-redux'
import MyAttendance from '../components/events/my-attendance'
import { setEvent } from '../actions/events'

const mapStateToProps = (state) => ({
  data: state.myEventsReducer,
  placeholder: state.placeholderReducer
})

const mapDispatchToProps = (dispatch) => {
  return {
    setEvent: (event) => {
      dispatch(setEvent(event))
    }
  }
}

const MyAttendanceContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyAttendance)

export default MyAttendanceContainer
