import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    return !!token && !!userType;
  });

  const [userType, setUserType] = useState(() => {
    return localStorage.getItem('userType') || null;
  });

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   const storedUserType = localStorage.getItem('userType');
  //   if (token && storedUserType) {
  //     setIsLoggedIn(true);
  //     setUserType(storedUserType);
  //   } else {
  //     navigate('/login/admin');
  //   }
  // }, [navigate]);

  const login = (token, userType) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userType', userType);
    setIsLoggedIn(true);
    setUserType(userType);
    navigate(userType === 'admin' ? '/dashboard' : `/dashboard/${userType}`);
  };

  const adminLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setIsLoggedIn(false);
    setUserType(null);
    navigate('/login/admin');
  };

  const facultyLogout = (userType) => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType', userType);
    setIsLoggedIn(false);
    setUserType(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, login, adminLogout, facultyLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
