import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { v4 as uuidv4 } from 'uuid';
import './App.css';
import { MainPage } from './components/header';
import { showError, showSuccess, showWarning } from './contexts/common';
import NoauthRoutes from './routes/noauth-route';

const App = () => {
  // const LOCAL_STORAGE_KEY = 'contacts';
  // const [contacts, setContacts] = useState(() => {
  //   const savedContacts = localStorage.getItem(LOCAL_STORAGE_KEY);
  //   return savedContacts ? JSON.parse(savedContacts) : [];
  // });

  // useEffect(() => {
  //   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
  // }, [contacts]);

  // useEffect(() => {
  //   const ua = navigator.userAgent || navigator.vendor;
  //   // simple sniff for iPhone X/11/12/13/14 series
  //   const isiOS = /iPhone/.test(ua) && !window.MSStream;
  //   const hasNotch = window.screen.height >= 812; // X and newer
  //   if (isiOS && hasNotch) {
  //     // set a CSS var to use in your styles
  //     document.documentElement.style.setProperty('--safe-area-top', '60px');
  //   } else {
  //     document.documentElement.style.setProperty('--safe-area-top', '0px');
  //   }
  // }, []);

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

        showSuccess(`Login successful!`);
        setTimeout(() => {
          window.location.href = `/welcome/${username}`;
        }, 200);
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
    <div className='ui'>
      <Router>
        <Suspense fallback={
          <div className="ui inline fallback-loader">
            <div className="ui text active loader">Loading...</div>
          </div>
        }>
          <Routes>
            <Route path='/' element={<MainPage />} />
            <Route path="*" element={<NoauthRoutes handleLogin={handleLogin} handleRegistration={handleRegistration} />} />
          </Routes>

        </Suspense>
      </Router>
    </div>
  );
};

export default App;