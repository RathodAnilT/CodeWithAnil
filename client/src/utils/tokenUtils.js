/**
 * Utility functions for handling authentication tokens
 */

// Token Storage Key - this should be used consistently across the app
export const TOKEN_STORAGE_KEY = 'token';

/**
 * Store the authentication token in localStorage
 * @param {string} token - The JWT token to store
 */
export const storeToken = (token) => {
  if (!token) return;
  
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

/**
 * Retrieve the authentication token from localStorage
 * @returns {string|null} The stored token or null if not found
 */
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

/**
 * Remove the authentication token from localStorage
 */
export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

/**
 * Check if a token exists and is likely valid (not expired)
 * Note: This does not validate the token signature, just checks if it exists
 * and hasn't obviously expired based on its structure
 * 
 * @returns {boolean} Whether a seemingly valid token exists
 */
export const hasValidToken = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Simple check if token is a JWT with 3 parts
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Check if middle part (payload) can be decoded
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token is expired
    if (payload.exp && payload.exp < Date.now() / 1000) {
      removeToken(); // Clean up expired token
      return false;
    }
    
    return true;
  } catch (e) {
    console.error('Error checking token validity:', e);
    return false;
  }
};

/**
 * Get authentication headers for API requests
 * @returns {Object} Headers object with Authorization if token exists
 */
export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}; 