module.exports = {
  reactStrictMode: true,
  
  images: {
    domains: ['example.com'], // Add your image domains here
  },
  env: {
    // Use the provided environment variable if set; otherwise pick a sensible default
    // For production builds, point to the production API URL
    API_URL: process.env.API_URL || (process.env.NODE_ENV === 'production' ? 'https://api.tecchtoolsweb.com/api' : 'http://localhost:3000/api'),
  },
};