import React, { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import user from '../images/nouser.jpg';
import { defaultFields } from "../constant";
import { BuildDetail, sentenceCase } from "../contexts/common";
import BuildList from "./build-list";
import { useSchema } from "../contexts/SchemaContext";

const Detail = () => {
    const { type } = useParams();
    const { state } = useLocation();  // Access location object to get state
    const { data, loggedInUsername } = state || {};
    const { _id, profilepicture } = data || {};

    const { schemaList } = useSchema();
    const tab = schemaList[type];
    const fields = tab?.fields || defaultFields;

    // const state = type !== 'user' ? { data: props.data } : { _id, username, email, profilepicture, loggedInUsername };
    // const linkPath = type !== 'user' ? `/welcome/${loggedInUsername}` : `/getalldata/${sentenceCase(type)}`;
    const backPath = type === 'user' ? `/welcome/${loggedInUsername}` : `/getalldata/${sentenceCase(type)}`;

    const [activeTab, setActiveTab] = useState('detail');
    const setDataInParams = (tabName) => {
        if (activeTab !== tabName) {
            setActiveTab(tabName);
        }
    };

    const title = tab.isMainTitle
        ? tab.isMainTitle.replace(/\$\{(\w+)\}/g, (_, key) => {
            const value = data?.[key];
            return value !== undefined && value !== null ? value : '';
        })
        : data?.[fields.find(f => f.isTitle)?.name] || data?.name;

    return (
        <div className="ui main container">
            <div className="responsive-header">
                {/* Image Card */}
                <div className="ui card" style={{ padding: '1rem', width: "100%", backgroundColor: "#f3f7ff" }}>
                    <div style={{ display: "flex" }}>
                        <img src={profilepicture || user} alt="user" style={{ width: '80px' }} />
                        <div style={{ marginLeft: '1rem', maxWidth: "65%" }}>
                            <h4>{title}</h4>
                        </div>

                        {/* Action Buttons */}
                        <div className="responsive-button">
                            <Link
                                to={`/update/${type}/${_id}`}
                                state={{ data, location: 'detail', type }}
                            >
                                <button className="ui button blue">Edit</button>
                                {/* onClick={() => props.updateDataHandler(_id)} */}
                            </Link>
                            <Link to={backPath} state={{ type, collection: sentenceCase(type) }}>
                                <button className="ui button close-btn"><i className="close icon red" /></button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="ui segment parent-container" style={{ overflowX: "auto", marginTop: "2rem" }}>
                <ul className="tab-button-group responsive-button">
                    <li>
                        <Link
                            to={`/detail/${type}/${_id}`} state={{ data, loggedInUsername }}
                            className={`tab-button ${activeTab === 'detail' ? "active" : ""}`}
                            style={{ backgroundColor: '#46a1a1' }}
                            onClick={(e) => {
                                e.preventDefault();
                                setDataInParams('detail');
                            }}
                        >
                            Details
                        </Link>
                    </li>
                    {tab?.tabItems?.map(({ name, icon, tabColor, schemaName }) => {
                        const schemaData = schemaList[schemaName] || {};
                        const { key, icon: mainIcon, className } = schemaData;

                        return (
                            <li key={key || schemaName}>
                                <Link
                                    to="#"
                                    className={`tab-button ${className || ""} ${activeTab === (key || schemaName) ? "active" : ""}`}
                                    style={{ backgroundColor: tabColor || '#2185d0' }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setDataInParams(key || schemaName);
                                    }}
                                >
                                    {(icon || mainIcon) && <i className={`${icon || mainIcon} icon`} style={{ marginRight: "0.5rem" }}></i>}
                                    {name}
                                </Link>
                            </li>
                        )
                    })}
                </ul>

                {/* Information Section */}
                <div className="tab-content" style={{ borderTop: "2px solid #22242626", paddingTop: "1rem" }}>
                    {activeTab === 'detail'
                        ? (<div className="detail-tab" style={{ minHeight: "450px", marginTop: "0.25rem" }}>
                            <BuildDetail fields={fields} data={data} />
                        </div>)
                        : <BuildList type={activeTab} origin="detail" />
                    }
                </div>
            </div>
        </div>
    );
};

export default Detail;