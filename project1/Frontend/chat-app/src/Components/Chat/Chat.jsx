import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import "./Chat.css";

export const Chat = () => {
    const { user } = useContext(UserContext);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        if (user?.username) {
            const socket = new WebSocket("ws://localhost:6789");

            socket.onopen = () => {
                console.log("connected")
                socket.send(user.username); 
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    setMessages((prev) => [...prev, {sender: data.sender, message: data.message}]);
                } catch (error) {
                    console.error("Error parsing message:", error);
                }
            };

            socket.onclose = () => console.log("Disconnected from WebSocket server");

            setWs(socket);

            return () => {
                socket.close();
            };
        }
    }, [user]);

    const sendMessage = () => {
        if (ws && message.trim()) {
            const messageData = { sender: user.username, message }; 
            ws.send(JSON.stringify(messageData));
            setMessages((prev) => [...prev, {sender: user.username, message}])
            setMessage("");
        }
    };

    return (
        <div className="chat-container">
            <h2>Chat Room</h2>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className= {`message ${msg.sender === user.username? "sent" : "received" }`}>
                        <strong>{msg.sender}:</strong> {msg.message}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
