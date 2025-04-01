const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  isDevelopment: import.meta.env.MODE === 'development'
};

export default config; 