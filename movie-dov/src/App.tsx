import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Home from "./components/Home"
import ErrorBoundary from './components/ErrorBoundary';
import { Routes, Route, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"



function App() {
    return (
    <>
      <Analytics/>
      <SpeedInsights/>
      <ErrorBoundary fallback={<div>Something went wrong!</div>}>
        <Home />
        <Routes>
          <Route path="/" element={null} />
          <Route path="/:type/:id/:title/" element={null} />
          <Route path="/:type/id/:title/:season/:episode" element={null} />


        </Routes>
      </ErrorBoundary>
    </>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
