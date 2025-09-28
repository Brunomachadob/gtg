// Utility to check if we're in development mode
export const isDevelopment = () => {
  // Check if process.env is available (build-time injection) and safely access NODE_ENV
  const nodeEnv = typeof process !== 'undefined' && process.env ? process.env.NODE_ENV : undefined;

  return nodeEnv === 'development' ||
         window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname.includes('192.168.') || // Local network IPs
         window.location.hostname.includes('10.0.') ||    // Local network IPs
         window.location.port !== '' ||
         window.location.protocol === 'file:'; // Local file serving
};
