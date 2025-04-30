import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import Header, { Main } from './components/header';
import AddContact from './components/add-contact';
import UpdateContact from './components/update-contact';
import ContactDetail from './components/contact-detail';
import ContactList from './components/contacts-list';
// import DeletePopup from './components/delete-popup';
import api from './api/contact'
import LoginForm from './login/login-form';
import RegistrationForm from './login/registration-form';
import Welcome from './login/welcome';
import UserList from './login/users-list';

function App() {
  const [contacts, setContacts] = useState([]);

  // const LOCAL_STORAGE_KEY = 'contacts';
  // const [contacts, setContacts] = useState(() => {
  //   const savedContacts = localStorage.getItem(LOCAL_STORAGE_KEY);
  //   return savedContacts ? JSON.parse(savedContacts) : [];
  // });

  useEffect(() => {
    // const getContact = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    const retrieveContacts = async () => {
      const response = await api.get('/contact');
      const getContact = response.data;
      if (getContact) setContacts(getContact);
    };
    retrieveContacts();
  }, []);

  // useEffect(() => {
  //   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
  // }, [contacts]);

  return (
    <div className='ui container'>
      <BrowserRouter>
        <Header />
        <div style={{ marginTop: "70px" }}></div>

        <Routes>
          <Route
            path='/'
            element={
              <Main />
            }
          />
          <Route
            path='/contacts'
            element={
              <ContactList
                contacts={contacts}
                // deleteContact={contactID => setContacts(contacts.filter(c => c.id !== contactID))}
                deleteContact={async (contactID) => {
                  const response = await api.delete(`/contact/${contactID}`);
                  if (response?.data) {
                    setContacts(contacts.filter(c => c.id !== response?.data.id));
                  }
                }}
              />
            }
          />
          <Route
            path='/add'
            element={
              <AddContact
                addContactHandler={async (contact) => {
                  const response = await api.post('/contact', { id: uuidv4(), ...contact });
                  if (response?.data) {
                    setContacts([...contacts, response.data]);
                  }
                }}
              />
            }
          />
          <Route
            path='/contact/:id'
            element={
              <ContactDetail
                contacts={contacts}
              />
            }
          />
          <Route
            path='/update/:id'
            element={
              <UpdateContact
                updateContactHandler={async (updatedContact) => {
                  const response = await api.put(`/contact/${updatedContact.id}`, updatedContact);
                  if (response?.data) {
                    const updatedContactList = contacts.map((c) => c.id === response?.data.id ? response?.data : c);
                    setContacts(updatedContactList);
                  }
                }}
              />
            }
          />
          {/* <Route
            path='/delete/:id'
            element={
              <DeletePopup
                deleteContact={async (contactID) => {
                  const response = await api.delete(`/contact/${contactID}`);
                  if (response?.data) {
                    setContacts(contacts.filter(c => c.id !== response?.data.id));
                  }
                }}
              />
            }
          /> */}
          <Route
            path='/login'
            element={
              <LoginForm
                loginHandler={async ({ username, password, navigate }) => {
                  try {
                    const res = await fetch(`http://localhost:3006/user?username=${username}&password=${password}`);
                    const data = await res.json();

                    if (data.length > 0) {
                      const { username, email, profilepicture } = data[0];
                      localStorage.setItem('isAuthenticated', 'true'); // <-- Save login
                      localStorage.setItem('loggedInUser', username); // (optional)

                      navigate(`/welcome/${username}`, { state: { username, email, profilepicture } });
                    } else {
                      alert('Invalid username or password.');
                    }
                  } catch (error) {
                    console.error('Login error:', error);
                    alert('Login error. Please try again.');
                  }
                }}
              />
            }
          />
          <Route
            path='/registration'
            element={
              <RegistrationForm
                registrationHandler={({ username, password, email, profilepicture }) => {
                  fetch('http://localhost:3006/user', {
                    method: "POST",
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ id: uuidv4(), username, password, email, profilepicture })
                  }).then(res => {
                    alert('Registration successfully.');
                  }).catch(err => {
                    alert(`Registration failed. ${err}`);
                  })
                }}
              />
            }
          />
          <Route path='/welcome/:username' element={<Welcome />} />
          <Route
            path='/users'
            element={
              <UserList
              // users={users}
              // deleteContact={contactID => setContacts(contacts.filter(c => c.id !== contactID))}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;