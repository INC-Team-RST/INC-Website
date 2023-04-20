import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useEffect } from "react";
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
function AppointmentBooking(adminId) {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date().toLocaleTimeString());
  let finalStartTime = "";
  let finalEndTime = "";
  const [endTime, setEndTime] = useState(new Date().toLocaleTimeString());
  const [appoints, setAppoints] = useState([]);

  // const IST = 'Asia/Kolkata';
  // const timezoneDate = date.toLocaleString('en-US', { timeZone: IST });

  const handleDateChange = (date) => {
    setDate(date);
  };

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

//useEffect that calls the getAppointments function on page load
useEffect(() => {
    getAppointments();
  }, []);

  const postAppointment = async (date, finalStartTime, finalEndTime) => {
    var accessToken2 = userAccessToken();
    const initialDate = new Date(date);
    const date1 = new Date(finalStartTime);
    const date2 = new Date(finalEndTime);
    console.log("in post function");
    console.log(accessToken2);
    console.log(initialDate)
    console.log(date1)
    console.log(date2)
    console.log(typeof parseInt(adminId.adminId));
    try {
      const response = await fetch(
        "https://client-hive.onrender.com/api/user/appointment",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken2}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            admin_id: parseInt(adminId.adminId),
            date: initialDate,
            startTime: date1,
            endTime: date2,
          }),
        }
      );
      const data = await response.json();
      // console.log(data);
    } catch (error) {
      console.error("There was an error posting the appointment", error);
    }
  };
  const getAppointments = async () => {
    var accessToken2 = userAccessToken();
    try {
      const response = await fetch(
        "https://client-hive.onrender.com/api/user/appointment",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken2}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      // console.log(data);
      setAppoints(data);
      getAppointments();
    } catch (error) {
      console.error("There was an error posting the appointment", error);
    }
  };
  const handleSubmit = (event) => {
    console.log(date.toISOString());
    finalStartTime =
      date.toISOString().substring(0, 8) ;
    finalEndTime =
      date.toISOString().substring(0, 8) ;
    // console.log(finalStartTime);
    // console.log(finalEndTime);
    event.preventDefault();
    // handle form submission here
    // console.log(date, finalStartTime, finalEndTime)
    alert("Date is " + date.toLocaleDateString() + " Start Time is " + startTime + " End Time is " + endTime)
    // postAppointment(date,finalStartTime, finalEndTime);
    
    // setDate(new Date()); // Reset the calendar to the current date
  };

  return (
    <div className="w-full flex flex-row justify-center p-10 gap-60">
      <div>
        <h1>Appointment Booking</h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="date">Date:</label>
          <Calendar onChange={handleDateChange} value={date} />

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
      <div className="flex flex-col text-center">
        <div className="text-xl font-semibold text-center">
          {" "}
          Your Booked Appointments{" "}
        </div>
        <div className="flex flex-col m-4 items-start">
          {Array.isArray(appoints) &&
            appoints.map((e, index) => (
              <div
                key={index}
                className="flex flex-col border-2 rounded-2xl p-6 m-2"
              >
                <div>Date: {e.date}</div>
                <div className="flex flex-row gap-4">
                <div>From: {new Date(e.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}</div>
                <div>To: {new Date(e.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}</div>
                </div>
                
                <div>Status: {e.status}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default AppointmentBooking;
