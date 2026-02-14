import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ProfileProvider } from './context/AppContext';
import "./styles/variables.css"; 
import "./styles/button.module.css";
import "./styles/inputs.module.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProfileProvider>
      <App />
    </ProfileProvider>
  </React.StrictMode>
);