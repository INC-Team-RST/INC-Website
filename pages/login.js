import React from "react";
import { FcGoogle } from "react-icons/fc";
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
import Image from "next/image";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../firebase-config";
import { useRouter } from "next/router";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  doc,
  setDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { getDatabase, ref, set } from "firebase/database";

const Login = () => {
  const firebaseAuth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();
  const router = useRouter();

  const signIn = async () => {
    const { user } = await signInWithPopup(firebaseAuth, provider);
    const { refreshToken, providerData } = user;
    //console.log(refreshToken, providerData);
    localStorage.setItem("user", JSON.stringify(providerData));
    localStorage.setItem("accessToken", JSON.stringify(refreshToken));
    const [userInfo] = fetchUser();
    // console.log(user);
    // console.log(userInfo);

    const userExists = await fetch('https://client-hive.onrender.com/api/user/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: user.uid
      })
    })
    .then(response => {
      console.log(response);
      return response.message;
    })
    .catch(error => {
      console.error('There was an error checking if user exists:', error);
      return true; // Treat as if user exists to prevent POST request
    });
    console.log(userExists)

  if (!userExists) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        photoURL: userInfo.photoURL,
        uid: user.uid,
        email: userInfo.email,
        display_name: userInfo.displayName,
        phone: ""
      })
    };
    fetch('https://client-hive.onrender.com/api/user', requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data); // response data from backend
      })
      .catch(error => {
        console.error('There was an error making the request:', error);
      });
    }

    router.push("/");
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-4 bg-[#eaf3fa] relative px-10 pb-28">
      <div className="flex flex-col font-myfont font-bold text-[#2c458e] w-1/2 items-center justify-center ">
        <Image src="/accounting.png" width={1000} height={500} alt="image" />
        <div className="text-[3rem] font-extrabold">Client Hive</div>
        <div className="text-[#fa9746] font-normal text-[2rem] items-center text-center">
          Managing & Securing{" "}
          <span className="text-[#3d4868]"> efficient end-to-end</span>{" "}
          CA-client interaction
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div
          className="flex justify-center items-center border border-gray-300 p-2 px-4 bg-white bg-opacity-60 
                    rounded-full cursor-pointer hover:shadow-md hover:bg-opacity-100 duration-150 ease-in-out z-10"
          onClick={signIn}
        >
          <FcGoogle fontSize={30} />
          <p className="text-lg font-semibold ml-4">Admin Google Sign In</p>
        </div>
        <div
          className="flex justify-center items-center border border-gray-300 p-2 px-4 bg-white bg-opacity-60 
                    rounded-full cursor-pointer hover:shadow-md hover:bg-opacity-100 duration-150 ease-in-out z-10"
          onClick={signIn}
        >
          <FcGoogle fontSize={30} />
          <p className="text-lg font-semibold ml-4">Client Google Sign In</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
