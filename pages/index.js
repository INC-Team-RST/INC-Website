import React, { useEffect, useState } from "react";
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
import { useRouter } from "next/router";
import { IoLogOut } from "react-icons/io5";
import Image from "next/image";
import firebase from "firebase/app";
import { firebaseApp } from "../firebase-config";
import "firebase/firestore";
import {db} from "../firebase-config";
import { getFirestore, collection, addDoc, query, where, doc, getDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref,getDownloadURL, uploadBytesResumable} from "firebase/storage";
import {setDoc} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Index = () => {
  const router = useRouter();
  const file =useState("")
  const [user, setUser] = useState(null);
  const storage = getStorage();

  const auth = getAuth();

  useEffect(() => {
    const accessToken = userAccessToken();
    if (!accessToken) return router.push("/login");
    const [userInfo] = fetchUser();
    //console.log(userInfo);
    setUser(userInfo);
  }, []);
  
  const handleFileUpload = async (event) => {
    const Filereference=ref(storage,`images/${event.target.files[0].name}`);
    const uploadTask = uploadBytesResumable(Filereference, file);
uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        console.log(error);
      }, 
      () => {
        var path = `users/${auth.currentUser.uid}/documents`;
        console.log(path);
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) =>  {
          await addDoc(collection(db,path), {
            name :  event.target.files[0].name,
            Type:"UserDocument",
            url : downloadURL,
            createdAt: Timestamp.now(),
            
        });
  });
  })};
  const getDocs = async () => {
  
  }
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
    <button className="bg-yellow-400" onClick={getDocs}>
      get docs

    </button>
    </div>
  );
};

export default Index;