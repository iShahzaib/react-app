import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import ListCard from "./list-card";
import api from '../api/server';
import { sentenceCase } from "../contexts/common";

const BuildList = React.memo(({ type }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [listData, setListData] = useState([]);
    const inputSearch = useRef('');

    const { username: loggedInUsername } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

    const retrieveData = useCallback(async () => {
        try {
            // const getData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
            const response = await api.get(`/api/getdocdata?collection=${sentenceCase(type)}`);

            const getData = response.data || [];
            setListData(getData);

        } catch (err) {
            console.error("Error fetching data:", err);
        }
    }, [type, setListData]);

    useEffect(() => {
        if (!loggedInUsername) {
            setRedirect(true);
        } else {
            retrieveData();
        }
    }, [loggedInUsername, retrieveData]);

    // If redirect is true, navigate to login
    if (redirect) {
        return <Navigate to="/" replace />;  // <-- This will redirect without remount issues
    }

    const filteredData = listData.filter(data =>
        data.name?.toLowerCase().includes(searchTerm.toLowerCase())
        || data.username?.toLowerCase().includes(searchTerm.toLowerCase())
        || data.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteObject = async (_id) => {
        setListData(listData.filter(c => c._id !== _id));
        try {
            await api.post(`/api/deletedocdata`, {
                data: { _id },
                collection: sentenceCase(type)
            });
        } catch (err) {
            console.error("Error deleting object:", err);
        }
    };

    const renderList = filteredData.map(c => (
        <ListCard
            key={c._id}
            data={c}
            type={type}
            loggedInUsername={loggedInUsername}
            deleteHandler={_id => deleteObject(_id)}
        />
    ));

    return (
        <div className="ui main" style={{ padding: "2rem" }}>
            <div className="responsive-header">
                <h2 style={{ marginBottom: "0.5rem" }}>
                    {sentenceCase(type)} List
                    <div style={{ fontSize: "0.9rem", color: "#555", fontWeight: "500" }}>
                        {filteredData.length > 0 ? `${filteredData.length} Item${filteredData.length > 1 ? "s" : ""}` : "No record found"}
                    </div>
                </h2>
                <div className="responsive-button">
                    {type !== 'user'
                        ? (<Link to="/add" state={{ loggedInUsername, type }}>
                            <button className="ui button blue">Add {sentenceCase(type)}</button>
                        </Link>)
                        : (<Link to={`/welcome/${loggedInUsername}`}>
                            <button className="ui button">Back</button>
                        </Link>)
                    }
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
                <button className="prompt refresh-button" onClick={retrieveData} style={{ padding: ".67857143em 0.76em" }}>
                    <i className="refresh icon" style={{ margin: 0 }}></i>
                </button>
            </div>
            <div className="ui celled list">
                {renderList.length > 0 ? renderList : 'No record found'}
            </div>
        </div>
    );
});

export default BuildList;