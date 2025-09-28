// Utility to check if we're in development mode
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development' ||
         window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1' ||
         window.location.port !== '';
};

