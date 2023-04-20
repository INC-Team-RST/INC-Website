import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useEffect } from "react";
import Image from "next/image";
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
function AppointmentBooking(adminId) {

  const [appoints, setAppoints] = useState([]);

 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // const IST = 'Asia/Kolkata';
  // const timezoneDate = date.toLocaleString('en-US', { timeZone: IST });

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
  //   console.log(initialDate)
  //   console.log(date1)
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
  //     // console.log(data);
  //   } catch (error) {
  //     console.error("There was an error posting the appointment", error);
  //   }
  // };
  const getAppointments = async () => {
    console.log("in get function"+ adminId.adminId);
    var accessToken2 = userAccessToken();
    try {
      const response = await fetch(
        `https://client-hive.onrender.com/api/user/appointment/${adminId.adminId}`,
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
      // getAppointments();
    } catch (error) {
      console.error("There was an error posting the appointment", error);
    }
  };
  const handleAppointmentSubmit = async (event) => {
    event.preventDefault();
    var accessToken2 = userAccessToken();
    const selectedDateTime = new Date(selectedDate);
    const startDateTime = new Date(`${selectedDateTime.toDateString()} ${startTime}`);
    const endDateTime = new Date(`${selectedDateTime.toDateString()} ${endTime}`);
    const apidata = {
      date: selectedDateTime.toISOString(),
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString()
    };

    console.log(apidata.date);
    console.log(apidata.start_time);
    console.log(apidata.end_time);

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
            date: apidata.date,
            startTime: apidata.start_time,
            endTime: apidata.end_time,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("There was an error posting the appointment", error);
    }

    // const start = new Date(data.start_time);
    // const end = new Date(data.end_time);

    // const startdate= new Date(new Date(data.start_time));
    // const enddate= new Date(end);

    const str = new Date(new Date(apidata.start_time)).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    const endstr = new Date(new Date(apidata.end_time)).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    console.log(str);
    console.log(endstr);
    getAppointments();
    setStartTime('');
    setEndTime('');
  };
  
  return (
    <div className="w-full font-myfont flex flex-row justify-center p-10 gap-60">
      <div>
        <h1>Appointment Booking</h1>
        <div>
          <Calendar onChange={handleDateChange} value={selectedDate} />
        </div>
        <div className="flex-col w-full justify-center items-center">
          <form className="flex flex-col w-full justify-center items-center" onSubmit={handleAppointmentSubmit}>
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
      </div>
      <div className="flex flex-col text-center">
        <div className="text-xl font-semibold text-center">
          {" "}
          Your Booked Appointments{" "}
        </div>
        <div className="table w-full p-2 gap-2">
          <thead>
            <tr>
              <th className="p-4 w-1/4">Date</th>
              <th className="p-4 w-1/4">From</th>
              <th className="p-4 w-1/4">To</th>
              <th className="p-4 w-1/4">Status</th>
              
            </tr>
          </thead>
          <tbody>
            {Array.isArray(appoints) &&
              appoints.map((e, index) => (
                <tr key={index} className="border-2 border-[#eaf3fa] bg-[#eaf3fa] rounded-xl py-3  m-2">
                  <td className="p-4 whitespace-nowrap w-1/4">
                    {new Date(e.date).toDateString()}
                  </td>
                  <td className="p-4 whitespace-nowrap w-1/4">
                    {
                      new Date(new Date(e.startTime)).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                    }
                  </td>
                  <td className="p-4 whitespace-nowrap w-1/4">
                    {new Date(new Date(e.endTime)).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                  </td>
                  <td className="p-4 whitespace-nowrap w-1/4">
                    <span className={`${e.status == "PENDING" ? "text-yellow-600" : e.status == "ACCEPTED" ? "text-green-600" : "text-red-600"} font-semibold`}>
                      {e.status}
                    </span>
                  </td>
                  {/* <td className="p-2 w-1/4 ">
                    <button onClick={() => { handleApprove(index) }} className="px-1 hover:scale-125 transform duration-300">
                      <Image className="font-bold" alt="approve" src="/approve.png" height={25} width={25} />
                    </button>
                    <button onClick={() => { handleReject(index) }} className="px-1 hover:scale-125 transform duration-300">
                      <Image alt="reject" src="/remove.png" height={25} width={26} />
                    </button>
                  </td> */}
                </tr>
              ))}
          </tbody>
        </div>
        {/* <div className="flex flex-col m-4 items-start">
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
        </div> */}
      </div>
    </div>
  );
}

export default AppointmentBooking;
