import React, {Component} from 'react'
import BigCalendar from '../../../node_modules/react-big-calendar'
import '../../../node_modules/react-big-calendar/lib/css/react-big-calendar.css'
import './calendar.css'
import moment from 'moment'
import { hashHistory } from 'react-router'
import * as GlobalFunctions from '../../utilities/functions'

BigCalendar.momentLocalizer(moment)

class EventCalendar extends Component {
  onEventSelected (eventObject) {
    var path = `/event:${eventObject.id}`
    const {setEvent} = this.props
    eventObject.deleteRedirectPath = '/eventCalendar'
    setEvent(eventObject)
    hashHistory.push(path)
  }

  eventStyleGetter (event, start, end, isSelected) {
    return {
      style: {
        backgroundColor: event.category.color,
        color: GlobalFunctions.getTextColor(event.category.color || '#000000')
      }
    }
  }

  render () {
    const {data} = this.props
    return (
      <div className='App-calendar'>
        <BigCalendar
          className='Big-calendar'
          events={data.events}
          defaultDate={new Date()}
          defaultView='week'
          onSelectEvent={this.onEventSelected.bind(this)}
          eventPropGetter={(this.eventStyleGetter.bind(this))}
          />
      </div>
    )
  }
}

export default EventCalendar
