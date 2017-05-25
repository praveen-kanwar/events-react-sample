import React, { Component } from 'react'
import {
  Divider,
  Subheader
} from 'material-ui'
import EventList from '../../container/event-list'
import './list.css'
import { hashHistory } from 'react-router'
import CustomPlaceholder from '../../components/global/custom-placeholder'
import CircularProgress from 'material-ui/CircularProgress'

class MyAttendanceList extends Component {
  onItemClicked = (eventObj) => {
    const {setEvent} = this.props
    setEvent(eventObj)
    var path = `/event:${eventObj.id}`
    hashHistory.push(path)
  }

  render () {
    const {data} = this.props
    return (
      <div className='events-wrapper'>
        {data.yesEvents.length
          ? <div> <Subheader><b>ATTENDING</b></Subheader>
            <Divider />
            <EventList
              listOfEvents={data.yesEvents}
              userId={data.userId} /> </div>
            : null
        }
        {data.maybeEvents.length
          ? <div><Subheader><b>MAY ATTEND</b></Subheader>
            <Divider />
            <EventList
              listOfEvents={data.maybeEvents}
              userId={data.userId} /> </div>
          : null
        }
        {data.noEvents.length
          ? <div><Subheader><b>NOT ATTENDING</b></Subheader>
            <Divider />
            <EventList
              listOfEvents={data.noEvents}
              userId={data.userId} /> </div>
            : null
        }
        {data.loading ? <CircularProgress style={{marginLeft: '50%', marginTop: '5%'}} /> : null}
        <CustomPlaceholder show={data.showAttendingPlaceHolder} message={data.attendingPlaceholderMessage} />
      </div>
    )
  }
}

export default MyAttendanceList
