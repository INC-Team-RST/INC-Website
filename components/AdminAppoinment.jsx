import { useState } from "react";
import Calendar from "react-calendar";
import Image from "next/image";
import "react-calendar/dist/Calendar.css";
import React, { useEffect } from "react";
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
function AppointmentBooking(userId) {

  // const [date, setDate] = useState(new Date());
  // const [startTime, setStartTime] = useState(new Date().toLocaleTimeString());
  // const [endTime, setEndTime] = useState(new Date().toLocaleTimeString());
  const [appoints, setAppoints] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [appointments, setAppointments] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
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

  // const postAppointment = async (date, finalStartTime, finalEndTime) => {
  //   var accessToken2 = userAccessToken();
  //   const initialDate = new Date(date);
  //   const date1 = new Date(finalStartTime);
  //   const date2 = new Date(finalEndTime);
  //   console.log("in post function");
  //   console.log(accessToken2);
  //   // console.log(initialDate)
  //   // console.log(date1)
  //   console.log(date2)
  //   console.log(typeof parseInt(adminId.adminId));
  //   try {
  //     const response = await fetch(
  //       "https://client-hive.onrender.com/api/user/appointment",
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${accessToken2}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           admin_id: parseInt(adminId.adminId),
  //           date: initialDate,
  //           startTime: date1,
  //           endTime: date2,
  //         }),
  //       }
  //     );
  //     const data = await response.json();
  //     console.log(data);
  //   } catch (error) {
  //     console.error("There was an error posting the appointment", error);
  //   }
  // };
  const getAppointments = async () => {
    var accessToken2 = userAccessToken();
    console.log("in get function" + userId.userId);
    try {
      const response = await fetch(
        `https://client-hive.onrender.com/api/admin/appointment/${userId.userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken2}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setAppoints(data);
    } catch (error) {
      console.error("There was an error posting the appointment", error);
    }
  };
  const handleSubmit = (event) => {
    console.log(date.toISOString());
    // finalStartTime =
    //   date.toISOString().substring(0, 8) +
    //   date.getDate() +
    //   "T" +
    //   startTime +
    //   ".000" +
    //   "Z";
    // finalEndTime =
    //   date.toISOString().substring(0, 8) +
    //   date.getDate() +
    //   "T" +
    //   endTime +
    //   ".000" +
    //   "Z";
    // console.log(finalStartTime);
    // console.log(finalEndTime);
    event.preventDefault();
    // handle form submission here
    // postAppointment(date.toISOString(),finalStartTime, finalEndTime);
    // getAppointments();
    // setDate(new Date()); // Reset the calendar to the current date
  };
  const handleAppointmentSubmit = (event) => {
    event.preventDefault();
    const selectedDateTime = new Date(selectedDate);
  const startDateTime = new Date(`${selectedDateTime.toDateString()} ${startTime}`);
  const endDateTime = new Date(`${selectedDateTime.toDateString()} ${endTime}`);
  const data = {
    date: selectedDateTime.toISOString(),
    start_time: startDateTime.toISOString(),
    end_time: endDateTime.toISOString()
  };
  console.log(data.date);
  console.log(data.start_time);
  console.log(data.end_time);

  const start = new Date(data.start_time);
  const end = new Date(data.end_time);

  const startdate= new Date(new Date(data.start_time));
  const enddate= new Date(end);

  const str=new Date(new Date(data.start_time)).toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true});
  const endstr=enddate.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true});

  console.log(str);
  console.log(endstr);

    setAppointments([...appointments, data]);
    setStartTime('');
    setEndTime('');
  };

  const handleApprove = async (index) => {
    const newAppoints = [...appoints];
    newAppoints[index].status = "ACCEPTED";
    setAppoints(newAppoints);
    const accessToken3 = userAccessToken();
    console.log(accessToken3);
    try {
      const response = await fetch(`https://client-hive.onrender.com/api/admin/appointment/${newAppoints[index].id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken3}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "ACCEPTED" }),
      });
      const data = await response.json();
      console.log(data);
      // getAppointments();
    } catch (error) {
      console.error(error);
    }
  };
  const handleReject = async (index) => {
    const newAppoints = [...appoints];
    newAppoints[index].status = "REJECTED";
    setAppoints(newAppoints);
    const accessToken3 = userAccessToken();
    console.log(accessToken3);
    try {
      const response = await fetch(`https://client-hive.onrender.com/api/admin/appointment/${newAppoints[index].id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken3}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "REJECTED" }),
      });
      const data = await response.json();
      console.log(data);
      // getAppointments();
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="w-full h-fit flex flex-row justify-center p-10 gap-60">
      <div>
        <h1>Appointment Booking</h1>
        {/* <form onSubmit={handleSubmit} className="flex flex-col">
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
        </form> */}
        <div>
          <Calendar onChange={handleDateChange} value={selectedDate} />
        </div>
        <div className="flex-col w-full justify-center items-center">
          <form className="flex-col w-full justify-center items-center" onSubmit={handleAppointmentSubmit}>
            <label htmlFor="start_time">Start Time (UTC)</label>
            <input
              id="start_time"
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
            />
            <label htmlFor="end_time">End Time (UTC)</label>
            <input
              id="end_time"
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
            />
            <button type="submit">Book Appointment</button>
          </form>
        </div>
        <h2>Appointments</h2>
        <ul>
          {appointments.map((appointment, index) => (
            <li key={index}>
              {new Date(appointment.date).toLocaleDateString()} - {new Date(new Date(appointment.start_time)).toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})} to {new Date(new Date(appointment.end_time)).toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col text-center">
        <div className="text-xl font-semibold text-center">
          {" "}
          Your Appointments{" "}
        </div>
        <div className="table w-full p-2 gap-2">
          <thead>
            <tr>
              <th className="p-4 w-1/5">Date</th>
              <th className="p-4 w-1/5">From</th>
              <th className="p-4 w-1/5">To</th>
              <th className="p-4 w-1/5">Status</th>
              <th className="p-4 w-1/5">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(appoints) &&
              appoints.map((e, index) => (
                <tr key={index} className="border-2 border-[#eaf3fa] bg-[#eaf3fa] rounded-xl py-3  m-2">
                  <td className="p-4 whitespace-nowrap w-1/5">
                    {new Date(e.date).toDateString().substring(4)}
                  </td>
                  <td className="p-4 whitespace-nowrap w-1/5">
                    {new Date(e.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td className="p-4 whitespace-nowrap w-1/5">
                    {new Date(e.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td className="p-4 whitespace-nowrap w-1/5">
                    <span className={`${e.status == "PENDING" ? "text-yellow-600" : e.status == "ACCEPTED" ? "text-green-600" : "text-red-600"} font-semibold`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="p-2 w-1/5 ">
                    <button onClick={() => { handleApprove(index) }} className="px-1 hover:scale-125 transform duration-300">
                      <Image className="font-bold" alt="approve" src="/approve.png" height={25} width={25} />
                    </button>
                    <button onClick={() => { handleReject(index) }} className="px-1 hover:scale-125 transform duration-300">
                      <Image alt="reject" src="/remove.png" height={25} width={26} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </div>
      </div>
    </div>
  );
}

export default AppointmentBooking;
