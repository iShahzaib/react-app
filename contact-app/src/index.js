import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SchemaProvider } from './contexts/SchemaContext';
// import { AuthProvider } from './contexts/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  // <AuthProvider>
  //   <App />
  // </AuthProvider>
  <SchemaProvider>
    <App />
  </SchemaProvider>
);