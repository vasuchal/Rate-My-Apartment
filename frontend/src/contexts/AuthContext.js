import React, { FC, useEffect } from 'react';

import { getCurrentUser } from '../utils/apiWrapper';

const AuthContext = React.createContext({
  isLoggedIn: false,
  user: {},
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState({});

  useEffect(() => {
    const loadUser = async () => {
      const res = await getCurrentUser();

      if (res.status === 401) {
        setIsLoggedIn(false);
        return;
      }

      setUser(res.data);
      setIsLoggedIn(true);
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
};
