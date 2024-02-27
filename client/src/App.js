import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './navbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import { ChakraProvider, theme}  from "@chakra-ui/react"

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Navbar />
    </ChakraProvider>
  );
}

export default App;