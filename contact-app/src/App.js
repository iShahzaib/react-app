import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import Header, { Main } from './components/header';
import AddContact from './components/add-contact';
import ContactDetail from './components/contact-detail';
import BuildList from './components/build-list';
// import DeletePopup from './components/delete-popup';
import api from './api/server';
import LoginForm from './login/login-form';
import RegistrationForm from './login/registration-form';
import Welcome from './login/welcome';
import UserList from './login/users-list';
import UpdateRouter from './routes/update-router';
import { checkEmailUnique, showError, showSuccess, showWarning } from './contexts/common';
import ChatComponent from './components/chat';

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
      const res = await fetch(`${process.env.REACT_APP_JSON_SERVER_PATH}/user?username=${username}&password=${password}`);
      const data = await res.json();

      if (data.length === 1 && data[0].password === password) {
        const { username } = data[0];

        delete data[0].password;
        localStorage.setItem('loggedInUser', JSON.stringify(data[0])); // <-- Save login
        localStorage.setItem('isAuthenticated', 'true'); // (optional)

        navigate(`/welcome/${username}`);
      } else {
        showWarning('Invalid username or password.');
      }
    } catch (error) {
      showError('Login error. Please try again.');
      console.error('Login error:', error);
    }
  }

  const handleRegistration = async ({ username, password, email, profilepicture }) => {
    try {
      const isUnique = await checkEmailUnique(email, 'user');

      if (!isUnique) {
        showError('This email already exists.');
        return 'failed';
      }

      const response = await fetch(`${process.env.REACT_APP_JSON_SERVER_PATH}/user`, {
        method: "POST",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: uuidv4(), username, password, email, profilepicture })
      });

      if (response.ok) {
        showSuccess('Registration has been completed successfully.');
        return 'success';
      } else {
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
        <div style={{ marginTop: "70px" }}></div>

        <Routes>
          <Route path='/' element={<Main />} />

          <Route path='/contacts' element={<BuildList contacts={contacts} setContacts={setContacts} />} />

          <Route
            path='/add'
            element={
              <AddContact
                addContactHandler={async (contact) => {
                  const isUnique = await checkEmailUnique(contact.email, 'contact');

                  if (!isUnique) {
                    showError('This email already exists.');
                    return 'failed';
                  }

                  const newContact = { id: uuidv4(), ...contact };
                  setContacts([...contacts, newContact]);

                  showSuccess('Contact has been added successfully.');
                  api.post('/contact', newContact);

                  return 'success';
                }}
              />
            }
          />

          <Route path='/contact/:id' element={<ContactDetail contacts={contacts} />} />

          <Route
            path="/update/:type/:id"
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

          <Route path='/registration' element={<RegistrationForm registrationHandler={handleRegistration} />} />

          <Route path='/welcome/:username' element={<Welcome />} />

          <Route path='/users' element={<UserList users={users} setUsers={setUsers} />} />

          <Route path="/chat" element={<ChatComponent />} />

          {/* Redirect all unmatched routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;