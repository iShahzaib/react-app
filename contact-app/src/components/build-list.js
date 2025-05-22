import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import ListCard, { ListCardHead } from "./list-card";
import { confirmDelete, sentenceCase, showSuccess, showWarning } from "../contexts/common";
import api from "../api/server";
import { useSchema } from "../contexts/SchemaContext";

const BuildList = React.memo(({ type, origin }) => {
    const { state } = useLocation();  // Access location object to get state
    type = state?.collection?.toLowerCase() || type;

    const [searchTerm, setSearchTerm] = useState("");
    const [redirect, setRedirect] = useState(false);

    const [listData, setListData] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    const { username: loggedInUsername } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

    const retrieveData = useCallback(async () => {
        try {
            setSelectedIds([]);
            // const getData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
            const response = await api.get(`/api/getdocdata?collection=${sentenceCase(type)}`);

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
        setSelectedIds([]); // Clear selections on search term change
    }, [searchTerm]);

    useEffect(() => {
        !loggedInUsername ? setRedirect(true) : retrieveData();
    }, [loggedInUsername, retrieveData]);

    // If redirect is true, navigate to login
    if (redirect) {
        return <Navigate to="/" replace />;  // <-- This will redirect without remount issues
    }

    const filteredData = listData.filter(data =>
        Object.values(data).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const deleteObjects = async (_ids) => {
        setListData(prev => prev.filter(item => !_ids.includes(item._id)));
        try {
            await api.post(`/api/deletedocdata`, { data: { _ids }, collection: sentenceCase(type) });
        } catch (err) {
            console.error("Error deleting objects:", err);
        }
    };

    const allIds = filteredData.map(item => item._id);
    const isAllSelected = selectedIds.length === allIds.length && allIds.length > 0;

    const toggleSelectAll = () => {
        isAllSelected ? setSelectedIds([]) : setSelectedIds(allIds);
    };

    const toggleSelectOne = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(_id => _id !== id) : [...prev, id]
        );
    };

    return (
        <div className="ui main container">
            <HeaderNav
                type={type}
                filteredData={filteredData}
                loggedInUsername={loggedInUsername}
                origin={origin}
            />
            <SearchBar
                type={type}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                retrieveData={retrieveData}
                deleteObjects={deleteObjects}
            />
            <GridTable
                type={type}
                filteredData={filteredData}
                loggedInUsername={loggedInUsername}
                deleteObjects={deleteObjects}
                isAllSelected={isAllSelected}
                toggleSelectAll={toggleSelectAll}
                toggleSelectOne={toggleSelectOne}
                selectedIds={selectedIds}
            />
        </div >
    );
});

const GridTable = (props) => {
    const { type, filteredData, loggedInUsername, deleteObjects, isAllSelected, toggleSelectAll, toggleSelectOne, selectedIds } = props;

    return (
        <div className="table-wrapper">
            <table className="ui celled table" style={{ border: "unset" }}>
                <ListCardHead
                    type={type}
                    isAllSelected={isAllSelected}
                    toggleSelectAll={toggleSelectAll}
                />
                <tbody>
                    {filteredData.length > 0
                        ? filteredData.map(c => (
                            <ListCard
                                key={c._id}
                                data={c}
                                type={type}
                                loggedInUsername={loggedInUsername}
                                isSelected={selectedIds.includes(c._id)}
                                toggleSelectOne={() => toggleSelectOne(c._id)}
                                deleteHandler={deleteObjects}
                            />

                        ))
                        : (<tr><td colSpan="100%" style={{ textAlign: "center" }}>No record found</td></tr>)
                    }
                </tbody>
            </table>
        </div>
    )
};

const HeaderNav = ({ type, filteredData, loggedInUsername, origin }) => {
    const { schemaList } = useSchema();
    const tab = schemaList[type];
    const tableHeader = tab?.tableName || `${sentenceCase(type)} List`;

    return (
        <div className={`responsive-header ${origin === 'welcome' ? 'form-header' : ''}`}>
            <h2 style={{ marginBottom: "0.5rem" }}>
                {tableHeader}
                <div style={{ fontSize: "0.9rem", color: "#555", fontWeight: "500" }}>
                    {filteredData.length > 0 ? `${filteredData.length} Record${filteredData.length > 1 ? "s" : ""}` : "No record found"}
                </div>
            </h2>
            <div className="grid-button">
                {type !== 'user' && (
                    <Link to="/add" state={{ loggedInUsername, type }}>
                        <button className="ui button blue">Add {sentenceCase(type)}</button>
                    </Link>
                )}
                {origin !== 'welcome' && origin !== 'detail' && (
                    <Link to={`/welcome/${loggedInUsername}`}>
                        <button className="ui button close-btn"><i className="close icon red" /></button>
                    </Link>
                )}
            </div>
        </div>
    )
};

const SearchBar = (props) => {
    const { schemaList } = useSchema();
    const { type, searchTerm, setSearchTerm, selectedIds, setSelectedIds, retrieveData, deleteObjects } = props;

    const inputSearch = useRef('');
    const tab = schemaList[type];

    const handleRefresh = () => {
        setSelectedIds([]);
        setSearchTerm('');
        inputSearch.current.value = '';
        retrieveData();
    }

    const handleBulkDelete = () => {
        if (selectedIds.length > 0) {
            confirmDelete(`Do you want to delete selected items?`).then((result) => {
                if (result.isConfirmed) {
                    deleteObjects(selectedIds);

                    showSuccess(`${sentenceCase(type)}s have been deleted successfully.`, 'Deleted!');

                    setSelectedIds([]);
                }
            });
        } else {
            showWarning('No records selected for deletion!');
        }
    };

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

            {!tab?.IsShowActionButtons && (<button
                className="prompt delete-button"
                onClick={handleBulkDelete}
                style={{ padding: ".67857143em 0.76em", color: "#00000080" }}
            >
                <i className="trash icon red" style={{ margin: 0 }}></i>
            </button>)}
        </div>
    )
};

export default BuildList;