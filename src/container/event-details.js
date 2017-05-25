import { connect } from 'react-redux'
import EventDetails from '../components/events/details'

const mapStateToProps = (state) => ({
  eventDetails: state.eventDetails
})

const EventDetailsContainer = connect(
  mapStateToProps,
)(EventDetails)

export default EventDetailsContainer
