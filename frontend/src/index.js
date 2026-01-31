import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // This loads our Tailwind directives

// Connecting React to the 'root' div in public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <App />
);