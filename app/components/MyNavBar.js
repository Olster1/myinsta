import React from 'react'
import {
  Link
} from "react-router-dom";

const MyNavBar = ({ loggedIn, logout, login}) => {
  let loginLink = <Link to='/login' onClick={ login } >Login</Link>;
  let registerLink = <Link to='/register'>Register</Link>;
  let logoutLink = false;

  if(loggedIn) {
    loginLink = false;
    registerLink = false;
    logoutLink = <Link to='/' onClick={ logout }>Logout</Link>
  }

  return (
    <nav>
      <Link to='/'>Home</Link>
      { loginLink }
      { registerLink }
      { logoutLink } 
      <Link to='/feed'>Feed</Link>
      <Link to='/post/0'>Single Post</Link>
      <Link to='/profile/0'>Profile</Link>
    </nav>
  );
}

//
// TodoList.propTypes = {
//   todos: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.number.isRequired,
//       completed: PropTypes.bool.isRequired,
//       text: PropTypes.string.isRequired
//     }).isRequired
//   ).isRequired,
//   toggleTodo: PropTypes.func.isRequired
// }

export default MyNavBar;