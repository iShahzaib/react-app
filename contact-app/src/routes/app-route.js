import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import HomePage, { HomePageHeader, Welcome } from '../login/welcome';
import { BuildFormData } from '../components/form-data';
import Detail from '../components/detail';
import BuildList from '../components/build-list';
// import DeletePopup from '../components/delete-popup';
import UpdateRouter from './update-router';
import ChatComponent from '../components/messaging/chat';
import MyProfile, { ManageTags, ManageUsers } from '../login/my-profile';
import api from '../api/server';
import { useSchema } from '../contexts/SchemaContext';

const AuthRoutes = () => {
    const { setSchemaList } = useSchema();
    const [loading, setLoading] = useState(true);

    const { username } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

    const [activeIndex, setActiveIndex] = useState(0);
    const [tabs, setTabs] = useState([
        {
            tab: 'Welcome',
            component:
                <div className="custom-tab-content">
                    <Welcome username={username} />
                </div>,
            id: 'welcome',
            closeable: false
        }
    ]);

    useEffect(() => {
        (async () => {
            try {
                const response = await api.get(`/api/getdocdata?collection=Schema`);
                const sortedData = response.data?.sort((a, b) => a.label.localeCompare(b.label));

                const schemaObj = Object.fromEntries(sortedData?.map(item => [item.key, item]));
                setSchemaList(schemaObj);
                window['schemaList'] = schemaObj;
            } catch (err) {
                console.error("Failed to load schema", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [setSchemaList]);

    if (loading) {
        return (<div className="ui inline fallback-loader">
            <div className="ui text active loader">Loading...</div>
        </div>);
    }

    const handleAddTab = (label, key) => {
        const id = `${key}`;
        const existingTab = tabs.find(tab => tab.id === id);

        if (existingTab) {
            setActiveIndex(tabs.findIndex(tab => tab.id === id));
            return;
        }

        const newTab = {
            tab: label,
            component:
                <div className="custom-tab-content">
                    <BuildList type={key} origin="welcome" />
                </div>,
            id,
            closeable: true
        };
        setTabs(prev => [...prev, newTab]);
        setActiveIndex(tabs.length);
    };

    const handleCloseTab = (id) => {
        const tabIndexToClose = tabs.findIndex(tab => tab.id === id);
        if (tabIndexToClose < 0) return;

        const newTabs = tabs.filter(tab => tab.id !== id);

        const newActiveIndex = tabIndexToClose < activeIndex
            ? activeIndex - 1
            : tabIndexToClose === activeIndex
                ? Math.min(activeIndex, newTabs.length - 1)
                : activeIndex;

        setTabs(newTabs);
        setActiveIndex(newActiveIndex);

        return false;
    };

    const handleClickTab = (id, newIndex) => {
        setActiveIndex(newIndex);
    };

    return (
        <Routes>
            <Route element={<PrivateLayout handleAddTab={handleAddTab} />}>
                <Route path='/myprofile/:username' element={<MyProfile />} />
                <Route path='/managetags/:username' element={<ManageTags />} />
                <Route path='/manageusers/:username' element={<ManageUsers />} />
                <Route path='/welcome/:username' element={
                    <HomePage
                        tabs={tabs}
                        activeIndex={activeIndex}
                        handleClickTab={handleClickTab}
                        handleCloseTab={handleCloseTab}
                    />
                } />
                <Route path="/chat" element={<ChatComponent />} />
                {/* <Route path='/delete/:id' element={<DeletePopup deleteContact={deleteContact} />} /> */}
                <Route path='/getalldata/:collection' element={<BuildList />} />
                <Route path='/add' element={<BuildFormData mode="add" />} />
                <Route path='/detail/:type/:_id' element={<Detail />} />
                <Route path="/update/:type/:_id" element={<UpdateRouter mode="update" />} />

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Route>
        </Routes>
    )
};

const PrivateLayout = (props) => {
    return (
        <>
            <HomePageHeader {...props} />
            <Outlet />
        </>
    );
};

export default AuthRoutes;