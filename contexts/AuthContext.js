/* eslint-disable prettier/prettier */
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userEmail = await AsyncStorage.getItem("userEmail");
      const userFullName = await AsyncStorage.getItem("userFullName");
      const registrationId = await AsyncStorage.getItem("registrationId");

      if (userEmail && userFullName && registrationId) {
        setUser({
          email: userEmail,
          fullName: userFullName,
          registrationId,
        });
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      const { email = "", fullName = "", registrationId = "" } = userData || {};

      await AsyncStorage.setItem("userEmail", email);
      await AsyncStorage.setItem("userFullName", fullName);
      await AsyncStorage.setItem("registrationId", registrationId.toString());

      setUser({ email, fullName, registrationId });
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "userEmail",
        "userFullName",
        "registrationId",
        "savedUsername",
        "savedPassword",
        "rememberMe",
      ]);
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
