import { useEffect, useState, useRef } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import user from './../images/nouser.jpg';
import socketClient from '../api/socket';

const ChatComponent = () => {
    const { state } = useLocation();
    const { username, loggedInUsername, profilepicture } = state || {};

    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);

    const chatBoxRef = useRef(null);

    useEffect(() => {
        const handleReceiveMessage = (chats) => { setChat((prev) => [...prev, chats]); };

        socketClient.on('receive_message', handleReceiveMessage);

        return () => { socketClient.off('receive_message', handleReceiveMessage); };
    }, []);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [chat]);

    if (!username) {
        return <Navigate to="/users" replace />;
    }

    const sendMessage = () => {
        if (message.trim() === '') return;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        socketClient.emit('send_message', { text: message, sender: username, timestamp });
        setMessage('');
    };

    const MessageContainer = ({ text, sender, timestamp, index }) => {
        return (
            <div
                key={index}
                className={`message-container ${sender === username ? 'message-right' : 'message-left'}`}
            >
                <div className={`message-bubble ${sender === username ? 'bubble-right' : 'bubble-left'}`}>
                    <div>{text}</div>
                    <div className="timestamp">{timestamp}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                <div className="avatar-container">
                    <img className="chat-avatar" src={profilepicture || user} alt="user" />
                    <span className="status-dot online"></span>
                </div>
                <h2 className="chat-username">{username}</h2>
                <div className="responsive-button">
                    <Link to={`/welcome/${loggedInUsername}`}>
                        <button className="ui button">Back</button>
                    </Link>
                </div>
            </div>
            <div className="chat-box" ref={chatBoxRef}>
                {chat.map((msg, index) => (
                    <MessageContainer text={msg.text} sender={msg.sender} timestamp={msg.timestamp} index={index} />
                ))}
            </div>
            <div className="input-container">
                <input
                    className="chat-input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                />
                <button className="send-button" onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatComponent;