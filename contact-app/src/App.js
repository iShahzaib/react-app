import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import Swal from 'sweetalert2';

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

      if (data.length > 0) {
        const { id, username, email, profilepicture } = data[0];
        localStorage.setItem('isAuthenticated', 'true'); // (optional)
        localStorage.setItem('loggedInUser', JSON.stringify(data[0])); // <-- Save login

        navigate(`/welcome/${username}`, { state: { id, username, email, profilepicture } });
      } else {
        Swal.fire('Warning!', 'Invalid username or password.', 'warning');

      }
    } catch (error) {
      Swal.fire('Error!', 'Login error. Please try again.', 'error');
      console.error('Login error:', error);
    }
  }

  const handleRegistration = ({ username, password, email, profilepicture }) => {
    fetch(`${process.env.REACT_APP_JSON_SERVER_PATH}/user`, {
      method: "POST",
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: uuidv4(), username, password, email, profilepicture })
    }).then(res => {
      Swal.fire('Success!', 'Registration has been completed successfully.', 'success');
    }).catch(err => {
      Swal.fire('Error!', 'Registration failed.', 'error');
      console.log(err);
    })
  }

  return (
    <div className='ui container'>
      <BrowserRouter>
        <Header />
        <div style={{ marginTop: "70px" }}></div>

        <Routes>
          <Route path='/' element={<Main />} />

          <Route path='/contacts' element={<ContactList contacts={contacts} setContacts={setContacts} />} />

          <Route
            path='/add'
            element={
              <AddContact
                addContactHandler={async (contact) => {
                  const newContact = { id: uuidv4(), ...contact };
                  setContacts([...contacts, newContact]);

                  Swal.fire('Success!', 'Contact has been added successfully.', 'success');

                  api.post('/contact', newContact);
                }}
              />
            }
          />

          <Route path='/contact/:id' element={<ContactDetail contacts={contacts} />} />

          <Route
            path='/update/:id'
            element={
              <UpdateContact
                updateContactHandler={(updatedContact) => {
                  const updatedContactList = contacts.map((c) => c.id === updatedContact.id ? updatedContact : c);
                  setContacts(updatedContactList);

                  Swal.fire('Success!', 'Contact has been updated successfully.', 'success');

                  api.put(`/contact/${updatedContact.id}`, updatedContact);
                }}
              />
            }
          />

          {/* <Route path='/delete/:id' element={<DeletePopup deleteContact={deleteContact} />} /> */}

          <Route path='/login' element={<LoginForm loginHandler={handleLogin} />} />

          <Route path='/registration' element={<RegistrationForm registrationHandler={handleRegistration} />} />

          <Route path='/welcome/:username' element={<Welcome />} />

          <Route path='/users' element={<UserList users={users} setUsers={setUsers} />} />

          {/* Redirect all unmatched routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;