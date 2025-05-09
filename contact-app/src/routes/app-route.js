import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AddData from '../components/add-data';
import Detail from '../components/detail';
import BuildList from '../components/build-list';
// import DeletePopup from '../components/delete-popup';
import LoginForm from '../login/login-form';
import RegistrationForm from '../login/registration-form';
import Welcome from '../login/welcome';
import UpdateRouter from '../routes/update-router';
import ChatComponent from '../components/messaging/chat';
import { Main } from '../components/header';

const AppRoutes = ({ handleLogin, handleRegistration }) => {
    const [contacts, setContacts] = useState([]);
    const [users, setUsers] = useState([]);

    return (
        <Routes>
            <Route path="*" element={<Navigate to="/" replace />} />    {/* Redirect all unmatched routes to home */}
            <Route path='/' element={<Main />} />
            <Route path='/contacts' element={<BuildList type='contact' />} />
            <Route path='/add' element={<AddData contacts={contacts} setContacts={setContacts} />} />
            <Route path='/detail/:type/:_id' element={<Detail />} />
            <Route path="/update/:type/:_id" element={<UpdateRouter contacts={contacts} setContacts={setContacts} users={users} setUsers={setUsers} />} />
            {/* <Route path='/delete/:id' element={<DeletePopup deleteContact={deleteContact} />} /> */}
            <Route path='/login' element={<LoginForm loginHandler={handleLogin} />} />
            <Route path='/register' element={<RegistrationForm registrationHandler={handleRegistration} />} />
            <Route path='/welcome/:username' element={<Welcome />} />
            <Route path='/users' element={<BuildList type='user' />} />
            <Route path="/chat" element={<ChatComponent />} />
        </Routes>
    )
};

export default AppRoutes;