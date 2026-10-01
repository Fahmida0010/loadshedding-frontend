'use client';

import axios from 'axios';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/useAuthStore';

// Ekta matro Axios instance toiri kora holo
const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useAxiosSecure = () => {
  const router = useRouter();
  const { token: storeToken } = useAuthStore();
  

  useEffect(() => {
    // Request Interceptor: Token thakle attach korbe, na thakle normally jabe (Public & Private both)
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = storeToken || localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor: Error handle ba unauthorized hole login e pathanor jonno
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          localStorage.removeItem('token');
          router.push('/auth/login');
        }
        
        const customError = {
          message: error.response?.data?.message || error.message || 'Something went wrong!',
          status: status || 500,
          errorSources: error.response?.data?.errorSources || [],
          response: error.response,
        };
        return Promise.reject(customError);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [router]);

  return axiosSecure;
};

