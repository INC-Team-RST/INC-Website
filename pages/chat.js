import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL, { transports: ["websocket"] });

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server!");
    });

    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      const data = {
        type: "message",
        user_id: 1, // Replace with the actual user ID
        admin_id: 2, // Replace with the actual admin ID
        message: inputMessage.trim(),
      };
      socket.emit("message", data);
      setInputMessage("");
    }
  };

  return (
    <div>
      <div ref={chatContainerRef} style={{ height: "300px", overflowY: "scroll" }}>
        {messages.map((message) => (
          <div key={message.id}>
            {message.user_id === 1 ? "You: " : "Admin: "}
            {message.message}
          </div>
        ))}
      </div>
      <div className="bgcolor: red;">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}
