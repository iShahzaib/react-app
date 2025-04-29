import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App, { Car, Counter, Garage, MyForm, Timer } from './App';
import reportWebVitals from './reportWebVitals';
import Component1 from './UseContext';

// const x = 10;

// const myFirstElement = <><h1>{(x) < 10 ? "Hello" : "Goodbye"}</h1><Garage cars={['Ford', 'BMW', 'Audi']}/></>;

const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
// root.render(myFirstElement);
// root.render(<Counter />);
root.render(<Component1 />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
