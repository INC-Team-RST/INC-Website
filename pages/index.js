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
import TextTransition, { presets } from "react-text-transition";

const TEXTS = [
  "Connect",
  "Collaborate",
  "Communicate",
];


const Login = () => {
  const firebaseAuth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();
  const router = useRouter();

  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const intervalId = setInterval(() =>
      setIndex(index => index + 1),
      1500 // change the intervalId and set the state to the next index after 1500ms
    );
    return () => clearTimeout(intervalId);
  }, []);

  const signIn = async () => {
    const { user } = await signInWithPopup(firebaseAuth, provider);
    const { refreshToken, providerData } = user;
    //console.log(refreshToken, providerData);
    localStorage.setItem("user", JSON.stringify(providerData));
    localStorage.setItem("accessToken", JSON.stringify(refreshToken));
    const [userInfo] = fetchUser();
    // console.log(user);
    // console.log(user.uid);

    const userExists = await fetch('https://client-hive.onrender.com/api/user/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: user.uid
      })
    })
      .then(response =>
        response.json()
      ).then(data => {
        console.log(data.message);
        return data.message;
      })
      .catch(error => {
        console.error('There was an error checking if user exists:', error);
        return true; // Treat as if user exists to prevent POST request
      });

    console.log(userExists)

    if (!userExists) {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photoURL: userInfo.photoURL,
          uid: user.uid,
          email: userInfo.email,
          display_name: userInfo.displayName,
          phone: "",
          token: refreshToken
        })
      };
      fetch('https://client-hive.onrender.com/api/user/add', requestOptions)
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data); // response data from backend
        })
        .catch(error => {
          console.error('There was an error making the request:', error);
        });
    }
    else {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: refreshToken,
          uid: user.uid,
        })
      };
      fetch('https://client-hive.onrender.com/api/user/login', requestOptions)
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

    router.push("/useradmins");

  }

  const adminSignIn = async () => {
    const { user } = await signInWithPopup(firebaseAuth, provider);
    const { refreshToken, providerData } = user;
    //console.log(refreshToken, providerData);
    localStorage.setItem("user", JSON.stringify(providerData));
    localStorage.setItem("accessToken", JSON.stringify(refreshToken));
    const [userInfo] = fetchUser();
    // console.log(user);
    // console.log(user.uid);

    const userExists = await fetch('https://client-hive.onrender.com/api/admin/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: user.uid
      })
    })
      .then(response =>
        response.json()
      ).then(data => {
        console.log(data.message);
        return data.message;
      })
      .catch(error => {
        console.error('There was an error checking if user exists:', error);
        return true; // Treat as if user exists to prevent POST request
      });

    console.log(userExists)

    if (!userExists) {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photoURL: userInfo.photoURL,
          uid: user.uid,
          email: userInfo.email,
          display_name: userInfo.displayName,
          phone: "",
          token: refreshToken
        })
      };
      console.log(refreshToken)
      fetch('https://client-hive.onrender.com/api/admin/add', requestOptions)
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data); // response data from backend
        })
        .catch(error => {
          console.error('There was an error making the request:', error);
        });
      router.push("/adminpage");
    }
    else {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: refreshToken,
          uid: user.uid,
        })
      };
      fetch('https://client-hive.onrender.com/api/admin/login', requestOptions)
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
      router.push("/adminclients");
    }

  };


  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-4 bg-[#eaf3fa] relative px-10 pb-28">
      <div className="flex flex-col font-myfont font-bold text-[#2c458e]  items-center justify-center ">
        <Image src="/accounting.png" width={600} height={190} alt="image" />

        <div className="text-[3rem] items-center font-extrabold justify-center  mb-[-0.5rem] align-middle">ClientHive</div>
        <div className="font-normal text-[2rem] italic text-[#fa9746] mt-[-0.5rem]">Share files, not headaches!</div>



        <div className="text-[#fa9746] flex font-bold text-[2rem] mt-4">
          <div className="flex-1 mr-1">
            <TextTransition springConfig={presets.wobbly}>
              {TEXTS[index % TEXTS.length]}
            </TextTransition>
          </div>
          <div className="font-bold inline-block text-[2rem] ml-2 text-[#2c458e]">
            with your clients seamlessly!
          </div>
        </div>

      </div>
      <div className="flex flex-row gap-4">

        <div
          className="flex justify-center items-center border border-gray-300 p-2 px-4 bg-white bg-opacity-60 
                    rounded-full cursor-pointer hover:shadow-md hover:bg-opacity-100 duration-150 ease-in-out z-10"
          onClick={signIn}
        >
          <FcGoogle fontSize={30} />
          <p className="text-lg font-semibold ml-4">Client Google Sign In</p>
        </div>
        <div
          className="flex justify-center items-center border border-gray-300 p-3 px-4 bg-white bg-opacity-60 
                    rounded-full cursor-pointer hover:shadow-md hover:bg-opacity-100 duration-150 ease-in-out z-10"
          onClick={adminSignIn}
        >
          <FcGoogle fontSize={30} />
          <p className="text-lg font-semibold ml-4">Admin Google Sign In</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
