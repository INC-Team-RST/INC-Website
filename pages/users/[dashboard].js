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
import AppointmentBooking from "../../components/Appointment";
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Progress } from 'reactstrap';

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
const Index = () => {
  const router = useRouter();
  const [file, setFile] = useState("");
  const [type, setType] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const [user, setUser] = useState(null);
  const storage = getStorage();
  const [CAdocsarr, setCADocsarr] = useState([]);
  const [Userdocsarr, setUserDocsarr] = useState([]);

  //navbar states
  const [appointment, setAppointment] = useState(false);
  const [documents, setDocuments] = useState(false);

  const auth = getAuth();
  console.log(router.query);

  const adminId = router.query.dashboard;
  const [admin, setAdmin] = useState(null);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const accessToken = userAccessToken();
    if (!accessToken) return router.push("/");
    const [userInfo] = fetchUser();
    //console.log(userInfo);
    setUser(userInfo);
    const fetchAdminsData = async () => {
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

    fetchAdminsData();
  }, []);

  console.log(admins);
  useEffect(() => {
    if (adminId && admins.length > 0) {
      const foundAdmin = admins.find((admin) => admin.id === parseInt(adminId));

      console.log(foundAdmin);
      if (foundAdmin) {
        setAdmin(foundAdmin);
      } else {
        router.push("/404"); // redirect to custom 404 page
      }
    }
  }, [adminId, admins, router]);
  // console.log("admin "+ admin.id)
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
            "https://client-hive.onrender.com/api/user/document",
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
          setAdmins(data);
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
      // const querySnapshot = await getDocs(collection(db, path));
      // querySnapshot.forEach((doc) => {
      //   // doc.data() is never undefined for query doc snapshots
      //   //console.log(doc.id, " => ", doc.data()['url']);
      //   if (doc.data()["Type"] == "UserDocument") {
      //     arr.push(doc.data());
      //   } else {
      //     arr_ca.push(doc.data());
      //   }
      // });
      const response = await fetch(
        `https://client-hive.onrender.com/api/user/mydocument`,
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
      setUserDocsarr(data);
    } catch (error) {
      console.log(error);
    }

    setType("User");
    //setCADocsarr(arr_ca);
    //console.log(arr)
  };
  const returnDocs_CA = async () => {
    try {
      var path = `Users/${auth.currentUser.uid}/Documents`;
      var arr = [];
      var arr_ca = [];
      const querySnapshot = await getDocs(collection(db, path));
      console.log("Rohan");
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data()['url']);
        if (doc.data()["Type"] == "CADocument") {
          arr_ca.push(doc.data());
        } else {
          arr.push(doc.data());
        }
      });
    } catch (error) {
      console.log(error);
    }
    //setUserDocsarr(arr);
    setCADocsarr(arr_ca);
    setType("CA");
    //console.log(arr)
  };
  const handleShare = async (docId) => {
    var accessToken3 = userAccessToken();
    console.log(accessToken3);
    console.log(docId);
    try {
      const response = await fetch(
        `https://client-hive.onrender.com/api/user/document/${docId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken3}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            admin_id: parseInt(adminId),
          }),
        }
      );
      const data = await response.json();
      alert("Document Shared Successfully with " + admin.display_name);
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
  // bg-[url('/accounting.png')]
  return (
    <div className="w-screen h-screen flex flex-col bg-fixed bg-center bg-no-repeat ">
      <nav className="bg-[#eaf3fa]">
        <div className="w-full px-12 h-[5rem] align-middle flex flex-wrap items-center justify-between font-myfont mx-auto">
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
              <li className="flex rounded-md py-2 gap-3">
                <Image
                  src={user?.photoURL}
                  referrerPolicy="no-referrer"
                  className="rounded-full shadow-md"
                  alt=""
                  width={50}
                  height={50}
                />
                <p className="text-lg font-sans font-semibold ml-2">
                  {user?.displayName}
                  <span className="block text-xs font-serif font-normal">
                    {user?.email}
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
      <div></div>
      <div className="flex px-10 flex-row gap-4 items-center ">
        {documents == true && (
          <div className="flex flex-col align-middle">
            <div>
              <button
                className="bg-[#f69440] w-[16rem] font-myfont font-normal h-16 align-center my-4 rounded-2xl"
                onClick={returnDocs}
              >
                Get Documents uploaded by You
              </button>
            </div>
            <div>
              <button
                className="bg-[#f69440] w-[16rem] font-myfont font-normal h-16 align-center my-4 rounded-2xl"
                onClick={returnDocs_CA}
              >
                Get Documents uploaded by CA
              </button>
            </div>
            <div className="flex flex-col">
              <input type="file" onChange={handleChange} />
              <button
                className="bg-[#f69440] w-[16rem] font-myfont font-normal h-10 align-center my-4 rounded-2xl"
                onClick={handleFileUpload}
              >
                Upload
              </button>

            </div>
          </div>
        )}
        {appointment == true && <AppointmentBooking adminId={adminId} />}
        <div className="flex ml-10 mt-4 flex-row">
          {type === "User" && (
            <div className="flex flex-col gap-4">
              {Userdocsarr.map((doc) => (
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
          {type === "CA" && (
            <div className="flex flex-col gap-4">
              {CAdocsarr.map((doc) => (
                <Link href={doc.url} key={doc.id}>
                  <div className="bg-[#e4edfa] rounded-xl border-2 p-4 border-[#3d4868] w-64 flex flex-row">
                    <Image src="/file.png" alt="icon" width={60} height={60} />
                    {doc.name}
                    <Image src="/share.png" alt="icon" width={60} height={60} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
