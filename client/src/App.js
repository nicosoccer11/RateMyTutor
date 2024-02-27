import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './navbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Components/Login/Login';
import './App.css'
import { ChakraProvider, theme}  from "@chakra-ui/react"

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("user");
    if (username) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <ChakraProvider theme={theme}>
      {isLoggedIn ? <Navbar setIsLoggedIn={setIsLoggedIn} /> : <Login onLogin={() => setIsLoggedIn(true)} />}
    </ChakraProvider>
  );
}

export default App;