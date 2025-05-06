import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import ListCard from "./list-card";
import api from '../api/server';
import { sentenceCase } from "../contexts/common";

const BuildList = (props) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [redirect, setRedirect] = useState(false);
    const { listData, setListData, type } = props;
    const inputSearch = useRef('');

    const { username: loggedInUsername } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

    const retrieveData = useCallback(async () => {
        // const getData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        const response = await api.get(`/api/getdocdata?collection=${sentenceCase(type)}`);
        const getData = response.data;
        if (getData?.length) setListData(getData);
    }, [type, setListData]);

    useEffect(() => {
        if (!loggedInUsername) {
            setRedirect(true);
        } else if (!listData.length) {
            retrieveData();
        }
    }, [loggedInUsername, listData, retrieveData]);

    // If redirect is true, navigate to login
    if (redirect) {
        return <Navigate to="/" replace />;  // <-- This will redirect without remount issues
    }

    const filteredData = listData.filter(data =>
        data.name?.toLowerCase().includes(searchTerm.toLowerCase())
        || data.username?.toLowerCase().includes(searchTerm.toLowerCase())
        || data.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteObject = (_id) => {
        setListData(listData.filter(c => c._id !== _id));
        // api.delete(`/${type}/${_id}`);
        api.post(`${process.env.REACT_APP_BACKEND_URL}/api/deletedocdata`, {
            data: { _id },
            collection: sentenceCase(type)
        });
        // deleteObject = { _id => setListData(listData.filter(c => c._id !== _id))}
    }

    const renderList = filteredData.map(c => {
        return (
            <ListCard
                key={c._id}
                data={c}
                type={type}
                loggedInUsername={type === 'user' ? loggedInUsername : null}
                deleteHandler={_id => deleteObject(_id)}
            />
        )
    });

    return (
        <div className="ui main" style={{ padding: "2rem" }}>
            <div className="responsive-header">
                <h2 style={{ marginBottom: "0.5rem" }}>{sentenceCase(type)} List</h2>
                <div className="responsive-button">
                    {
                        type === 'contact' && (<Link to={'/add'}>
                            <button className="ui button blue">Add {sentenceCase(type)}</button>
                        </Link>)
                    }
                    <Link to={`/welcome/${loggedInUsername}`}>
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
                <button className="prompt refresh-button" onClick={retrieveData} style={{ padding: ".67857143em 0.76em" }}>
                    <i className="refresh icon" style={{ margin: 0 }}></i>
                </button>
            </div>
            <div className="ui celled list">
                {renderList.length > 0 ? renderList : 'No record found'}
            </div>
        </div>
    );
}

export default BuildList;