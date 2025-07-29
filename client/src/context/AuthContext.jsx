import React, { createContext } from 'react';
import useFirebaseAuth from '../hooks/useFirebaseAuth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { 
    currentUser,
    loading,
    error,
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
    signInWithGoogle,
    logout,
    getIdToken,
    refreshToken
  } = useFirebaseAuth();

  // Explicitly compute isAuthenticated for easier checks
  const isAuthenticated = Boolean(currentUser);

  // Clear error functionality can be maintained if needed
  const clearError = () => {
    // This functionality is handled in useFirebaseAuth now
    // We keep this method for API compatibility
    console.log("Clearing error");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loading,
        error,
        register: registerWithEmailAndPassword,
        login: loginWithEmailAndPassword,
        googleSignIn: signInWithGoogle,
        logout,
        getIdToken,
        refreshToken,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 