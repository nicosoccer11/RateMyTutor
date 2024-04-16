import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Components/Home/Home';
import Friends from './Components/Friends/Friends';
import Profile from './Components/User/Profile';
import Chat from './Components/Messages/Chat';
import Schedule from './Components/Schedule/Schedule';
import { ChakraProvider, theme } from '@chakra-ui/react';
import Search from './Components/Search/Search';
import "./navbar.css"



function NavbarComp({ setIsLoggedIn }) {

    return (
        <Router>
            <Navbar expand="lg" className="bg-blur" sticky="top">
                <Navbar.Brand as={Link} to="/" className="ms-auto">
                    <img
                        alt=""
                        src="/images/logo.png"
                        width="50"
                        height="50"
                        className="d-inline-block align-top"
                    />{' '}
                    RateMyTutor
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/home">
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link} to="/friends">
                            Friends
                        </Nav.Link>
                        <Nav.Link as={Link} to="/profile">
                            Profile
                        </Nav.Link>
                        <Nav.Link as={Link} to="/search">
                            Search
                        </Nav.Link>
                        <Nav.Link as={Link} to="/schedule">
                            Schedule
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>


            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route path='/home' element={<Home />} />
                <Route path='/friends/*' element={<ChakraProvider theme={theme} resetCSS={false}> <Friends /> </ChakraProvider>} />
                <Route path='/profile' element={<Profile setIsLoggedIn={setIsLoggedIn}/>} />
                <Route path="/profile/:id" element={<Profile setIsLoggedIn={setIsLoggedIn}/>} />
                <Route path='/messages' element={<ChakraProvider theme={theme} resetCSS={false}> <Chat /> </ChakraProvider>} />
                <Route path='/search/*' element={<Search />} />
                <Route path='/messages/:id' element={<ChakraProvider theme={theme} resetCSS={false}> <Chat /> </ChakraProvider>} />
                <Route path='/schedule' element={<Schedule />} />
            </Routes>
        </Router>
    );
}

export default NavbarComp;
