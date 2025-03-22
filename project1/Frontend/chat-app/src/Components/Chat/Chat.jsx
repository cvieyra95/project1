import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import "./Chat.css";
import Emoji from  "emoji-picker-react"

export const Chat = () => {
    const { user } = useContext(UserContext)
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [ws, setWs] = useState(null)
    const [showEmoji, setShowEmoji] = useState(false)
    const [file, setFile] = useState(null)

    useEffect(() => {
        if (user?.username) {
            const socket = new WebSocket("ws://localhost:8080")

            socket.onopen = () => {
                console.log("connected")
                socket.send(user.username) 
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

            if (data.fileContent) { 
                setMessages((prev) => [...prev, {
                    sender: data.sender,
                    fileName: data.fileName,
                    fileType: data.fileType,
                    fileContent: data.fileContent
            }]);
            } else if (data.message) {
                setMessages((prev) => [...prev, {
                    sender: data.sender,
                    message: data.message
            }]);
        }
            } catch (error) {
                console.error("Error parsing message:", error);
                }
            };

            socket.onclose = () => console.log("Disconnected from WebSocket server")

            setWs(socket)

            return () => {
                socket.close()
            }
        }
    }, [user])

    const handleEmoji = (emojiObject) => {
        setMessage((prevMessage) => prevMessage + emojiObject.emoji)
    }
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent default Enter key behavior (new line)
            sendMessage();
        }
    };

    const sendMessage = () => {
        if (message && typeof message === "string" && message.trim()) {
            const messageData = { sender: user.username, message } 
            ws.send(JSON.stringify(messageData));
            setMessages((prev) => [...prev, {sender: user.username, message}])
            setMessage("");
        }
        else if (file) {
            // Handle file message
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const fileData = {
                    sender: user.username,
                    fileName: file.name,
                    fileType: file.type,
                    fileContent: reader.result // Base64 encoding
                };
                ws.send(JSON.stringify(fileData));
                setMessages((prev) => [...prev, fileData]);
                setFile(null);
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error);
            };
    };
}

    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className= {`message ${msg.sender === user.username? "sent" : "received" }`}>
                        <strong>{msg.sender}:</strong> 
                        {msg.fileContent ?  
                        (
                        msg.fileType.startsWith("image/") ? (<img src={msg.fileContent} alt={msg.fileName} style={{ maxWidth: "250px", maxHeight: "250px" }}/>)
                        :
                        (< a href={`data:${msg.fileType};base64,${msg.fileContent}`} download={msg.fileName}> File {msg.fileName}</a>) 
                        )
                        : 
                        (`${msg.message}`)} 
                    </div>
                ))}
            </div>
            <div className="emojiwindow">
                {showEmoji && <Emoji onEmojiClick={handleEmoji}/>}
                </div>
            <div className="chat-input">
                <button className="emojibutton" onClick={() => setShowEmoji(!showEmoji)}>😀</button>
                <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    onKeyDown={handleKeyPress}
                />
                <input type ="file" onChange={(e) => setFile(e.target.files[0])}/>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
