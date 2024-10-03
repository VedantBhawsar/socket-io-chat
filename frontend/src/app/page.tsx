"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      setTransport("N/A");
    });

    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("chat message");
    };
  }, []);

  function handleClick() {
    if (!userName.trim()) {
      toast.error("please enter username", {
        style: {
          borderRadius: "10px",
        },
      });
      return;
    }
    if (!message.trim()) {
      toast.error("please enter message", {
        style: {
          borderRadius: "10px",
        },
      });
      return;
    }
    socket.emit("chat message", { user: userName, text: message });
    setMessage("");
  }

  function handleSetUserName() {
    const name = prompt("Enter your username:");
    if (name) {
      setUserName(name);
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Toaster />
      <nav className="bg-gray-800 text-white h-16 flex items-center px-5">
        <h1 className="font-bold text-xl">Socket.IO Chat</h1>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-sm">
            <span className="font-semibold">
              Status:{" "}
              <span className={isConnected ? "text-green-400" : "text-red-400"}>
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </span>
            <span className="ml-4">
              Transport: <span className="font-normal">{transport}</span>
            </span>
          </div>
          <button
            onClick={handleSetUserName}
            className="ml-auto bg-blue-500 text-white px-4 py-2 text-xs rounded-lg hover:bg-blue-600 transition duration-200"
          >
            {userName ? userName : "Set Username"}
          </button>
        </div>
      </nav>

      <div className="flex-grow overflow-auto p-5 bg-gray-100">
        <ul className="flex flex-col gap-3">
          {messages.map((msg, index) => (
            <li
              key={index}
              className="p-3 bg-white rounded-lg shadow-sm border border-gray-300"
            >
              {/* @ts-ignore */}
              <strong>{msg?.user}: </strong>
              {/* @ts-ignore */}
              {msg?.text}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-200 p-4 flex items-center">
        <input
          type="text"
          name="message"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow border border-gray-300 p-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type your message..."
        />
        <button
          onClick={handleClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
}
