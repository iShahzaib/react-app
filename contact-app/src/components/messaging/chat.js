import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import user from '../../images/nouser.jpg';
import socketClient from '../../api/socket';
import api from '../../api/server';
import MessageContainer, { ChatInput } from './message-container';
import { displayLabel, sentenceCase, showError, showSuccess } from '../../contexts/common';
import { useSchema } from '../../contexts/SchemaContext';
import { defaultFields } from '../../constant';

export const BuildChatList = React.memo(({ type, origin }) => {
    const { state } = useLocation();  // Access location object to get state
    type = state?.collection?.toLowerCase() || type;
    const { schemaList } = useSchema();

    const [searchTerm, setSearchTerm] = useState("");
    const [redirect, setRedirect] = useState(false);

    const [listData, setListData] = useState([]);

    const { username: loggedInUsername } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

    const retrieveData = useCallback(async () => {
        try {
            const response = await api.get(`/api/getdocdata?collection=${type === 'chat' ? 'User' : sentenceCase(type)}`);

            const getData = response.data || [];
            const sortedData = getData.sort((a, b) =>
                new Date(b.createdAt || parseInt(b._id.toString().substring(0, 8), 16) * 1000) -
                new Date(a.createdAt || parseInt(a._id.toString().substring(0, 8), 16) * 1000)
            );

            setListData(sortedData);

        } catch (err) {
            console.error("Error fetching data:", err);
        }
    }, [type, setListData]);

    useEffect(() => {
        !loggedInUsername ? setRedirect(true) : retrieveData();
    }, [loggedInUsername, retrieveData]);

    // If redirect is true, navigate to login
    if (redirect) {
        return <Navigate to="/" replace />;  // <-- This will redirect without remount issues
    }

    const schema = schemaList[type];
    const fields = schema?.fields || defaultFields;

    const filteredData = listData.filter(rowData =>
        fields.some(field => {
            if (field.ispicture || field.notshowongrid) return false;
            const value = rowData[field.name];

            if (typeof value === 'boolean') {
                const boolText = value ? 'yes' : 'no';
                return boolText.includes(searchTerm.toLowerCase());
            }
            if (Array.isArray(value)) {
                return value.join(' ').toLowerCase().includes(searchTerm.toLowerCase());
            }

            return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
    );

    return (
        <div className="ui main container">
            <div className={`responsive-header ${origin === 'welcome' ? 'form-header' : ''}`}>
                <h1 style={{ marginBottom: "0.5rem" }}>
                    {schema?.tableName || `${sentenceCase(type)} List`}
                    <div style={{ fontSize: "0.9rem", color: "#555", fontWeight: "500" }}>
                        {filteredData.length > 0 ? `${filteredData.length} Entr${filteredData.length > 1 ? "ies" : "y"}` : "No entry found"}
                    </div>
                </h1>
            </div>

            <ChatSearchBar
                type={type}
                tab={schema}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                retrieveData={retrieveData}
            />

            <div className="chat-list-wrapper">
                <ul className="chat-list">
                    {filteredData.length > 0
                        ? filteredData.map((c) => (
                            <ChatListCard
                                key={c._id}
                                fields={fields}
                                rowData={c}
                                type={type}
                            />
                        ))
                        : <div className="no-data">No entry found</div>
                    }
                </ul>
            </div>
        </div>
    );
});

const ChatSearchBar = (props) => {
    const { type, searchTerm, setSearchTerm, retrieveData } = props;

    const inputSearch = useRef('');

    const handleRefresh = () => {
        setSearchTerm('');
        inputSearch.current.value = '';
        retrieveData();
    }

    return (
        <div className="ui search search-container">
            <div className="ui icon input search-input">
                <input
                    ref={inputSearch}
                    type="text"
                    placeholder={`Search ${sentenceCase(type)}s`}
                    className="prompt"
                    value={searchTerm}
                    onChange={() => setSearchTerm(inputSearch.current.value)}
                />
                {searchTerm
                    ? (<i
                        className="close icon"
                        style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                        onClick={() => {
                            setSearchTerm('');
                            inputSearch.current.value = '';
                        }}
                    />)
                    : (<i className="search icon"></i>)
                }
            </div>

            <button
                className="prompt refresh-button"
                onClick={handleRefresh}
                style={{ padding: ".67857143em 0.76em", color: "#00000080" }}
            >
                <i className="refresh icon" style={{ margin: 0 }}></i>
            </button>
        </div>
    )
};

const ChatListCard = (props) => {
    const { fields, rowData, type } = props;
    const { _id, profilepicture } = rowData;
    const navigate = useNavigate();

    const loggedInUser = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

    const state = type !== 'chat' ? { data: rowData, loggedInUsername: loggedInUser.username } : { receiverInfo: rowData, senderInfo: loggedInUser };
    const linkPath = type !== 'chat' ? `/detail/${type}/${_id}` : '/chat';

    return (
        <li className="chat-item">
            <div className="chat-card">
                {fields.some(field => field.ispicture) &&
                    <div className="chat-avatar">
                        <img className="ui avatar image" src={profilepicture || user} alt="user" />
                    </div>
                }
                {fields.map(field => {
                    if (field.ispicture || field.notshowongrid) return null;
                    const fieldValue = displayLabel(field, rowData);

                    return (
                        <div className="chat-details" onClick={() => navigate(linkPath, { state })}>
                            <div className='chat-list-header' key={field.name} style={{ display: "flex" }} title={fieldValue || ''}>
                                <div className='chat-user'>{fieldValue || '—'}</div>
                                <div className='chat-last-time'>Yesterday</div>
                            </div>
                            <div className='chat-last-text'>The quick brown fox jumps over the lazy dog.</div>
                        </div>
                    )
                })}
            </div>
        </li>
    );
};

const ChatComponent = () => {
    const { state } = useLocation();
    const { receiverInfo, senderInfo } = state || {};
    const { username: loggedInUsername } = senderInfo;
    const { username, profilepicture } = receiverInfo;

    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);

    const navigate = useNavigate();
    const chatBoxRef = useRef(null);

    useEffect(() => {
        const fetchPreviousChats = async () => {
            try {
                const response = await api.get(`/api/getchats`, { params: { participants: [username, loggedInUsername] } });

                const getData = response.data || [];
                setChat(getData);

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
        return <Navigate to="/getalldata/User" state={{ collection: 'User' }} replace />;
    }

    const sendMessage = () => {
        if (message.trim() === '') return;

        const params = { 'text': message, 'sender': username, 'receiver': loggedInUsername, 'timestamp': new Date().toISOString() };
        socketClient.emit('send_message', params);

        setMessage('');
    };

    return (
        <div className="ui container chat-container">
            <div className="chat-header">
                <div className="avatar-container">
                    <img className="chat-avatar-box" src={profilepicture || user} alt="user" />
                    <span className="status-dot online"></span>
                </div>
                <h2 className="chat-username">{username}</h2>
                <div className="responsive-button">
                    {/* <Link to={`/welcome/${loggedInUsername}`}>
                        <button className="ui button close-btn"><i className="close icon red" /></button>
                    </Link> */}
                    <button className="ui button close-btn" onClick={() => navigate(-1)}>
                        <i className="close icon red" />
                    </button>
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