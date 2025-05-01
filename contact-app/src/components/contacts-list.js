import React, { useState, useRef, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import ContactCard from "./contact-card";
import api from './../api/contact'

const ContactList = (props) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [redirect, setRedirect] = useState(false);
    const { contacts, setContacts } = props;
    const inputSearch = useRef('');

    const username = localStorage.getItem("loggedInUser");

    useEffect(() => {
        if (!username) {
            setRedirect(true);
        } else if (!contacts?.length) {
            // const getContact = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
            const retrieveContacts = async () => {
                const response = await api.get('/contact');
                const getContact = response.data;
                if (getContact) setContacts(getContact);
            };
            retrieveContacts();
        }
    }, [username, contacts, setContacts]);

    if (redirect) {
        return <Navigate to="/" replace />;  // <-- This will redirect without remount issues
    }

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
        || contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteContact = async (contactID) => {
        const response = await api.delete(`/contact/${contactID}`);
        if (response?.data) {
            setContacts(contacts.filter(c => c.id !== response?.data.id));
            // deleteContact={contactID => setContacts(contacts.filter(c => c.id !== contactID))}
        }
    }

    const renderContactList = filteredContacts.map(c => {
        return (
            <ContactCard
                key={c.id}
                contact={c}
                deleteHandler={id => deleteContact(id)}
            />
        )
    })
    return (
        <div className="ui main" style={{ padding: "2rem" }}>
            <h2>Contact List
                <Link to={`/welcome/${username}`} state={{ username }}>
                    <button className="ui button right floated" style={{ marginLeft: "0.5rem" }}>Back to User</button>
                </Link>
                <Link to={'/add'}>
                    <button className="ui button blue right floated">Add Contact</button>
                </Link>
            </h2>
            <div className="ui search">
                <div className="ui icon input" style={{ width: "100%" }}>
                    <input
                        ref={inputSearch}
                        type="text"
                        placeholder="Search Contacts"
                        className="prompt"
                        value={searchTerm}
                        onChange={() => setSearchTerm(inputSearch.current.value)}
                    // onChange={e => setSearchTerm(e.target.value)}
                    />
                    <i className="search icon"></i>
                </div>
            </div>
            <div className="ui celled list">
                {renderContactList.length > 0 ? renderContactList : 'No record found'}
            </div>
        </div>
    );
}

export default ContactList;