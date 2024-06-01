import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:8080";

const Chat = () => {
  const socket = io.connect(ENDPOINT);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");

  const joinRoom = useCallback(() => {
    if (room !== "") {
      socket.emit("joinRoom", room);
    }
  }, [room, socket]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((messages) => [...messages, data.message]);
    });
  }, [socket]);

  const sendMessage = useCallback(() => {
    socket.emit("sendMessage", { room, message });
    setMessage("");
  }, [socket, room, message]);

  return (
    <div className="chatbot">
      <div className="roomInput">
        <label htmlFor="room">Room: </label>
        <input
          name="room"
          type="text"
          value={room}
          size="3"
          onChange={(e) => setRoom(e.target.value)}
        />
        <button className="defaultButton" onClick={joinRoom}>
          Join Room
        </button>
      </div>
      <div className="messagesCard">
        {messages.map((msg, index) => {
          const classNameText =
            index % 2 === 0 ? "messageText" : "messageText alt";
          return (
            <p className={classNameText} key={index}>
              {msg}
            </p>
          );
        })}
      </div>

      <div className="messageCard">
        <textarea
          className="messageInput"
          name="message"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="defaultButton" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
