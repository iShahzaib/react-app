import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { v4 as uuidv4 } from 'uuid';
import './App.css';
import Header, { Main } from './components/header';
import AddData from './components/add-contact';
import ContactDetail from './components/contact-detail';
import BuildList from './components/build-list';
// import DeletePopup from './components/delete-popup';
import api from './api/server';
import LoginForm from './login/login-form';
import RegistrationForm from './login/registration-form';
import Welcome from './login/welcome';
import UpdateRouter from './routes/update-router';
import { showError, showSuccess, showWarning } from './contexts/common';
import ChatComponent from './components/messaging/chat';

function App() {
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);

  // const LOCAL_STORAGE_KEY = 'contacts';
  // const [contacts, setContacts] = useState(() => {
  //   const savedContacts = localStorage.getItem(LOCAL_STORAGE_KEY);
  //   return savedContacts ? JSON.parse(savedContacts) : [];
  // });

  // useEffect(() => {
  //   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
  // }, [contacts]);

  const handleLogin = async ({ username, password, navigate }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/noauth/login`, {
        method: "POST",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const res = await response.json();

      if (res?.message === 'success' && res.user) {
        const { username } = res.user;

        localStorage.setItem('token', res.token);
        localStorage.setItem('loggedInUser', JSON.stringify(res.user)); // <-- Save login
        localStorage.setItem('isAuthenticated', 'true'); // (optional)

        showSuccess(`Login successful!`);

        navigate(`/welcome/${username}`);
      } else {
        showWarning(res.message || 'Invalid username or password.');
      }
    } catch (error) {
      showError('Login error. Please try again.');
      console.error('Login error:', error);
    }
  }

  const handleRegistration = async ({ username, password, email, profilepicture }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/noauth/register`, {
        method: "POST",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password, email, profilepicture })
      });

      const res = await response.json();

      if (res?.message === 'success') {
        showSuccess('Registration has been completed successfully.');
        return 'success';
      } else {
        showError(res?.message || 'This email already exists.');
        return 'failed';
      }
    } catch (error) {
      showError('Registration failed.');
      console.log(error);
      return 'failed';
    }
  }

  return (
    <div className='ui container'>
      <BrowserRouter>
        <Header />
        <div className='extra-gap'></div>

        <Routes>
          <Route path='/' element={<Main />} />

          <Route path='/contacts' element={<BuildList listData={contacts} setListData={setContacts} type='contact' />} />

          <Route
            path='/add'
            element={
              <AddData
                addContactHandler={async (newContact, type) => {
                  // const newContact = { id: uuidv4(), ...contact };
                  const response = await api.post(`/api/adddocdata`, {
                    data: newContact,
                    collection: type
                  });

                  if (response?.data?.insertedId) {
                    setContacts([...contacts, newContact]);

                    showSuccess(`${type} has been added successfully.`);
                    return 'success';
                  } else {
                    showError('This email already exists.');
                    return 'failed';
                  }
                }}
              />
            }
          />

          <Route path='/contact/:_id' element={<ContactDetail contacts={contacts} />} />

          <Route
            path="/update/:type/:_id"
            element={
              <UpdateRouter
                contacts={contacts}
                setContacts={setContacts}
                users={users}
                setUsers={setUsers}
              />
            }
          />

          {/* <Route path='/delete/:id' element={<DeletePopup deleteContact={deleteContact} />} /> */}

          <Route path='/login' element={<LoginForm loginHandler={handleLogin} />} />

          <Route path='/register' element={<RegistrationForm registrationHandler={handleRegistration} />} />

          <Route path='/welcome/:username' element={<Welcome />} />

          <Route path='/users' element={<BuildList listData={users} setListData={setUsers} type='user' />} />

          <Route path="/chat" element={<ChatComponent />} />

          {/* Redirect all unmatched routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;