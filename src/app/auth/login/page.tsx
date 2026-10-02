'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAxiosSecure } from '@/src/hooks/useAxiosSecure';
import { useAuthStore } from '@/src/store/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const axiosSecure = useAxiosSecure();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Normal Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res: any = await axiosSecure.post('/auth/login', { email, password });
      const token = res?.accessToken || res?.data?.accessToken;
      if (token) {
        localStorage.setItem('token',token);
      }

  
const responseData = res?.data || res; 

const userData = {
  name: responseData?.user?.name || email.split('@')[0],
  email: responseData?.user?.email || email,
  role: responseData?.user?.role || 'CUSTOMER',
  avatar: responseData?.user?.profileImage || responseData?.user?.name?.charAt(0).toUpperCase() || 'A',
};

login(userData, token);
redirectBasedOnRole(userData.role);

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

    const demoCredentials = {
      ADMIN: { email: 'admin@demo.com', password: 'Password123', name: 'Ashraf Aman' },
      TECHNICIAN: { email: 'technician@demo.com', password: 'Password456', name: 'Sarbuland khan' },
      CUSTOMER: { email: 'customer@demo.com', password: 'Password789', name: 'Zarmala Akter' },
    };

    const credentials = demoCredentials[roleType];

    try {
      const res: any = await axiosSecure.post('/auth/login', credentials);
    
    const token = res?.accessToken || res?.data?.accessToken || 'demo-token-' + roleType.toLowerCase();
     
    
        localStorage.setItem('token', token);
      
      
      const userData = {
        name: res?.user?.name || credentials.name,
        email: res?.user?.email || credentials.email,
        role: roleType,
        avatar: roleType.charAt(0),
      };

      login(userData, token);
      redirectBasedOnRole(roleType);
    } catch (err: any) {
      // Fallback demo login jodi backend e demo account seed kora na thake
      const fallbackToken = 'demo-token-' + roleType.toLowerCase();
  localStorage.setItem('token', fallbackToken);
      
      const fallbackUser = {
        name: credentials.name,
        email: credentials.email,
        role: roleType,
        avatar: roleType.charAt(0),
      };

      login(fallbackUser, fallbackToken);
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
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back </h1>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-gray-900 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-gray-900 text-sm"
              />
              {/* Password Seen / Unseen Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  // Eye Slash Icon (Hide)
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  // Eye Icon (Show)
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-lg transition duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
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
          <Link href="/auth/register" className="text-amber-600 font-medium hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}