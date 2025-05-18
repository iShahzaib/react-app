import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Welcome from '../login/welcome';
import AddData from '../components/add-data';
import Detail from '../components/detail';
import BuildList from '../components/build-list';
// import DeletePopup from '../components/delete-popup';
import UpdateRouter from './update-router';
import ChatComponent from '../components/messaging/chat';
import MyProfile from '../login/my-profile';
import api from '../api/server';
import { useSchema } from '../contexts/SchemaContext';

const AuthRoutes = () => {
    const [records, setRecords] = useState([]);
    const [users, setUsers] = useState([]);
    const { setSchemaList } = useSchema();

    useEffect(() => {
        (async () => {
            const response = await api.get(`/api/getdocdata?collection=Schema`);
            const schemaObj = Object.fromEntries(response.data?.map(item => [item.key, item]));
            setSchemaList(schemaObj);
            window['schemaList'] = schemaObj;
        })();
    }, [setSchemaList]);

    return (
        <Routes>
            <Route path='/myprofile/:username' element={<MyProfile />} />
            <Route path='/welcome/:username' element={<Welcome />} />
            <Route path="/chat" element={<ChatComponent />} />
            {/* <Route path='/delete/:id' element={<DeletePopup deleteContact={deleteContact} />} /> */}
            <Route path='/getalldata/:collection' element={<BuildList />} />
            <Route path='/add' element={<AddData records={records} setRecords={setRecords} />} />
            <Route path='/detail/:type/:_id' element={<Detail />} />
            <Route path="/update/:type/:_id" element={<UpdateRouter records={records} setRecords={setRecords} users={users} setUsers={setUsers} />} />

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
};

export default AuthRoutes;