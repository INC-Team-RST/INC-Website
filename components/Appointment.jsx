import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
function AppointmentBooking(adminId) {

  const [appoints, setAppoints] = useState([]);
  
  const router = useRouter();

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
    console.log("in get function" + adminId.adminId);
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
    <div className="w-full font-myfont h-fit flex flex-row justify-center p-10 gap-40">
      <div>
      <div className="text-xl font-semibold text-center mb-6">
          {" "}
          Book an Appointment{" "}
        </div>
        <div>
          <Calendar onChange={handleDateChange} value={selectedDate} />
        </div>
        <div className="flex-col w-full justify-center items-center mt-4">
        <form className="flex flex-col gap-4 w-full justify-center items-center" onSubmit={handleAppointmentSubmit}>
        <div className="flex-row gap-3">
        <label htmlFor="start_time" className="font-normal text-gray-800">Start Time</label>
            <input
              id="start_time"
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
            />
            <label htmlFor="end_time" className="font-normal text-gray-800 m-1" >End Time</label>
            <input
              id="end_time"
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
            />
            </div>
            <button className="rounded-full p-2 px-3 bg-[#fa9746] font-normal text-gray-800" type="submit">Book Appointment</button>
          </form>
        </div>
      </div>
      <div className="flex flex-col text-center">
        <button onClick={()=>{getAppointments}} className="text-xl font-semibold text-center">
          {" "}
          Your Booked Appointments{" "}
        </button>
        <div className="table w-full p-2 gap-2">
          <thead>
            <tr>
              <th className="p-4 w-1/5">Date</th>
              <th className="p-4 w-1/5">From</th>
              <th className="p-4 w-1/5">To</th>
              <th className="p-4 w-1/5">Status</th>
              <th className="p-4 w-1/5">Video</th>

            </tr>
          </thead>
          <tbody>
            {Array.isArray(appoints) &&
              appoints.map((e, index) => {
                const startTime = new Date(e.startTime).getTime();
                const endTime = new Date(e.endTime).getTime();
                const currentTime = Date.now();
                const isTimeInRange = currentTime >= startTime && currentTime <= endTime;

                return (
                  <tr key={index} className="border-2 border-[#eaf3fa] bg-[#eaf3fa] rounded-xl py-3  m-2">
                    <td className="p-4 whitespace-nowrap w-1/5">
                      {new Date(e.date).toDateString()}
                    </td>
                    <td className="p-4 whitespace-nowrap w-1/5">
                      {new Date(startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                    </td>
                    <td className="p-4 whitespace-nowrap w-1/5">
                      {new Date(endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                    </td>
                    <td className="p-4 whitespace-nowrap w-1/5">
                      <span className={`${e.status == "PENDING" ? "text-yellow-600" : e.status == "ACCEPTED" ? "text-green-600" : "text-red-600"} font-semibold`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="p-4 w-1/5">
                      {isTimeInRange && e.status === "ACCEPTED" &&
                        <button onClick={()=>(router.push("/video"))}>
                          <Image alt="video" className="" src="/video.png" width={22} height={22} />
                        </button>
                      }
                    </td>
                  </tr>
                );
              })
            }

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
