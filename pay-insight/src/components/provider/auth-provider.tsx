"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
// Create Context
type AuthContextType = {
  isAuthenticated: boolean;
  user: userInfoType | null;
  signIn: (userInfo: userInfoType) => void;
  signOut: () => void;
  loading: boolean;
} | null;

const AuthContext = createContext<AuthContextType>(null);
type roleInfoProp = {
  _id: string;
  company: string;
  role: string;
};
type userInfoType = {
  _id: string;
  givenName: string;
  username: string;
  email: string;
  roleInfo?: Array<roleInfoProp>;
} | null;

// Create a provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<userInfoType>(null);

  const signIn = (userInfo: userInfoType) => {
    if (userInfo) {
      setUser(userInfo);
      setIsAuthenticated(true);
    }
  };

  const signOut = () => {
    axios.get("/api/user/logout").catch((err) => console.log(err));
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    axios
      .get("/api")
      .then((res) => {
        console.log(res.data.user);
        signIn(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
