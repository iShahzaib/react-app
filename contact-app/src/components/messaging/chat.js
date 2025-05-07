import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import user from '../../images/nouser.jpg';
import socketClient from '../../api/socket';
import api from '../../api/server';
import MessageContainer, { ChatInput } from './message-container';
import { showError, showSuccess } from '../../contexts/common';

const ChatComponent = () => {
    const { state } = useLocation();
    const { username, loggedInUsername, profilepicture } = state || {};

    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);

    const chatBoxRef = useRef(null);

    useEffect(() => {
        const fetchPreviousChats = async () => {
            try {
                const response = await api.get(`/api/getchats`, {
                    params: { participants: [username, loggedInUsername] }
                });

                const getData = response.data;
                if (getData?.length) setChat(getData);

            } catch (err) {
                console.error('Error fetching chat history:', err);
            }
        };

        fetchPreviousChats();
    }, [username, loggedInUsername]);


    useEffect(() => {
        const handleReceiveMessage = (chats) => { setChat((prev) => [...prev, chats]); };

        socketClient.on('receive_message', handleReceiveMessage);

        return () => { socketClient.off('receive_message', handleReceiveMessage); };
    }, []);

    useEffect(() => {
        const handleDeleteMessage = (res) => {
            if (res.message) {
                showError(res.message || 'Something went wrong.');
            } else {
                setChat((prev) => prev.filter(chat => chat._id !== res));
                showSuccess(`The message has been deleted successfully.`, 'Deleted!');
            }
        };

        socketClient.on('delete_message', handleDeleteMessage);

        return () => {
            socketClient.off('delete_message', handleDeleteMessage);
        };
    }, []);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [chat]);

    const deleteMessage = useCallback((_id) => {
        if (_id) {
            socketClient.emit('delete_message', { _id });
        } else {
            showError(`Something wen wrong, message id is missing.`);
        }
    }, []);

    if (!username) {
        return <Navigate to="/users" replace />;
    }

    const sendMessage = () => {
        if (message.trim() === '') return;

        const params = { 'text': message, 'sender': username, 'receiver': loggedInUsername, 'timestamp': new Date().toISOString() };
        socketClient.emit('send_message', params);

        setMessage('');
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <div className="avatar-container">
                    <img className="chat-avatar" src={profilepicture || user} alt="user" />
                    <span className="status-dot online"></span>
                </div>
                <h2 className="chat-username">{username}</h2>
                <div className="responsive-button">
                    <Link to={`/users`}>
                        <button className="ui button">Back</button>
                    </Link>
                </div>
            </div>
            <div className="chat-box" ref={chatBoxRef}>
                {chat.map((msg) => (
                    <MessageContainer
                        key={msg._id}
                        message={msg}
                        username={username}
                        onDelete={deleteMessage}
                    />
                ))}
            </div>
            <ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </div>
    );
};

export default ChatComponent;