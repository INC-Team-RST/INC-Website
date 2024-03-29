import React, { useEffect, useState } from "react";
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
import { useRouter } from "next/router";
import Image from "next/image";
import { IoLogOut } from "react-icons/io5";
import Link from "next/link";

const Useradmins = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [adminstoadd, setAdminsToAdd] = useState([]);
  const [addAdmin, setAddAdmin] = useState(false);
  const [adminService, setAdminService] = useState("NOT_SELECTED");
  // const [accessToken, setAccessToken] = useState(userAccessToken); // declare accessToken state variable
  const fetchAdminsData = async (accessToken) => {
    try {
      const response = await fetch(
        "https://client-hive.onrender.com/api/user/admins",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error("There was an error fetching the admins data:", error);
    }
  };
  useEffect(() => {
    var accessToken = userAccessToken();
    if (!accessToken) return router.push("/");
    console.log(accessToken);
    const [userInfo] = fetchUser();
    //console.log(userInfo);
    setUser(userInfo);

    fetchAdminsData(accessToken);
  }, [router]);
  const fetchAddAdminsData = async (profession) => {
    var accessToken1 = userAccessToken();
    console.log("in api function " + profession);
    console.log(accessToken1);
    try {
      const response = await fetch(
        "https://client-hive.onrender.com/api/user/admins/all",
        {
          method: "POST",
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
      setAdminsToAdd(data);
      console.log(adminstoadd);
    } catch (error) {
      console.error("There was an error fetching the admins data:", error);
    }
  };
  const postAddAdmin = async (admin) => {
    console.log("chosen admin " + admin.display_name);
    var accessToken2 = userAccessToken();
    console.log("in post function");
    console.log(accessToken2);
    try {
      const response = await fetch(
        "https://client-hive.onrender.com/api/user/admins",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken2}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: admin.id,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      fetchAdminsData(accessToken2)
      fetchAddAdminsData(admin.profession)
    } catch (error) {
      console.error("There was an error posting the admins data:", error);
    }
  };

  const handleOptionChange = (event) => {
    setAdminService(event.target.value);
    console.log(adminService);
    display(event.target.value);
  };
  const display = (adminService) => {
    console.log(adminService);
    fetchAddAdminsData(adminService);
  };
  const logout = async() => {
    const accessToken3 = userAccessToken();
    console.log(accessToken3);
    try {
      const response = await fetch(
        "https://client-hive.onrender.com/api/user/logout",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken3}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: accessToken3,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
    localStorage.clear();
    router.push("/");
  };
  return (
    <div className="bg-[#eaf3fa] w-screen h-screen flex flex-col text-center items-center font-myfont py-10 px-10">
    <IoLogOut
        fontSize={40}
        className="right-4 top-4 absolute cursor-pointer text-gray-600 mx-3"
        onClick={logout}
      />
      <div className="flex flex-row px-4 gap-2 m-6">
      <Image className="rounded-full" alt="profile photo" src={user?.photoURL} width={55} height={55}/>
        <div className="flex flex-col">
            <div className="text-xl font-semibold"> {user?.displayName}</div>
            <div className="text-base "> {user?.email}</div>
        </div>
      </div>
      <p className="text-[#30498f] font-bold text-4xl">
        Your Service Agent Admins
      </p>
      {admins!=[] && <div className="grid grid-cols-4 flex-wrap justify-items-center justify-center items-center my-10 gap-10">
        {admins.map((admin) => (
          <Link
            key={admin.id}
            className="flex flex-col rounded-2xl bg-[#fa9746] font-myfont p-10 w-full"
            href={`/users/${admin.id}`}
            // onClick={()=>(router.push(`/users/${admin.id}`))}
          >
            <p className="text-[#3b3b3c] font-semibold text-base">
              {admin.display_name}
            </p>
            <p className="text-[#3b3b3c]  text-base">{admin.profession}</p>
          </Link>
        ))}
      </div>}
      <button
        className="rounded-2xl text-[#30498f] font-bold text-2xl shadow-md w-fit justify-center shadow-slate-400 p-6"
        onClick={() => setAddAdmin(!addAdmin)}
      >
        Add New Admin
      </button>
      {addAdmin && (
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
      )}
      <div className="flex flex-wrap justify-center items-center my-10 gap-10">
        {adminstoadd.map((admin) => (
          <div
            key={admin.id}
            className="flex flex-col rounded-2xl hover:bg-[#fa9746] border-[0.1rem] border-black  hover:border-none font-myfont p-10"
            onClick={() => postAddAdmin(admin)}
          >
            <p className="text-[#3b3b3c] font-semibold text-base">
              {admin.display_name}
            </p>
            <p className="text-[#3b3b3c]  text-base">{admin.profession}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Useradmins;
