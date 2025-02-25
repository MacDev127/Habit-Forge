import { useState } from 'react';
import { Link } from 'react-router-dom';
import './RegisterForm.css';
import axios from 'axios';

const RegisterForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string>('');

  // ✅ Function to validate email format
  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleRegister = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // ✅ Basic field validation
    if (!email || !password || !confirmPassword || !username) {
      setError('All fields are required');
      return;
    }

    // ✅ Email format validation
    if (!isValidEmail(email)) {
      setError('Invalid email format');
      return;
    }

    // ✅ Password length check
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // ✅ Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // ✅ Clear errors before submitting
    setError('');

    try {
      await axios.post(
        'http://localhost:5001/api/users/register',
        { email, password, username },
        { withCredentials: true }
      );
      console.log('User registered successfully');
      window.location.href = '/login';
    } catch (error) {
      console.error('Failed to register');
      setError('Registration failed, please try again');
    }
  };

  return (
    <form>
      <div className="register-input__group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="register-input__group">
        <label>User Name</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="register-input__group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="register-input__group">
        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      {error && <p className="register-error">{error}</p>}{' '}
      {/* ✅ Show errors */}
      <div className="register-input__checkbox">
        <input type="checkbox" id="checkbox" required />
        <label htmlFor="checkbox" className="checkbox-label">
          By clicking on the 'Create Account' button, you agree with, and accept
          all our terms and conditions
        </label>
      </div>
      <button onClick={handleRegister} className="register-btn">
        Create Account
      </button>
      <div className="form-register__link-wrapper">
        <p>Already have an account?</p>
        <Link to="/login" className="form-register__link">
          Sign In
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
