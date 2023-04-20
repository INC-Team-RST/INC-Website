import React, { useEffect, useState } from "react";
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
import { useRouter } from "next/router";
import Image from "next/image";
import { IoLogOut } from "react-icons/io5";
import Link from "next/link";
function Adminpage() {
    const router = useRouter();
    const [admin, setAdmin] = useState(null);
    const [adminService, setAdminService] = useState("NOT_SELECTED");
    useEffect (() => {
        var accessToken = userAccessToken();
        if (!accessToken) return router.push("/");
        const [userInfo] = fetchUser();
        setAdmin(userInfo)
    },[])
    const logout = () => {
        localStorage.clear();
        router.push("/");
      };
    const handleOptionChange=(event)=>{
        setAdminService(event.target.value);
        console.log(adminService);
    }
    const updateAdminService = async (profession) =>
    {
    var accessToken1 = userAccessToken();
    console.log("in api function " + profession);
    console.log(accessToken1);
    try {
      const response = await fetch(
        "https://client-hive.onrender.com/api/admin/update",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken1}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profession: profession,
          }),
        }
      );
      const data = await response.json();
      console.log(data)
      router.push("/admindashboard")
    } catch (error) {
      console.error("There was an error fetching the admins data:", error);
    }
    }

  return (
    <div className="bg-[#eaf3fa] w-screen h-screen flex flex-col text-center items-center font-myfont py-10 px-10 ">
      <IoLogOut
        fontSize={40}
        className="right-4 top-4 absolute cursor-pointer text-gray-600 mx-3"
        onClick={logout}
      />
      <div className="text-[#30498f] font-bold text-4xl mb-10"> Admin at Client Hive </div>
      <div className="flex flex-row px-4 gap-2 m-6">
      <Image className="rounded-full" alt="profile photo" src={admin?.photoURL} width={55} height={55}/>
        <div className="flex flex-col">
            <div className="text-xl font-semibold"> {admin?.displayName}</div>
            <div className="text-base "> {admin?.email}</div>
        </div>
      </div>
      <div className="flex flex-row pt-4">
          <p className="text-[1.2rem] py-2">
            {" "}
            Choose the service / profession category
          </p>
          <select
            onChange={handleOptionChange}
            className="mx-4 bg-[#acc3fb] rounded-2xl px-3 py-2 justify-center items-center"
          >
            <option value="NOT_SELECTED">Select an option</option>
            <option value="CA">C.A.</option>
            <option value="LAWYER">Lawyer</option>
            <option value="POLICY_AGENT">Policy Agent</option>
            <option value="DOCTOR">Doctor</option>
            <option value="TEACHER">Teacher</option>
            <option value="ARCHITECT">Architect</option>
          </select>
      </div>
      { admin?.profession!=="NOT_SELECTED" &&
        <button onClick={()=>(updateAdminService(adminService))} className="text-xl p-5 text-[1.2rem] my-6 rounded-2xl bg-[#f59d55]"> Continue as Admin-profession : <span className="text-[#30498f] font-medium"> {adminService} </span></button>
      }
    </div>
  )
}

export default Adminpage
