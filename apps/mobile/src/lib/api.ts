import axios from 'axios';
import Constants from 'expo-constants';
import { supabase } from './supabase';

// Dynamically extract computer's local IP address from Expo Go hostUri so physical devices can connect
const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost || '';
const localIp = hostUri ? hostUri.split(':')[0] : 'localhost';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || `http://${localIp}:3000`;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (config && config.method === 'get' && !config._retry) {
      config._retry = true;
      await new Promise((resolve) => setTimeout(resolve, 500));
      return api(config);
    }
    return Promise.reject(error);
  }
);
