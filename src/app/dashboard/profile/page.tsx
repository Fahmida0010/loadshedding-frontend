'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useAxiosSecure } from '@/src/hooks/useAxiosSecure';
import { Camera, Lock, Mail, User, Phone, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, login } = useAuthStore();
  const axiosSecure = useAxiosSecure();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [previewImage, setPreviewImage] = useState<string | null>(user?.avatar || user?.profileImage || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('userId', user?.id || '');
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      if (selectedFile) {
        formData.append('profileImage', selectedFile);
      }

      // ব্যাকএন্ড রাউট পাথ অনুযায়ী এখানে এন্ডপয়েন্ট দিন (যেমন: /profile অথবা /users/profile)
      const response = await axiosSecure.patch('/auth/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;

      if (data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        login({
          ...user,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          avatar: data.user.profileImage,
        }, localStorage.getItem('token') || '');
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err?.response?.data?.message || err?.message || 'API endpoint not found or server error!' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Electricity Related Cover Image Section */}
      <div className="relative h-64 w-full bg-slate-900 overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#f59e0b_1.5px,transparent_1.5px)] [background-size:20px_20px]"></div>
        <img 
          src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1400&q=80" 
          alt="Electricity Grid Cover" 
          className="w-full h-full object-cover opacity-50 transform hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
        <div className="absolute bottom-6 left-6 sm:left-10 text-white">
          <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-semibold rounded-full backdrop-blur-md mb-2 inline-block">
            Power Grid Account
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Account Profile</h1>
          <p className="text-sm text-slate-300 font-medium mt-1">Manage your personal information, security, and grid settings</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 relative z-10">
        {message && (
          <div className={`mb-6 p-4 rounded-2xl text-sm font-semibold shadow-md flex items-center gap-3 backdrop-blur-md animate-fadeIn ${
            message.type === 'success' ? 'bg-emerald-500/10 text-emerald-800 border border-emerald-200' : 'bg-rose-500/10 text-rose-800 border border-rose-200'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
            {message.text}
          </div>
        )}

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          {/* Profile Header & Circle Avatar */}
          <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-b from-slate-50/50 to-transparent">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full ring-4 ring-white shadow-xl overflow-hidden bg-amber-500 flex items-center justify-center text-white text-4xl font-bold">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{name?.charAt(0).toUpperCase() || 'U'}</span>
                )}
              </div>
              
              <label htmlFor="avatar-upload" className="absolute inset-0 bg-slate-900/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer text-white backdrop-blur-xs">
                <Camera className="w-8 h-8 mb-1 text-amber-400" />
                <span className="text-[11px] font-semibold tracking-wide">Change Photo</span>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="text-center sm:text-left space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{name || 'User Name'}</h2>
              <p className="text-sm text-slate-500 font-medium">{email}</p>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-bold rounded-full mt-2">
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                {user?.role || 'CUSTOMER'}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none text-slate-800 text-sm transition-all shadow-2xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none text-slate-800 text-sm transition-all shadow-2xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none text-slate-800 text-sm transition-all shadow-2xs"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">User Role</label>
                <input
                  type="text"
                  value={user?.role || 'CUSTOMER'}
                  disabled
                  className="w-full px-4 py-3 border border-slate-200 bg-slate-100/80 rounded-2xl text-slate-500 text-sm cursor-not-allowed font-medium"
                />
              </div>
            </div>

       
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-2xl transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 text-sm flex items-center gap-2 cursor-pointer active:scale-95"
              >
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}