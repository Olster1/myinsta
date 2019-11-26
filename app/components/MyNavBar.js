import React from 'react'
import {
  Link
} from "react-router-dom";


import { LinkContainer } from 'react-router-bootstrap' 

import { Navbar, Nav } from 'react-bootstrap';

/*
We use LinkContainer to use react-router <Link to='/'>, but we want bootstrap styling to apply to the links

*/

const MyNavBar = ({ loggedIn, logout }) => {
  let loginLink = <LinkContainer  to='/login'><Nav.Link>Login</Nav.Link></LinkContainer>
  let registerLink = <LinkContainer  to='/register'><Nav.Link>Register</Nav.Link></LinkContainer>
  let logoutLink = false;
  let checkoutLink = false;
  let plansLink = false;
  let profileLink = false;

  if(loggedIn) {
    loginLink = false;
    registerLink = false;
    logoutLink = <Nav.Link onClick={ logout } >Logout</Nav.Link>
    checkoutLink=  <LinkContainer  to='/checkout'><Nav.Link>Checkout</Nav.Link></LinkContainer>
    plansLink = <LinkContainer  to='/plans'><Nav.Link>My Plans</Nav.Link></LinkContainer>
    profileLink = <LinkContainer  to='/profile'><Nav.Link>Profile</Nav.Link></LinkContainer>
  }

  return (
    <Navbar bg="light" expand="lg">
      <LinkContainer  to='/'><Navbar.Brand><img src='/learnityHQLogo.png' width='300' className="d-inline-block align-top" alt='logo'/></Navbar.Brand></LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
        <LinkContainer  to='/'><Nav.Link>Home</Nav.Link></LinkContainer>
        { loginLink }
        { registerLink }
        { plansLink }
        { checkoutLink }
        { profileLink }
        
        { logoutLink } 
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default MyNavBar;