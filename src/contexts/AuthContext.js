import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (simulate with localStorage)
    const savedUser = localStorage.getItem('harshee_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'demo@example.com' && password === 'password') {
          const userData = {
            id: 1,
            name: 'Demo User',
            email: email,
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
          };
          setUser(userData);
          localStorage.setItem('harshee_user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const register = async (name, email, password,phone) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userData = {
          id: Date.now(),
          name,
          email,
          phone,
          avatar: `https://ui-avatars.com/api/?name=${name}&background=ec4899&color=fff`
        };
        setUser(userData);
        localStorage.setItem('harshee_user', JSON.stringify(userData));
        resolve(userData);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('harshee_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout
    }}>
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