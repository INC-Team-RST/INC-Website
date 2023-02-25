import React, { useEffect, useState } from "react";
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
import { useRouter } from "next/router";
import { IoLogOut } from "react-icons/io5";
import Image from "next/image";
import firebase from "firebase/app";
import { firebaseApp } from "../firebase-config";
import "firebase/firestore";
import {db} from "../firebase-config";
import { getFirestore, collection, addDoc, query, where, doc, getDoc } from "firebase/firestore";

const Index = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const accessToken = userAccessToken();
    if (!accessToken) return router.push("/login");
    const [userInfo] = fetchUser();
    //console.log(userInfo);
    setUser(userInfo);
  }, []);
  
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const storageRef = storage.ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
  };
  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-slate-100">
      <div className="w-1/3 h-auto p-4 bg-white shadow-md rounded-md flex justify-start items-center relative">
        <IoLogOut
          fontSize={25}
          className="absolute top-3 right-3 cursor-pointer text-gray-600"
          onClick={logout}
        />
        <Image src={user?.photoURL} referrerPolicy="no-referrer" className="rounded-md shadow-md" alt="" width={50} height={50} />
        <p className="text-2xl font-sans font-semibold ml-2">
          {user?.displayName}
          <span className="block text-xs font-serif font-normal">
            {user?.email}
          </span>
        </p>
       
      </div>
      <div>
      <input type="file" onChange={handleFileUpload} />
    </div>
    </div>
  );
};

export default Index;