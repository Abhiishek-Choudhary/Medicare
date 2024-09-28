import React, { useEffect,useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function Calender() {

    const [events, setEvents] = useState([]);

    useEffect(()=>{

    },[])

  return (
    <div>
    <h2 className='ml-10'>Booking Calendar</h2>
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      // views={['day', 'week']}
      step={30} // Time slot interval in minutes
      style={{ height: 500 }}
    />
  </div>
  )
}

export default Calender