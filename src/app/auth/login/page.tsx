'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAxiosSecure } from '@/src/hooks/useAxiosSecure';


export default function LoginPage() {
  const router = useRouter();
  const axiosSecure = useAxiosSecure();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Normal Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res: any = await axiosSecure.post('/auth/login', { email, password });
      if (res?.token) {
        localStorage.setItem('token', res.token);
      }
      redirectBasedOnRole(res?.user?.role || 'CUSTOMER');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // One-Click Demo Login Handler for 3 Roles
  const handleDemoLogin = async (roleType: 'ADMIN' | 'TECHNICIAN' | 'CUSTOMER') => {
    setLoading(true);
    setError(null);

    try {
      // Demo credentials ba backend demo route call korte paren
      const demoCredentials = {
        ADMIN: { email: 'admin@demo.com', password: 'password123' },
        TECHNICIAN: { email: 'technician@demo.com', password: 'password123' },
        CUSTOMER: { email: 'customer@demo.com', password: 'password123' },
      };

      const credentials = demoCredentials[roleType];
      
      const res: any = await axiosSecure.post('/auth/login', credentials);
      if (res?.token) {
        localStorage.setItem('token', res.token);
      }
      redirectBasedOnRole(roleType);
    } catch (err: any) {
      // Jodi backend e demo account seed kora na thake, tahole fallback hisabe local token set kore pathiye dite paren
      localStorage.setItem('token', 'demo-token-' + roleType.toLowerCase());
      redirectBasedOnRole(roleType);
    } finally {
      setLoading(false);
    }
  };

  const redirectBasedOnRole = (role: string) => {
    if (role === 'ADMIN') router.push('/dashboard/admin');
    else if (role === 'TECHNICIAN') router.push('/dashboard/technician');
    else router.push('/dashboard/customer');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 border border-gray-100 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back 👋</h1>
          <p className="text-sm text-gray-600">Login to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Normal Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            🔐 Login
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-wider">─── OR ───</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Quick Demo Login Section */}
        <div className="space-y-3">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-gray-500">
            🚀 Quick Demo Login
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Admin Demo */}
            <div className="border border-gray-200 rounded-xl p-3 text-center bg-gray-50 hover:bg-gray-100 transition">
              <span className="block text-xs font-semibold text-gray-700 mb-2">👨‍💼 Admin</span>
              <button
                type="button"
                onClick={() => handleDemoLogin('ADMIN')}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium py-1.5 px-2 rounded transition shadow-sm"
              >
                Demo Login
              </button>
            </div>

            {/* Customer Demo */}
            <div className="border border-gray-200 rounded-xl p-3 text-center bg-gray-50 hover:bg-gray-100 transition">
              <span className="block text-xs font-semibold text-gray-700 mb-2">👤 Customer</span>
              <button
                type="button"
                onClick={() => handleDemoLogin('CUSTOMER')}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium py-1.5 px-2 rounded transition shadow-sm"
              >
                Demo Login
              </button>
            </div>
          </div>

          {/* Technician Demo */}
          <div className="border border-gray-200 rounded-xl p-3 text-center bg-gray-50 hover:bg-gray-100 transition">
            <span className="block text-xs font-semibold text-gray-700 mb-2">🛠️ Technician</span>
            <button
              type="button"
              onClick={() => handleDemoLogin('TECHNICIAN')}
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium py-1.5 px-3 rounded transition shadow-sm"
            >
              Demo Login
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 pt-2">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-blue-600 font-medium hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}