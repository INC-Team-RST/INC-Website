import React from "react";
import { FcGoogle } from "react-icons/fc";
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
import Image from "next/image";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../firebase-config";
import { useRouter } from "next/router";
import { getFirestore, collection, addDoc, query, where, doc, setDoc, getDoc, Timestamp} from "firebase/firestore";
import {db} from "../firebase-config";
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
    console.log(userInfo);

    await setDoc(doc(db, "Users", user.uid), {
      caId: "NbHg6ADkRUgzqLO7C2uPqDRQgiZ2",
      isCA: false,
      displayName: userInfo.displayName,
      email: userInfo.email,
      photoURL: userInfo.photoURL,
      lastMessage: Timestamp.now(),
      phoneNumber:"",
      uid:user.uid
    });

    router.push("/");
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-4 bg-[#eaf3fa] relative px-10 pb-28">
      <div className="flex flex-col font-myfont font-bold text-[#2c458e] w-1/2 items-center justify-center ">
        
        <Image src="/accounting.png" width={1000} height={500} alt="image"/>
        <div className="text-[3rem] font-extrabold">Cloud Accounting</div>
        <div className="text-[#fa9746] font-normal text-[2rem] items-center text-center">Managing & Securing <span className="text-[#3d4868]"> efficient end-to-end</span> CA-client interaction</div>
      </div>
      
      <div
        className="flex justify-center w-1/2 my-2 items-center border border-gray-300 p-2 bg-white bg-opacity-60 
                    rounded-full cursor-pointer hover:shadow-md hover:bg-opacity-100 duration-150 ease-in-out z-10"
        onClick={signIn}
      >
        <FcGoogle fontSize={30} />
        <p className="text-lg font-semibold ml-4">Sign in with Google</p>
      </div>
    </div>
  );
};

export default Login;