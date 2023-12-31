import React from 'react';
import ReactDOM from 'react-dom/client';
import { StateContext } from './utils/StateContext';

import App from './App.js';

import './index.scss';

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <StateContext>
      <App />
    </StateContext>
  </React.StrictMode>
);