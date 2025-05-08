import React, { useState, useEffect, useRef } from 'react';
import { confirmDelete } from '../../contexts/common';

const MessageContainer = React.memo(({ message, username, onDelete }) => {
    const { _id, text, sender, timestamp } = message;
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const popupRef = useRef();
    const touchTimeoutRef = useRef();

    const formattedTime = new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    const openMenu = (x, y) => {
        document.dispatchEvent(new CustomEvent('closeAllMenus'));

        // if (sender === username) {
        setMenuPosition({ x, y });
        setMenuVisible(true);
        // }
    }

    const handleContextMenu = (e) => {
        e.preventDefault();
        openMenu(e.clientX, e.clientY);
    };

    const handleTouchStart = (e) => {
        touchTimeoutRef.current = setTimeout(() => {
            // Trigger the context menu on long press
            openMenu(e.touches[0].clientX, e.touches[0].clientY);
        }, 500); // 500ms delay for long press
    };

    const handleTouchEnd = () => {
        clearTimeout(touchTimeoutRef.current);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleCloseAllMenus = () => setMenuVisible(false);

        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setMenuVisible(false);
            }
        };

        document.addEventListener('closeAllMenus', handleCloseAllMenus);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('closeAllMenus', handleCloseAllMenus);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDelete = () => {
        confirmDelete(`Do you want to delete this message?`).then((result) => {
            if (result.isConfirmed) {
                onDelete(_id);
            }
        });
        setMenuVisible(false);
    };

    return (
        <div className={`message-container ${sender === username ? 'message-right' : 'message-left'}`}>
            <div
                className={`message-bubble ${sender === username ? 'bubble-right' : 'bubble-left'}`}
                onContextMenu={handleContextMenu}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div>{text}</div>
                <div className="timestamp">{formattedTime}</div>
            </div>
            {menuVisible && (
                <div
                    ref={popupRef}
                    className="delete-popup"
                    style={{ top: menuPosition.y, left: menuPosition.x }}
                >
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    );
});

export const ChatInput = ({ message, setMessage, sendMessage }) => (
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
);

export default MessageContainer;