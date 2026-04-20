import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  onIdTokenChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { getUserById } from "../services/api";

// Create Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase User
  const [backendUser, setBackendUser] = useState(null); // Backend Profile (Roles, etc.)
  const [loading, setLoading] = useState(true);

  // Method to manually refresh backend profile data
  const refreshProfile = async () => {
    try {
      const res = await getUserById();
      setBackendUser(res.data);
      return res.data;
    } catch (error) {
      console.error("Failed to refresh backend profile:", error);
      throw error;
    }
  };

  useEffect(() => {
    // Listen for token changes (login, logout, token refresh)
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          // Attempt to sync roles immediately
          await refreshProfile();
        } catch (error) {
          // Profile fetch failed, but user is still firebase-authenticated
        }
      } else {
        // User is signed out.
        setUser(null);
        setBackendUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // Login Wrapper
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Register Wrapper
  const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Logout Wrapper
  const logout = () => {
    return signOut(auth);
  };

  // Helper to get token manually if needed
  const getToken = () => {
    return user ? user.getIdToken() : Promise.resolve(null);
  };

  const hasRole = (roleName) => {
     if (!backendUser || !backendUser.roles) return false;
     return backendUser.roles.includes(roleName);
  };

  const value = {
    user,
    backendUser, 
    loading,
    login,
    register,
    logout,
    getToken,
    hasRole, 
    refreshProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};