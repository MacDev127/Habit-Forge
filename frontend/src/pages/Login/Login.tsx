import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext/AuthContext';
import LoginForm from '../../components/Login/LoginForm';
import './Login.css'; // Import the CSS styles
import logo from '../../assets/images/logo.png';

const Login = () => {
  const auth = useContext(AuthContext);
  if (!auth) return null;

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Welcome to</h1>
        <img src={logo} alt="" />

        <p>Let's get started</p>
      </div>

      <div className="login-right">
        <h2>Log In</h2>
        <p>Please enter your details to continue.</p>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
