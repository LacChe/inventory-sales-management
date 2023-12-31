import React, { useState } from 'react';
import Layout from "./components/Layout.js";
import {
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";
import Page1 from './pages/Page1.js';
import Page2 from './pages/Page2.js';

export default function App() {


  return (<>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/page1" element={<Page1 />} />
          <Route path="/page2" element={<Page2 />} />
          <Route path="/" element={<Page1 />} />
        </Route>
      </Routes>
    </HashRouter>
  </>)
}


  /*
  const [num, setNum] = useState(0);
  return (
    <>
      <h1>
          App component
      </h1>
      <button onClick={() => {
        electron.notificationApi.sendNotification(num),
        setNum(prev => prev+1)
      }
      }>
        {num}
      </button>
    </>
  )
*/