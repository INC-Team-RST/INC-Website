import React from 'react';
import io from 'socket.io-client'; // if using sockets for real-time chat


export default function Chat() {
  const [messages, setMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState('');
  const [socket, setSocket] = React.useState(null);

  React.useEffect(() => {
    const newSocket = io('http://localhost:3000'); // replace with your server URL
    setSocket(newSocket);

    newSocket.on('newMessage', (message) => {
      setMessages([...messages, message]);
    });

    return () => newSocket.close();
  }, []);

  const handleSend = () => {
    socket.emit('sendMessage', newMessage);
    setNewMessage('');
  };

  return (
    <div>
      {messages.map((message, i) => (
        <div key={i}>{message}</div>
      ))}
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
