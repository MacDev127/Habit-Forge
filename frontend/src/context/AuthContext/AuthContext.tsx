import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Define user type
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

// Define the context type
interface AuthContextType {
  user: User | null;
  loginWithGoogle: () => void;
  loginWithGitHub: () => void;
  logout: () => void;
}

// Create authentication context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// AuthProvider component that wraps the app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // Stores authenticated user data

  // Check if user is already logged in when the app loads
  useEffect(() => {
    axios
      .get('http://localhost:5001/auth/user', { withCredentials: true })
      .then((res) => setUser(res.data)) // Set user if logged in
      .catch(() => setUser(null)); // Clear user if not logged in
  }, []);

  // Redirect to Google OAuth login
  const loginWithGoogle = () => {
    window.location.href = 'http://localhost:5001/auth/google';
  };

  // Redirect to GitHub OAuth login
  const loginWithGitHub = () => {
    window.location.href = 'http://localhost:5001/auth/github';
  };

  // Logout user and clear session
  const logout = () => {
    axios
      .get('http://localhost:5001/auth/logout', { withCredentials: true })
      .then(() => {
        setUser(null); // Clear user state after logout
      });
  };

  return (
    // Provide authentication state and functions to children components
    <AuthContext.Provider
      value={{ user, loginWithGoogle, loginWithGitHub, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
