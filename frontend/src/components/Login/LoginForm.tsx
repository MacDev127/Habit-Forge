import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext/AuthContext';
import './LoginForm.css';

const LoginForm = () => {
  const auth = useContext(AuthContext);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!auth) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
    setPassword('');
    const success = await auth.login(email, password);
    if (!success) setError('Invalid email or password');
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <div className="input-group">
        <label htmlFor="password">Email</label>

        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Link to="/forgot-password" className="form-password__link">
          Forgot password?
        </Link>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="input-group">
        <button type="submit" className="login-btn">
          Log In
        </button>
        <div className="login-form__link">
          <p> Don't have an account?</p>
          <Link to="/register" className="form-register__link">
            Sign up now.
          </Link>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
