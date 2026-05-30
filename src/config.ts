const PROD_API = 'https://api.techtoolsweb.com/api';
const PROD_IMAGE = 'https://api.techtoolsweb.com';
const DEV_API = 'https://localhost:44347/api';
const DEV_IMAGE = 'https://localhost:44347';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (process.env.NODE_ENV === 'production' ? PROD_API : DEV_API);
export const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (process.env.NODE_ENV === 'production' ? PROD_IMAGE : DEV_IMAGE);

export default {
  API_BASE_URL,
  IMAGE_BASE_URL,
};
