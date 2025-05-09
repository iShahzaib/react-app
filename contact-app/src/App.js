import React from 'react';
import { BrowserRouter } from 'react-router-dom';
// import { v4 as uuidv4 } from 'uuid';
import './App.css';
import api from './api/server';
import Header from './components/header';
import { showError, showSuccess, showWarning } from './contexts/common';
import AppRoutes from './routes/app-route';

function App() {
  // const LOCAL_STORAGE_KEY = 'contacts';
  // const [contacts, setContacts] = useState(() => {
  //   const savedContacts = localStorage.getItem(LOCAL_STORAGE_KEY);
  //   return savedContacts ? JSON.parse(savedContacts) : [];
  // });

  // useEffect(() => {
  //   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
  // }, [contacts]);

  const handleLogin = async ({ email, password, navigate }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/noauth/login`, {
        method: "POST",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const res = await response.json();

      if (res?.message === 'success' && res.user) {
        const { username } = res.user;

        localStorage.setItem('token', res.token);
        localStorage.setItem('loggedInUser', JSON.stringify(res.user)); // <-- Save login
        localStorage.setItem('isAuthenticated', 'true'); // (optional)

        const response = await api.get(`/api/getdocdata?collection=Schema`);
        localStorage.setItem("tabItems", JSON.stringify(response.data));

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
        <AppRoutes handleLogin={handleLogin} handleRegistration={handleRegistration} />
      </BrowserRouter>
    </div>
  );
}

export default App;