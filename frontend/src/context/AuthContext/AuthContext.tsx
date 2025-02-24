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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

// Create authentication context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// AuthProvider component that wraps the app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Check if user is already logged in when the app loads
  useEffect(() => {
    axios
      .get('http://localhost:5001/api/users/me', { withCredentials: true })
      .then((res) => setUser(res.data)) // ✅ Set user if logged in
      .catch(() => setUser(null)); // ❌ Clear user if not logged in
  }, []);

  // ✅ Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(
        'http://localhost:5001/api/users/login',
        { email, password },
        { withCredentials: true } // ✅ Allows sending cookies for session
      );

      setUser(response.data.user); // ✅ Store user info in context
      window.location.href = '/dashboard'; // ✅ Redirect user to dashboard
      return true;
    } catch (error) {
      console.error('❌ Login Failed:', error);
      return false;
    }
  };

  // ✅ Logout function
  const logout = async () => {
    try {
      await axios.post(
        'http://localhost:5001/api/users/logout',
        {},
        { withCredentials: true }
      );
      setUser(null); // ✅ Clear user state after logout
      window.location.href = '/login'; // ✅ Redirect to login page
    } catch (error) {
      console.error('❌ Logout Failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
