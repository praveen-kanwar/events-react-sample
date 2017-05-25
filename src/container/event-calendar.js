import { connect } from 'react-redux'
import EventCalendar from '../components/events/calendar'
import { setEvent } from '../actions/events'

const mapStateToProps = (state) => ({
  data: state.eventsReducer
})

const mapDispatchToProps = (dispatch) => {
  return {
    setEvent: (event) => {
      dispatch(setEvent(event))
    }
  }
}

const EventsCalendarContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EventCalendar)

export default EventsCalendarContainer
