import React from 'react';
import logo from './logo.svg';
import './App.css';
import Home from "./components/Home"
import ErrorBoundary from './components/ErrorBoundary';
import { Routes, Route, useNavigate } from "react-router-dom";
function App() {
  return (
    <>
      <ErrorBoundary fallback={<div>Something went wrong!</div>}>
        <Routes>
          <Route path="/" element={<Home/>} />
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
