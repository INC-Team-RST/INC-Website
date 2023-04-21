import React from "react";
import { IoLogOut } from "react-icons/io5";
import { useRouter } from "next/router";
import Image from "next/image";
function Navbar({photoURL, displayName, email}) {
    const router = useRouter();
    const logout = () => {
        localStorage.clear();
        router.push("/login");
      };
      
  return (
      <nav className="bg-[#eaf3fa]">
        <div className="w-full px-12 flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="https://flowbite.com/" className="flex items-center">
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
            <ul className="font-medium flex justify-center items-center flex-col p-4 md:p-0 mt-4 border bg-[#eaf3fa] border-gray-100 rounded-lg  md:flex-row md:space-x-8 md:mt-0 md:border-0">
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                  aria-current="page"
                >
                  Find Admin
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Submit and Get Documents
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Schedule an appointment
                </a>
              </li>
              <li className="flex rounded-md py-2 gap-3">
                
                <Image src={photoURL} referrerPolicy="no-referrer" className="rounded-md shadow-md" alt="" width={40} height={40} />
                <p className="text-lg font-sans font-semibold ml-2">
                    {displayName}
                    <span className="block text-xs font-serif font-normal">
                    {email}
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
  );
}

export default Navbar;
