import React, { useEffect, useState } from "react";
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
import { useRouter } from "next/router";
import { IoLogOut } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState(null);
    const [admin, setAdmin] = useState(null);

    const userId=router.query.admindashboard;


    useEffect(() => {
        const accessToken = userAccessToken();
        if (!accessToken) return router.push("/");
        const [userInfo] = fetchUser();
        //console.log(userInfo);
        setAdmin(userInfo);
      }, []);

      useEffect(() => {
        if (userId && admins.length > 0) {
          const foundAdmin = admins.find((admin) => admin.id === parseInt(adminId));
    
          console.log(foundAdmin);
          if (foundAdmin) {
            setAdmin(foundAdmin);
          } else {
            router.push("/404"); // redirect to custom 404 page
          }
        }
      }, [adminId, admins, router]);

  return (
    <div className="w-screen h-screen flex flex-col bg-[#eaf3fa] bg-fixed bg-center font-myfont bg-no-repeat bg-[url('/accounting.png')]">
      <nav className="bg-[#c2e2fb]">
        <div className="w-full px-12 h-[5rem] align-middle flex flex-wrap items-center justify-between font-myfont mx-auto">
          <a href={"/"} className="flex items-center">
            <span className="self-center text-3xl font-extrabold text-[#2c458e] whitespace-nowrap dark:text-white">
              ClientHive
            </span>
          </a>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex justify-center items-center flex-col p-4 md:p-0 mt-4 border  rounded-lg  md:flex-row md:space-x-8 md:mt-0 md:border-0">
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                  aria-current="page"
                >
                  View Clients
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => setDocuments(!documents)}
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Submit and Get Documents
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => setAppointment(!appointment)}
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Schedule an appointment
                </a>
              </li>
              <li className="flex rounded-md py-2  font-myfont gap-1">
                <Image
                  src={admin?.photoURL}
                  referrerPolicy="no-referrer"
                  className="rounded-full shadow-md"
                  alt=""
                  width={50}
                  height={50}
                />
                <p className="text-lg font-semibold ml-2">
                  {admin?.displayName}
                  <span className="block text-xs font-medium">
                    {admin?.email}
                  </span>
                </p>
                <IoLogOut
                  fontSize={40}
                  className="cursor-pointer text-gray-600 mx-3"
                  onClick={logout}
                />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Dashboard;
