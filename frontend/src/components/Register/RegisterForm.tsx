import { useState } from 'react';
import { Link } from 'react-router-dom';
import './RegisterForm.css';
import axios, { AxiosError } from 'axios'; // ✅ Import AxiosError
const RegisterForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [checkbox, setCheckbox] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');

  // Function to validate email format
  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleRegister = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Basic field validation
    if (!email || !password || !confirmPassword || !username) {
      setError('All fields are required');
      return;
    }

    // Email format validation
    if (!isValidEmail(email)) {
      setError('Invalid email format');
      return;
    }

    // Password length check
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check if passwords match
    if (checkbox != true) {
      setError(
        'You must read, agree with, and accept all of the terms and conditions'
      );
      return;
    }

    // Clear errors before submitting
    setError('');

    //Register User
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

  //Check if email already in use
  const checkEmailExists = async (email: string) => {
    if (!isValidEmail(email)) {
      setEmailError('Invalid email format');
      return;
    }

    try {
      await axios.post('http://localhost:5001/api/users/check-email', {
        email,
      });
      setEmailError(''); // ✅ Email is available
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>; // ✅ Type casting

      setEmailError(
        axiosError.response?.status === 409
          ? 'Email already in use' // ✅ Set error message if email exists
          : 'Something went wrong.'
      );
    }
  };

  return (
    <form>
      <div className="register-input__group">
        <label>Email</label>
        <input
          className={emailError ? 'input-error' : ''}
          type="email"
          placeholder="Enter Email..."
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            checkEmailExists(e.target.value); // ✅ Check email availability
          }}
        />
        {emailError && <p className="register-error">{emailError}</p>}{' '}
        {/* ✅ Show error if exists */}
      </div>
      <div className="register-input__group">
        <label>User Name</label>
        <input
          className={error ? 'input-error' : ''}
          type="text"
          placeholder="Enter a User Name..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="register-input__group">
        <label>Password</label>
        <input
          className={error ? 'input-error' : ''}
          type="password"
          placeholder="Enter Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="register-input__group">
        <label>Confirm Password</label>
        <input
          className={error ? 'input-error' : ''}
          type="password"
          placeholder="Confirm Password..."
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && (
          <div className="error-container">
            <p className="register-error">{error}</p>
          </div>
        )}

        <div className="register-input__checkbox">
          <input
            type="checkbox"
            id="checkbox"
            className={error ? 'input-error' : ''}
            checked={checkbox}
            onChange={() => setCheckbox(!checkbox)}
          />

          <label htmlFor="checkbox" className="checkbox-label">
            By clicking on the 'Create Account' button, you agree with, and
            accept all our terms and conditions
          </label>
        </div>
        <button onClick={handleRegister} className="register-btn">
          Create Account
        </button>
      </div>

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
