import React from "react";
import { FcGoogle } from "react-icons/fc";
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
import Image from "next/image";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../firebase-config";
import { useRouter } from "next/router";
import { getFirestore, collection, addDoc, query, where, doc, setDoc, getDoc} from "firebase/firestore";
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

    await setDoc(doc(db, "users", user.uid), {
      displayName: userInfo.displayName,
      email: userInfo.email,
      photoURL: userInfo.photoURL,
      createdAt: user.metadata.creationTime,
    });

    router.push("/");
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-red-300 relative">
      
      <div
        className="flex justify-center items-center border border-gray-300 p-2 bg-white bg-opacity-60 
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