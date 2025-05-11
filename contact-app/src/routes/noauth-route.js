import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import DeletePopup from '../components/delete-popup';
import LoginForm from '../login/login-form';
import RegistrationForm from '../login/registration-form';

const AuthRoutes = lazy(() => import('../routes/app-route'));  // Lazy load

// const ProtectedRoute = ({ children }) => {
//     const isAuthenticated = localStorage.getItem('token');
//     return isAuthenticated ? children : <Navigate to="/login" />;
// };

const NoauthRoutes = ({ handleLogin, handleRegistration }) => (
    <Routes>
        <Route path='/login' element={<LoginForm loginHandler={handleLogin} />} />
        <Route path='/register' element={<RegistrationForm registrationHandler={handleRegistration} />} />

        {localStorage.getItem('token')
            ? (<Route path="/*" element={<AuthRoutes />} />)
            : (<Route path="*" element={<Navigate to="/" replace />} />)    // Redirect all unmatched routes to home
        }
        {/* <Route path='/welcome/:username' element={
            <ProtectedRoute>
                <Welcome />
            </ProtectedRoute>
        } /> */}
    </Routes>
);

export default NoauthRoutes;