import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import "./Chat.css";
import Emoji from  "emoji-picker-react"
import CryptoJS from 'crypto-js'

export const Chat = () => {
    const { user } = useContext(UserContext)
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [ws, setWs] = useState(null)
    const [showEmoji, setShowEmoji] = useState(false)
    const [file, setFile] = useState(null)
    const [activeChats, setActiveChats] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)
    const [newChatUser, setNewChatUser] = useState("")
    const [chatMessages, setChatMessages] = useState({})

    const KEY = "1924143"

    useEffect(() => {
        if (user?.username) {
            const socket = new WebSocket("wss://websocket-server-production-731d.up.railway.app")

            socket.onopen = () => {
                console.log("connected")
                socket.send(user.username) 
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if(data.message){
                        data.message = decryptMsg(data.message)
                    }

                    setChatMessages((prevMessages) => {
                        const chatKey = data.sender
                        return{
                            ...prevMessages, [chatKey]: [...(prevMessages[chatKey] || []), data]
                        }
                    })

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
            event.preventDefault();
            sendMessage();
        }
    };
    const startNewChat = () => {
        if (newChatUser.trim() && !activeChats.includes(newChatUser)) {
            setActiveChats([...activeChats, newChatUser]);
        }
        setSelectedChat(newChatUser);
        setMessages([])
        setNewChatUser(""); 
    };
    const handleChatSelect = chatUser => {
        setSelectedChat(chatUser)
    }
    const sendMessage = () => {
        if (message && selectedChat && typeof message === "string" && message.trim()) {
            const encryptedMsg = encryptMsg(message)
            const messageData = { sender: user.username, recipient: selectedChat, message:encryptedMsg } 
            ws.send(JSON.stringify(messageData));
            setChatMessages((prevMessages) => ({
                ...prevMessages, [selectedChat]: [...(prevMessages[selectedChat] || []), {...messageData, message:decryptMsg(encryptedMsg)}]
            }))
            setMessage("")
        }
        else if (file) {
            // Handle file message
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const fileData = {
                    sender: user.username,
                    recipient: selectedChat,
                    fileName: file.name,
                    fileType: file.type,
                    fileContent: reader.result // Base64 encoding
                };
                ws.send(JSON.stringify(fileData));
                setChatMessages((prevMessages) => ({
                    ...prevMessages, [selectedChat]: [...(prevMessages[selectedChat] || []),fileData]
                }))
                setFile(null);
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error);
            };
    };
}
const encryptMsg = (message) => {
    return CryptoJS.AES.encrypt(message, KEY).toString()
}

const decryptMsg = (encryptedMsg) => {
    const bytes = CryptoJS.AES.decrypt(encryptedMsg, KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
}


    return (
        <div className="site">
            <div className="chatlist">
                <div className="welcome">Hello, {user.username}</div>
                
                <div className="new-chat">
                    <input
                        type="text"
                        placeholder="Enter username..."
                        value={newChatUser}
                        onChange={(e) => setNewChatUser(e.target.value)}
                    />
                    <button onClick={startNewChat}>Start Chat</button>
                </div>
                {activeChats.map((chatUser) => (
                    <div
                        key={chatUser}
                        onClick={() => {setSelectedChat(chatUser); setMessages([])}}
                        className={selectedChat === chatUser ? "active-chat" : ""}
                    >
                        {chatUser}
                    </div>
                ))}
            </div>
        <div className="chat-container">
            
            <div className="chat-box">
                {(chatMessages[selectedChat] || []).map((msg, index) => (
                    <div key={index} className= {`message ${msg.sender === user.username? "sent" : "received" }`}>
                        <strong>{msg.sender}: </strong> 
                        {msg.fileContent ?  
                        (
                        msg.fileType.startsWith("image/") ? (<img src={msg.fileContent} alt={msg.fileName} style={{ maxWidth: "250px", maxHeight: "250px" }}/>)
                        :
                        (< a href={`data:${msg.fileType};base64,${msg.fileContent}`} download={msg.fileName}>file{msg.fileName}</a>) 
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
        </div>
        
    );
};

export default Chat;
