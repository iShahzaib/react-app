import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, Navigate } from "react-router-dom";
import ListCard from "./list-card";
import api from '../api/server';
import { sentenceCase } from "../contexts/common";

const BuildList = (props) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [redirect, setRedirect] = useState(false);
    const { contacts, setContacts, type = 'contact' } = props;
    const inputSearch = useRef('');

    const { username } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

    const retrieveData = useCallback(async () => {
        // const getContact = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        const response = await api.get(`/${type}`);
        const getContact = response.data;
        if (getContact) setContacts(getContact);
    }, [type, setContacts]);

    useEffect(() => {
        if (!username) {
            setRedirect(true);
        } else if (!contacts?.length) {
            retrieveData();
        }
    }, [username, contacts, retrieveData]);

    if (redirect) {
        return <Navigate to="/" replace />;  // <-- This will redirect without remount issues
    }

    const filteredData = contacts.filter(data =>
        data.name.toLowerCase().includes(searchTerm.toLowerCase())
        || data.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteObject = (contactID) => {
        setContacts(contacts.filter(c => c.id !== contactID));
        api.delete(`/${type}/${contactID}`);
        // deleteObject = { contactID => setContacts(contacts.filter(c => c.id !== contactID))}
    }

    const renderList = filteredData.map(c => {
        return (
            <ListCard
                key={c.id}
                data={c}
                deleteHandler={id => deleteObject(id)}
            />
        )
    })
    return (
        <div className="ui main" style={{ padding: "2rem" }}>
            <div className="responsive-header">
                <h2 style={{ marginBottom: "0.5rem" }}>{sentenceCase(type)} List</h2>
                <div className="responsive-button">
                    <Link to={'/add'}>
                        <button className="ui button blue">Add {sentenceCase(type)}</button>
                    </Link>
                    <Link to={`/welcome/${username}`}>
                        <button className="ui button">Back</button>
                    </Link>
                </div>
            </div>
            <div className="ui search search-container">
                <div className="ui icon input search-input">
                    <input
                        ref={inputSearch}
                        type="text"
                        placeholder={`Search ${sentenceCase(type)}s`}
                        className="prompt"
                        value={searchTerm}
                        onChange={() => setSearchTerm(inputSearch.current.value)}
                    // onChange={e => setSearchTerm(e.target.value)}
                    />
                    <i className="search icon"></i>
                </div>
                <button className="prompt refresh-button" onClick={retrieveData} style={{ width: "5.75%" }}>
                    <i className="refresh icon" style={{ marginLeft: "-3px" }}></i>
                </button>
            </div>
            <div className="ui celled list">
                {renderList.length > 0 ? renderList : 'No record found'}
            </div>
        </div>
    );
}

export default BuildList;