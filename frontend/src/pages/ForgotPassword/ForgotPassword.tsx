import { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/users/forgot-password', {
        email,
      });
      setMessage('Check your email for reset instructions.');
    } catch (error) {
      setMessage('Failed to send reset email.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Forgot Password?</h2>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ForgotPassword;
