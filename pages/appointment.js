import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function AppointmentBooking() {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date().toLocaleTimeString());
  let finalStartTime="";
  let finalEndTime="";
  const [endTime, setEndTime] = useState(new Date().toLocaleTimeString());

  const handleDateChange = (date) => {
    setDate(date);
  };

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
   
  };

  const handleSubmit = (event) => {
    finalStartTime =date.toISOString().substring(0, 8)+date.getDate()+"T"+startTime+".000"+"Z";
    finalEndTime =date.toISOString().substring(0, 8)+date.getDate()+"T"+endTime+".000"+"Z";
    console.log(finalStartTime);
    console.log(finalEndTime);
    event.preventDefault();
    // handle form submission here
  };

  return (
    <div>
      <h1>Appointment Booking</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="date">Date:</label>
        <Calendar
          onChange={handleDateChange}
          value={date}
        />

        <label htmlFor="startTime">Start Time:</label>
        <input
          type="time"
          id="startTime"
          name="startTime"
          value={startTime}
          onChange={handleStartTimeChange}
        />

        <label htmlFor="endTime">End Time:</label>
        <input
          type="time"
          id="endTime"
          name="endTime"
          value={endTime}
          onChange={handleEndTimeChange}
        />

        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
}

export default AppointmentBooking;
