import React from 'react';
import ReactDOM from 'react-dom/client';
import AttendanceApp from './App';
import './firebase'; // Firebase 초기화

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AttendanceApp />
  </React.StrictMode>
);
