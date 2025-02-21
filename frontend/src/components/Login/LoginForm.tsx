import './LoginForm.css';
import { ReactNode } from 'react';
import { useState } from 'react';
import Axios from 'axios';

interface LoginFormProps {
  children: ReactNode;
}
const LoginForm = ({ children }: LoginFormProps) => {
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');
  const [userDetails, setUserDetails] = useState<string>('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(e.target.value);
  };

  const handlePasswordChnage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserPassword(e.target.value);
  };

  const URL = 'http://localhost:5001/api/users/login';

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const response = await Axios.post(
        URL,
        { email: userEmail, password: userPassword },
        { withCredentials: true }
      );

      console.log('✅ Login Successful:', response.data);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('❌ Login Failed:');
    }
  };
  return (
    <form>
      <input type="email" placeholder="Email" onChange={handleEmailChange} />
      <input
        type="password"
        placeholder="Password"
        onChange={handlePasswordChnage}
      />
      <button onClick={handleSubmit} className="form-btn" type="submit">
        Sign In
      </button>
      <div className="divider-container">
        <span className="divider-text">or</span>
      </div>

      {children}
      <div className="form-register__link">
        <a href="/register">No Account, Sign Up</a>
      </div>
    </form>
  );
};

export default LoginForm;
