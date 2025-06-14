// Token management
export const TOKEN_KEY = '@synapse-quaj/token';

// Store the JWT token in localStorage
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Get the JWT token from localStorage
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove the JWT token from localStorage
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Check if the user is authenticated by checking if a token exists
export const isAuthenticated = () => {
  const token = getToken();
  return !!token; // Convert to boolean (true if token exists, false if not)
};