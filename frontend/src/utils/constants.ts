export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  INIT_LOGIN: '/init-login',
  SET_PASSWORD: '/set-password',
  DASHBOARD: '/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',
  HOME_PAGE: '/home',
  REGISTER: '/register',
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://future-platform-i8rf.onrender.com';

export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  STUDENT: 'student',
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  TEMP_NATIONAL_ID: 'temp_national_id',
  TEMP_ACCESS_TOKEN: 'temp_access_token',
} as const;
