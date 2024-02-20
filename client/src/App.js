import React from 'react';
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom';
import NavbarComp from './Components/Navbar';
import Home from './Components/Home';
import Messages from './Components/Messages';
import Friends from './Components/Friends';
import Profile from './Components/Profile';

function App() {
  return (
    <BrowserRouter>
      <div>
        <NavbarComp/>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;