import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '../utils/helpers';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: getUser(),
  token: getToken(),
  isAuthenticated: !!getToken(),
  loading: false,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await authService.login(credentials);
      
      if (response.success) {
        setToken(response.token);
        setUser(response.user);
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: response.user,
            token: response.token
          }
        });
        
        toast.success(response.message || 'Login successful');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: message
      });
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await authService.register(userData);
      
      if (response.success) {
        toast.success(response.message || 'Registration successful');
        dispatch({ type: 'CLEAR_ERROR' });
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: message
      });
      return { success: false, message };
    }
  };

  const logout = () => {
    removeToken();
    removeUser();
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Check if user is still authenticated on app load
  useEffect(() => {
    const validateToken = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          if (response.success) {
            setUser(response.user);
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: response.user,
                token
              }
            });
          }
        } catch (error) {
          // Token is invalid, remove it
          removeToken();
          removeUser();
          dispatch({ type: 'LOGOUT' });
        }
      }
    };

    validateToken();
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
