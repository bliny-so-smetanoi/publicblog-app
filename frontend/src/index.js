import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import 'react-notifications/lib/notifications.css';

ReactDOM.render(
  <React.StrictMode>
      <NotificationContainer/>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

