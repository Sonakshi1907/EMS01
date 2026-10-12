import { createContext, useContext, useState } from "react";

import {
  getFromStorage,
  saveToStorage,
  removeFromStorage,
} from "../utils/localStorage.js";

const defaultAuthContext = {
  currentUser: null,
  setCurrentUser: () => {},
  login: () => ({
    success: false,
    message: "Auth provider is not available",
  }),
  logout: () => {},
};

export const AuthContext = createContext(defaultAuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() =>
    getFromStorage("currentUser"),
  );

  const login = (email, password) => {
    const users = getFromStorage("users") || [];

    const user = users.find(
      (item) => item.email === email && item.password === password,
    );

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    setCurrentUser(user);
    saveToStorage("currentUser", user);

    return {
      success: true,
      user,
    };
  };

  const logout = () => {
    setCurrentUser(null);
    removeFromStorage("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
