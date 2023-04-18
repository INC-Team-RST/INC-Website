import React, { useEffect, useState } from "react";
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
import { useRouter } from "next/router";
import { IoLogOut } from "react-icons/io5";
import Image from "next/image";
import firebase from "firebase/app";
import Link from "next/link";
import { firebaseApp } from "../firebase-config";
import "firebase/firestore";
import { db } from "../firebase-config";
import Navbar from "../components/Navbar";
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

  const [user, setUser] = useState(null);
  const storage = getStorage();
  const [CAdocsarr, setCADocsarr] = useState([]);
  const [Userdocsarr, setUserDocsarr] = useState([]);

  const auth = getAuth();

  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  useEffect(() => {
    const accessToken = userAccessToken();
    if (!accessToken) return router.push("/login");
    const [userInfo] = fetchUser();
    //console.log(userInfo);
    setUser(userInfo);
  },[]);

  const handleFileUpload =  (event) => {
    const Filereference = ref(storage, `Documents/${file.name}`);
    const uploadTask =  uploadBytesResumable(Filereference, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
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
          await addDoc(collection(db, path), {
            name: file.name,
            Type: "UserDocument",
            url: downloadURL,
            createdAt: Timestamp.now(),
          });
        });
      }
    );
  };
  const returnDocs = async () => {
    try {
      var path = `Users/${auth.currentUser.uid}/Documents`;
      var arr = [];
      var arr_ca = [];
      const querySnapshot = await getDocs(collection(db, path));
      console.log("Rohan");
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data()['url']);
        if (doc.data()["Type"] == "UserDocument") {
          arr.push(doc.data());
        } else {
          arr_ca.push(doc.data());
        }
      });
    } catch (error) {
      console.log(error);
    }
    setUserDocsarr(arr);
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
  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-fixed bg-center bg-no-repeat bg-[url('/accounting.png')]">
     <Navbar photoURL={user?.photoURL} displayName={user?.displayName} email={user?.email}/>

      <div className="flex px-10 flex-row gap-4 ">
        <div className="flex flex-col ">
          <div>
            <button className="bg-[#f69440] w-[16rem] font-myfont font-normal h-16 align-center my-4 rounded-2xl" onClick={returnDocs}>
              Get Documents uploaded by You
            </button>

          </div>
          <div>
            <button className="bg-[#f69440] w-[16rem] font-myfont font-normal h-16 align-center my-4 rounded-2xl" onClick={returnDocs_CA}>
              Get Documents uploaded by CA
            </button>
          </div>
          <div className="flex flex-col">
            <input type="file" onChange={handleChange} />
            <button className="bg-[#f69440] w-[16rem] font-myfont font-normal h-10 align-center my-4 rounded-2xl" onClick={handleFileUpload}>Upload</button>
          </div>
        </div>

        <div className="flex ml-10 mt-4 flex-row">
          {type==="User" && <div className="flex flex-col gap-4">
            {Userdocsarr.map((doc) => (
              <Link href={doc.url} key={doc.id}>
                <div className="bg-[#e4edfa] rounded-xl border-2 gap-4 p-4 border-[#3d4868] w-64 flex flex-row" >
                  <Image src="/file.png" alt="icon" width={60} height={60} />
                  {doc.name}
                </div>
              </Link>
            ))}
          </div>}
          {type==="CA" && <div className="flex flex-col gap-4">
            {CAdocsarr.map((doc) => (
              <Link href={doc.url} key={doc.id}>
                <div className="bg-[#e4edfa] rounded-xl border-2 p-4 border-[#3d4868] w-64 flex flex-row" >
                  <Image src="/file.png" alt="icon" width={60} height={60} />
                  {doc.name}
                </div>
              </Link>
            ))}
          </div>}
        </div>
      

      </div>
    </div>
  );
};

export default Index;
