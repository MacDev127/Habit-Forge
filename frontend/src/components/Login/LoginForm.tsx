import { Interface } from 'readline';
import './LoginForm.css';
import { ReactNode } from 'react';

interface LoginFormProps {
  children: ReactNode;
}
const LoginForm = ({ children }: LoginFormProps) => {
  return (
    <form>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <button className="form-btn" type="submit">
        Login
      </button>
      <div className="divider-container">
        <span className="divider-text">or</span>
      </div>

      {children}
    </form>
  );
};

export default LoginForm;
