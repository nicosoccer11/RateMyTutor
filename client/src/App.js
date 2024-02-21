import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './navbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
        <Navbar />
      <h1>React App</h1>
    </div>
  );
}

export default App;