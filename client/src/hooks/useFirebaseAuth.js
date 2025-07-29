import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { toast } from 'react-hot-toast';
import {
  storeToken,
  removeToken
} from '../utils/tokenUtils';

export default function useFirebaseAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Get fresh Firebase auth ID token
          const token = await user.getIdToken(true); // Force refresh
          
          // Store token using tokenUtils
          storeToken(token);
          
          // Store basic user info in localStorage
          localStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          }));
          
          // Set user in state
          setCurrentUser(user);
        } else {
          // Remove token using tokenUtils
          removeToken();
          localStorage.removeItem('user');
          
          // Clear user in state
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        removeToken();
        localStorage.removeItem('user');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Format Firebase auth error messages
  const formatError = (errorMessage) => {
    if (errorMessage.includes('auth/email-already-in-use')) {
      return 'This email is already registered. Please login instead.';
    }
    if (errorMessage.includes('auth/weak-password')) {
      return 'Password should be at least 6 characters long.';
    }
    if (errorMessage.includes('auth/invalid-email')) {
      return 'Please provide a valid email address.';
    }
    if (errorMessage.includes('auth/user-not-found') || errorMessage.includes('auth/wrong-password')) {
      return 'Invalid email or password.';
    }
    if (errorMessage.includes('auth/network-request-failed')) {
      return 'Network error. Please check your internet connection.';
    }
    return errorMessage;
  };

  // Sign in with email and password
  const loginWithEmailAndPassword = async (email, password) => {
    setError(null);
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successfully logged in!');
      return userCredential.user;
    } catch (err) {
      console.error('Login error:', err.code, err.message);
      const formattedError = formatError(err.code || err.message);
      setError(formattedError);
      toast.error(formattedError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const registerWithEmailAndPassword = async (email, password, name) => {
    setError(null);
    try {
      setLoading(true);
      
      // Validate password length
      if (password.length < 6) {
        const err = new Error('Password should be at least 6 characters long.');
        err.code = 'auth/weak-password';
        throw err;
      }
      
      // Create user in Firebase
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name if provided
      if (name) {
        try {
          await updateProfile(user, {
            displayName: name
          });
        } catch (profileErr) {
          console.warn("Failed to update profile name:", profileErr);
        }
      }

      toast.success('Account created successfully!');
      return user;
      
    } catch (err) {
      console.error('Registration error:', err.code, err.message);
      const formattedError = formatError(err.code || err.message);
      setError(formattedError);
      toast.error(formattedError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    setError(null);
    try {
      setLoading(true);
      
      // Simplify Google sign-in to fix the assertion error
      try {
        const result = await signInWithPopup(auth, googleProvider);
        toast.success('Successfully logged in with Google!');
        return result.user;
      } catch (popupError) {
        console.error('Popup error:', popupError);
        
        // If popup method fails, show a more helpful error
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user') {
          toast.error('Popup was blocked. Please allow popups for this site.', { 
            duration: 5000
          });
        } else if (popupError.message && popupError.message.includes('assertion failed')) {
          toast.error('Authentication error. Please try again or use email login.', {
            duration: 5000
          });
        } else {
          toast.error('Failed to sign in with Google. Please try again later.', {
            duration: 5000
          });
        }
        
        throw popupError;
      }
    } catch (err) {
      console.error('Google sign-in error:', err.code, err.message);
      // Only set error if it's not a popup closed by user error
      if (err.code !== 'auth/popup-closed-by-user') {
        const formattedError = formatError(err.code || err.message);
        setError(formattedError);
      } else {
        // Just show a gentler message for user-closed popups
        toast.error('Sign in cancelled', { duration: 3000 });
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logout = async () => {
    setError(null);
    try {
      setLoading(true);
      await signOut(auth);
      removeToken();
      localStorage.removeItem('user');
      toast.success('Successfully logged out');
    } catch (err) {
      console.error('Logout error:', err.code, err.message);
      const formattedError = formatError(err.code || err.message);
      setError(formattedError);
      toast.error(formattedError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get a fresh token when needed
  const getIdToken = async (forceRefresh = false) => {
    if (!auth.currentUser) return null;
    try {
      const token = await auth.currentUser.getIdToken(forceRefresh);
      storeToken(token);
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  // Force token refresh - used to explicitly handle token expiration
  const refreshToken = async () => {
    if (!auth.currentUser) {
      console.warn('Not logged in - cannot refresh token');
      removeToken(); // Ensure any stored token is removed if not logged in
      return null;
    }
    
    try {
      console.log('Attempting to refresh Firebase ID token');
      
      // Force refresh the token
      const token = await auth.currentUser.getIdToken(true);
      
      if (!token) {
        console.error('Firebase returned null token during refresh');
        throw new Error('Failed to obtain valid token');
      }
      
      // Check token is valid (basic check)
      if (typeof token !== 'string' || token.length < 50) {
        console.error('Received invalid token format during refresh');
        throw new Error('Invalid token format received');
      }
      
      // Update using tokenUtils
      storeToken(token);
      
      console.log('Token refreshed successfully');
      return token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      
      // If there's an error refreshing, we might need to re-authenticate
      if (error.code === 'auth/requires-recent-login') {
        toast.error('For security reasons, please log in again.');
        // Attempt to log the user out if refresh failed due to requiring recent login
        try {
          await logout();
        } catch (logoutError) {
          console.error('Failed to logout after refresh error:', logoutError);
          // Still remove the token even if logout fails
          removeToken();
        }
      } else {
        // For other errors, just remove the token
        removeToken();
      }
      
      throw error; // Propagate the error to calling code
    }
  };

  return {
    currentUser,
    loading,
    error,
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
    signInWithGoogle,
    logout,
    getIdToken,
    refreshToken
  };
} 