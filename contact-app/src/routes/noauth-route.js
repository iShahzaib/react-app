import React, { lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
// import DeletePopup from '../components/delete-popup';
import LoginForm from '../login/login-form';
import RegistrationForm from '../login/registration-form';
import Header from '../components/header';

const AuthRoutes = lazy(() => import('../routes/app-route'));  // Lazy load

// const ProtectedRoute = ({ children }) => localStorage.getItem('token') ? children : <Navigate to="/login" />;

const NoauthRoutes = ({ handleLogin, handleRegistration }) => (
    <Routes>
        <Route element={<PublicLayout />}>
            <Route path='/login' element={<LoginForm loginHandler={handleLogin} />} />
            <Route path='/register' element={<RegistrationForm registrationHandler={handleRegistration} />} />
        </Route>

        {localStorage.getItem('token')
            ? (<Route path="/*" element={<AuthRoutes />} />)
            : (<Route path="*" element={<Navigate to="/" replace />} />)    // Redirect all unmatched routes to home
        }
        {/* <Route path='/welcome/:username' element={<ProtectedRoute> <HomePage /> </ProtectedRoute>} /> */}
    </Routes>
);

const PublicLayout = () => (
    <>
        <Header /><Outlet />
    </>
);

export default NoauthRoutes;