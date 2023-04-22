import React, { useEffect, useState } from "react";
import { userAccessToken, fetchUser } from "../../utils/fetchDetails";
import { useRouter } from "next/router";
import { IoLogOut } from "react-icons/io5";
import Image from "next/image";
import firebase from "firebase/app";
import Link from "next/link";
import { firebaseApp } from "../../firebase-config";
import "firebase/firestore";
import { db } from "../../firebase-config";
import Navbar from "../../components/Navbar";
// import 'bootstrap/dist/css/bootstrap.min.css';
import { Progress } from 'reactstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  doc,
  getDoc,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import AppointmentBooking from "../../components/AdminAppoinment";
function Dashboard() {
  const storage = getStorage();
  const router = useRouter();
  const auth = getAuth();

  const [file, setFile] = useState("");
  const [type, setType] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [admin, setAdmin] = useState(null);

  const userId = router.query.admindashboard;

  //navbar states
  const [appointment, setAppointment] = useState(true);
  const [documents, setDocuments] = useState(false);

  //docs array states
  const [Admindocsarr, setAdminDocsarr] = useState([]);
  const [AdminSharedocsarr, setAdminShareDocsarr] = useState([]);
  const [Userdocsarr, setUserDocsarr] = useState([]);

  //button states
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);


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
        console.log(data);
      } catch (error) {
        console.error("There was an error fetching the admins data:", error);
      }
    };

    fetchUsersData();
  }, []);

  useEffect(() => {
    if (userId && users?.length > 0) {
      const foundUser = users.find((user) => user.id === parseInt(userId));

      console.log(foundUser);
      if (foundUser) {
        setUser(foundUser);
      } else {
        router.push("/404"); // redirect to custom 404 page
      }
    }
  }, [userId, users, router]);

  function handleChange(event) {
    setFile(event.target.files[0]);
  }
  const handleFileUpload = (event) => {
    const Filereference = ref(storage, `Documents/${file.name}`);
    const uploadTask = uploadBytesResumable(Filereference, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progress == 100) { alert("Upload is " + progress + "% done") };
        setUploadProgress(progress); // update the progress state
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        var path = `Users/${auth.currentUser.uid}/Documents`;
        console.log(path);
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          var accessToken3 = userAccessToken();
          console.log(downloadURL);
          // try {
          const response = await fetch(
            "https://client-hive.onrender.com/api/admin/document",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken3}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                version: "1",
                name: file.name,
                url: downloadURL,
              }),
            }
          );
          console.log("in try");
          const data = await response.json();
          console.log(data);
          // } catch (error) {
          //   console.error(
          //     "There was an error fetching the admins data:",
          //     error
          //   );
          // }
        });
      }
    );
  };
  const returnDocs = async () => {
    try {
      var accessToken2 = userAccessToken();
      var path = `Users/${auth.currentUser.uid}/Documents`;
      var arr = [];
      var arr_ca = [];

      const response = await fetch(
        `https://client-hive.onrender.com/api/admin/mydocument`,
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
      setAdminDocsarr(data);
      setShow(true);
      setShow2(false);
    } catch (error) {
      console.log(error);
    }

    setType("Admin");
    //setCADocsarr(arr_ca);
    //console.log(arr)
  };
  const returnSharedDocs = async () => {
    try {
      var accessToken2 = userAccessToken();
      var path = `Users/${auth.currentUser.uid}/Documents`;
      const response = await fetch(
        `https://client-hive.onrender.com/api/admin/document/shared`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken2}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: parseInt(userId)
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      setShow(false);
      setShow2(true);
      setAdminShareDocsarr(data);
    } catch (error) {
      console.log(error);
    }

    setType("AdminShared");
    //setCADocsarr(arr_ca);
    //console.log(arr)
  };

  const handleShare = async (docId) => {
    var accessToken3 = userAccessToken();
    console.log(accessToken3);
    console.log(docId);
    try {
      const response = await fetch(
        `https://client-hive.onrender.com/api/admin/document/${docId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken3}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: parseInt(userId),
          }),
        }
      );
      const data = await response.json();
      alert("Document Shared Successfully with " + user.display_name);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  const logout = async () => {
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
    <div className={`w-full ${documents == true ? "h-screen" : "h-full"} flex flex-col bg-[#eaf3fa] bg-center font-myfont bg-no-repeat bg-[url('/opacity.png')]`}>
      <nav className="bg-[#c2e2fb]">
        <div className="w-full px-12 h-[5rem] align-middle flex flex-wrap items-center justify-between font-myfont mx-auto">
          <a href={"/"} className="flex items-center">
            <span className="self-center text-3xl font-extrabold text-[#2c458e] whitespace-nowrap dark:text-white">
              Client<span className="">Hive</span>
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
                  onClick={() => {
                    setShow(true)
                    returnDocs();
                    setDocuments(true)
                    setAppointment(false)
                  }}
                  className={`block py-2 pl-3 pr-4  rounded ${documents == true ? "text-blue-700" : "text-gray-900"} hover:text-blue-700 `}
                >
                  Share & Get Client Documents
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => {
                    setAppointment(true)
                    setDocuments(false)
                  }}
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Schedule Appointments
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
      <div className="flex flex-col items-center w-full h-full">
        <div className="mt-3">
          <div className="text-center text-[#fa9746] text-xl font-bold">Dashboard panel for Client : </div>
          <div className="align-center text-center text-[#3d4868] font-medium"> {user?.display_name} - {user?.email}</div>
        </div>

        {appointment == true && <AppointmentBooking userId={userId} />}
        <div className="flex px-10 flex-row gap-4 w-full  justify-center items-center align-middle">
          <div className="flex w-1/3 align-middle mt-3">
          {documents == true && (
            <div className="flex flex-col align-middle">
              <div>
                <button
                  className={`${show==true?"bg-[#afc3ff]":"bg-[#f69440]"} w-[18rem] font-myfont text-[1.2rem] font-medium h-[4rem] align-center my-4 rounded-2xl`}
                  onClick={returnDocs}
                >
                  Your Documents
                </button>
              </div>
              <div>
                <button
                  className={`${show2==true?"bg-[#afc3ff]":"bg-[#f69440]"} w-[18rem] font-myfont text-[1.2rem] font-medium h-[4rem] align-center my-4 rounded-2xl`}
                  onClick={returnSharedDocs}
                >
                  Get Shared Documents
                </button>
              </div>
              {/* <div>
              <button
                className="bg-[#f69440] w-[18rem] font-myfont font-normal h-18 align-center my-4 rounded-2xl"
                onClick={returnUserDocs}
              >
                Get User Documents 
              </button>
              </div> */}
              <div className="flex flex-col">
                <input type="file" onChange={handleChange} />
                <button
                  className="bg-[#f69440] w-[18rem] font-myfont text-[1.2rem] font-medium hover:bg-[#afc3ff] h-10 align-center my-4 rounded-2xl"
                  onClick={handleFileUpload}
                >
                  Upload
                </button>

              </div>
            </div>
          )}
          </div>
          
          <div className="flex ml-10 mt-4 w-2/3">
            {type === "Admin" && (
              <div className="flex flex-col gap-4">
                {Admindocsarr.map((doc) => (
                  <div key={doc.id} className="bg-[#e4edfa] relative rounded-xl border-2 gap-4 p-4 border-[#3d4868] w-full flex flex-row">
                    <Link href={doc.url} key={doc.id} className="relative">
                      <div className="flex flex-row">
                        <Image src="/file.png" alt="icon" width={60} height={60} />
                        <div className="flex-wrap"> {doc.name}</div>
                      </div>
                    </Link>
                    <Image onClick={() => { handleShare(doc.id) }} className="top-3 right-2 h-6 w-6" src="/share.png" alt="icon" width={20} height={20} />
                  </div>

                ))}
              </div>
            )}
            {type === "AdminShared" && (
              <div className="flex flex-col gap-4">
                {AdminSharedocsarr.map((doc) => (
                  <div key={doc.id} className="bg-[#e4edfa] relative rounded-xl border-2 gap-4 p-4 border-[#3d4868] w-full flex flex-row">
                    <Link href={doc.url} key={doc.id} className="relative">
                      <div className="flex flex-row">
                        <Image src="/file.png" alt="icon" width={60} height={60} />
                        <div className="flex-wrap"> {doc.name}</div>
                      </div>
                    </Link>
                    {/* <Image onClick={() => { handleShare(doc.id) }} className="top-3 right-2 h-6 w-6" src="/share.png" alt="icon" width={20} height={20} /> */}
                  </div>

                ))}
              </div>
            )}
            {type === "User" && (
              <div className="flex flex-col gap-4">
                {Userdocsarr.map((doc) => (
                  <Link href={doc.url} key={doc.id}>
                    <div className="bg-[#e4edfa] rounded-xl border-2 p-4 border-[#3d4868] w-64 flex flex-row">
                      <Image src="/file.png" alt="icon" width={60} height={60} />
                      {doc.name}
                      {/* <Image src="/share.png" alt="icon" width={60} height={60} /> */}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
