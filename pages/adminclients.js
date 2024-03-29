import React, { useEffect, useState } from "react";
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
import { useRouter } from "next/router";
import { IoLogOut } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import NavbarAdmin from "../components/NavbarAdmin";

function Admindashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);

  //navbar states
  const [clients, setClients] = useState(false);
  const [appointment, setAppointment] = useState(false);
  const [documents, setDocuments] = useState(false);

  useEffect(() => {
    const accessToken = userAccessToken();
    if (!accessToken) return router.push("/");
    const [userInfo] = fetchUser();
    //console.log(userInfo);
    setAdmin(userInfo);
    const fetchUsersData = async () => {
      try {
        const response = await fetch(
          "https://client-hive.onrender.com/api/admin/users",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("There was an error fetching the admins data:", error);
      }
    };
    fetchUsersData();
  }, []);
  console.log(users);
  const logout = async  () => {
    const accessToken3 = userAccessToken();
    console.log(accessToken3);
    try {
      const response = await fetch(
        "https://client-hive.onrender.com/api/admin/logout",
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
    <div className="w-screen h-screen flex flex-col bg-[#eaf3fa] bg-fixed bg-center font-myfont bg-no-repeat bg-[url('/opacity.png')] bg-size-80" >
      <IoLogOut
        fontSize={40}
        className="right-4 top-4 absolute cursor-pointer text-gray-600 mx-3"
        onClick={logout}
      />
      <div className="text-[2rem] text-center text-[#2b468b] my-10 font-bold">
        {" "}
        Your Registered Clients
      </div>
      {users != [] && users.length > 0 && (
        <div className="grid grid-cols-3 flex-wrap justify-items-center justify-center items-center my-10 mx-10 gap-10">
          {users != [] && users.length > 0 &&
            users.map((user, index) => (
              <Link
                key={index}
                href={`/admins/${user.id}`}
                className="flex flex-row px-4 bg-[#eaf3fa] gap-2 align-middle shadow-xl shadow-slate-300 p-4 rounded-2xl border-2 border-gray-300"
              >
                <Image
                  className="rounded-full"
                  alt="profile photo"
                  src={user.photoURL!=null?user.photoURL:""}
                  width={55}
                  height={55}
                />
                <div className="align-middle flex-col  w-full justify-center items-center">
                  <div className="text-xl font-medium ">
                    {" "}
                    {user.display_name}
                  </div>
                  <div className="text-xl font-normal ">{user.email}</div>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}

export default Admindashboard;
