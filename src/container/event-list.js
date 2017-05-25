import { connect } from 'react-redux'
import EventList from '../components/events/list'
import { setEvent } from '../actions/events'

const mapStateToProps = (state) => ({
  data: state.eventsReducer,
  placeholder: state.placeholderReducer
})

const mapDispatchToProps = (dispatch) => {
  return {
    setEvent: (event) => {
      dispatch(setEvent(event))
    }
  }
}

const EventsListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EventList)

export default EventsListContainer
