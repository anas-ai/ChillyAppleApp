import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useState, useContext, ReactNode} from 'react';
import {useToast} from 'react-native-toast-notifications';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (param: any) => void;
  setUserId: (param: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (token: any) => {
    try {
      await AsyncStorage.setItem('authToken', token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to save the token to AsyncStorage', error);
    }
  };
  const setUserId = async (id: any) => {
    try {
      await AsyncStorage.setItem('userId', JSON.stringify(id));
    } catch (error) {
      console.error('Failed to save the userId to AsyncStorage', error);
    }
  };
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('dialogShown');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Failed to remove the token from AsyncStorage', error);
    }
  };
  React.useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        console.log(token, 'authToken');

        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to retrieve the token from AsyncStorage', error);
      }
    };

    checkToken();
  }, []);
  return (
    <AuthContext.Provider value={{isAuthenticated, login, logout, setUserId}}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
