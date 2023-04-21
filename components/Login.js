import { React, useState, useEffect } from "react";
import { selectIsConnectedToRoom, useHMSActions, useHMSStore } from "@100mslive/react-sdk";
import Room from "./Room";

function Login() {
  

  const endpoint = "your endpoint";
  
  const hmsActions = useHMSActions();
  const [inputValues, setInputValues] = useState("");
  const [selectValues, setSelectValues] = useState("viewer");
  const isConnected = useHMSStore(selectIsConnectedToRoom)


  useEffect(() => {
    window.onunload = () => {
      hmsActions.leave();
    };
  }, [hmsActions]);

  const handleInputChange = (e) => {
    setInputValues(e.target.value);
  };
  const handleSelect = (e) => {
    setSelectValues(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fetchtoken = async () => {
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoyLCJ0eXBlIjoiYXBwIiwiYXBwX2RhdGEiOm51bGwsImFjY2Vzc19rZXkiOiI2NDQyMzUxZTk1ZjE5NGQ1ZTUwOTcxMzEiLCJyb2xlIjoiZ3Vlc3QiLCJyb29tX2lkIjoiNjQ0MjZjODE4ZWQ0NGY0MzJjN2I5NzFjIiwidXNlcl9pZCI6IjczYTU3YzdmLTEwNTYtNDQzMS1iYTNlLTg2ODZjY2FkOGQ5YiIsImV4cCI6MTY4MjE2MjUxOCwianRpIjoiMDgwNGYxMmYtNjQ5MC00NDNkLTgyYWMtMTcyN2JlYTE2YjllIiwiaWF0IjoxNjgyMDc2MTE4LCJpc3MiOiI2NDQyMzUxZTk1ZjE5NGQ1ZTUwOTcxMmYiLCJuYmYiOjE2ODIwNzYxMTgsInN1YiI6ImFwaSJ9.JwAm3jRYUsczNXcK0MQDRPMpRjnXrWEN0minDnJij_s";
    };
    const token = await fetchtoken(inputValues)
    hmsActions.join({
      userName: inputValues,
      authToken: token,
      settings: {
        isAudioMuted: true,
      },
    });
  };

  return (
    <>
    {!isConnected? (

    <div className=" h-screen flex justify-center items-center bg-slate-800">
      <div className=" flex flex-col gap-6 mt-8">
        <input
          type="text"
          placeholder="John Doe"
          value={inputValues}
          onChange={handleInputChange}
          className=" focus:outline-none flex-1 px-2 py-3 rounded-md text-black border-2 border-blue-600"
        />
        <select
          type="text"
          placeholder="Select Role"
          value={selectValues}
          onChange={handleSelect}
          className=" focus:outline-none flex-1 px-2 py-3 rounded-md text-black border-2 border-blue-600"
        >
          <option>stage</option>
          <option>viewer</option>
          </select>
        <button
          className="flex-1 text-white bg-blue-600 py-3 px-10 rounded-md"
          onClick={handleSubmit}
        >
          Join
        </button>
      </div>
    </div>
    ):(
    <Room/>
    )}
    </>
  );
}

export default Login;