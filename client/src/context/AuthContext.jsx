import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { user } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await user.getMe();
        setCurrentUser(response.data.data.user);
      } catch (error) {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await user.login(credentials);
      const me = await user.getMe();
      setCurrentUser(me.data.data.user);
      toast.success('Logged in!');
      navigate('/');
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await user.signup(userData);
      const me = await user.getMe();
      setCurrentUser(me.data.data.user);
      toast.success('Account created!');
      navigate('/');
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await user.logout();
      toast.success('Logged out!');
    } catch (e) {
      // Optionally handle error
    }
    setCurrentUser(null);
    navigate('/auth');
  };

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
