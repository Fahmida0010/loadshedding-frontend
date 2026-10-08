'use client';

import Loading from '@/src/app/loading';
import { useAxiosSecure } from '@/src/hooks/useAxiosSecure';
import { useAuthStore } from '@/src/store/useAuthStore';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// Types
type UserRole = 'ADMIN' | 'TECHNICIAN' | 'CUSTOMER';
type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}


interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  employeeId?: string;
  createdAt: string;
}

// Custom interface for unwrapped response
  interface ServerResponse {
    success: boolean;
    message: string;
    data: User[];
    meta: IMeta;
  }

export default function AdminUsersPage() {
  const axiosSecure = useAxiosSecure();
  const { user: currentUser } = useAuthStore(); 

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Filters & Pagination State
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  
const fetchUsers = async () => {
  try {
    setLoading(true);

    const params: Record<string, any> = {
      page,
      limit,
    };

    if (search.trim()) params.search = search.trim();
    if (roleFilter) params.role = roleFilter;
    if (statusFilter) params.status = statusFilter;

    const res = await axiosSecure.get('/admin/users', { params });

    // Axios response থেকে backend response বের করছি
    const responseData = res.data as ServerResponse;

    // Backend-er data = users array
    setUsers(Array.isArray(responseData.data) ? responseData.data : []);

    // Pagination metadata
    if (responseData.meta) {
      setTotalPages(responseData.meta.totalPages || 1);
    } else {
      setTotalPages(1);
    }

  } catch (error: any) {
    console.error('Failed to fetch users:', error);

    setUsers([]);
    setTotalPages(1);

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.response?.data?.message || 'Failed to load users',
    });
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUsers();
  }, [page, limit, roleFilter, statusFilter]);

  // Handle Search on Enter or Button Click
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  // Handle Role Update (PATCH) with SweetAlert
  const handleRoleChange = async (id: string, newRole: UserRole) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to change this user's role to ${newRole}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!',
    });

    if (!result.isConfirmed) {
      fetchUsers();
      return;
    }

    try {
      await axiosSecure.patch(`/admin/users/${id}/role`, { role: newRole });
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
      Swal.fire('Updated!', 'User role updated successfully!', 'success');
    } catch (error:any) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error.response?.data?.message || 'Failed to update role',
      });
      fetchUsers();
    }
  };

  // Handle Status Toggle (Block/Unblock) with SweetAlert
  const handleToggleBlockStatus = async (user: User) => {
    const isBlocked = user.status === 'BLOCKED';
    const newStatus: UserStatus = isBlocked ? 'ACTIVE' : 'BLOCKED';
    const actionText = isBlocked ? 'unblock' : 'block';

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText} this user?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isBlocked ? '#3085d6' : '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Yes, ${actionText} it!`,
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/admin/users/${user.id}/status`, { status: newStatus });
        
        setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
        
        Swal.fire(
          isBlocked ? 'Unblocked!' : 'Blocked!',
          `User has been ${actionText}ed successfully.`,
          'success'
        );
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error.response?.data?.message || `Failed to ${actionText} user`,
        });
      }
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto w-full">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Admin User Management</h1>

      {/* Filters & Search Section */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:flex-1">
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm whitespace-nowrap">
            Search
          </button>
        </form>

        <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3 w-full md:w-auto">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="border px-3 py-2 rounded-md text-sm focus:outline-none w-full sm:w-auto bg-white"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="TECHNICIAN">Technician</option>
            <option value="CUSTOMER">Customer</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="border px-3 py-2 rounded-md text-sm focus:outline-none w-full sm:w-auto bg-white"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
      {loading ? <Loading/>
       : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No users found.</div>
        ) : (
          <>
            {/* Desktop Table View (Visible on Medium screens and up) */}
            <div className="hidden md:block overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                    <th className="p-4">Name & Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-gray-500 text-xs">{user.email}</div>
                      </td>
                      <td className="p-4 text-gray-600">{user.phone || 'N/A'}</td>
                      <td className="p-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                          className="border px-2 py-1 rounded text-xs font-semibold bg-gray-50 focus:outline-none"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="TECHNICIAN">TECHNICIAN</option>
                          <option value="CUSTOMER">CUSTOMER</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                          user.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 text-xs">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleBlockStatus(user)}
                          className={`px-3 py-1 rounded text-xs font-medium text-white transition ${
                            user.status === 'BLOCKED'
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-red-600 hover:bg-red-700'
                          }`}
                        >
                          {user.status === 'BLOCKED' ? 'Unblock' : 'Block'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (Visible only on small screens below md) */}
            <div className="md:hidden divide-y divide-gray-200">
              {users.map((user) => (
                <div key={user.id} className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
                      <div className="text-gray-500 text-xs">{user.email}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                      user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      user.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-md">
                    <div>
                      <span className="font-medium text-gray-500 block">Phone:</span>
                      <span>{user.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500 block">Joined:</span>
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-medium">Role:</span>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        className="border px-2 py-1 rounded text-xs font-semibold bg-white focus:outline-none"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="TECHNICIAN">TECHNICIAN</option>
                        <option value="CUSTOMER">CUSTOMER</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleToggleBlockStatus(user)}
                      className={`px-3 py-1.5 rounded text-xs font-medium text-white transition ${
                        user.status === 'BLOCKED'
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {user.status === 'BLOCKED' ? 'Unblock' : 'Block'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination Controls */}
        <div className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 items-center justify-between border-t bg-gray-50">
          <span className="text-xs sm:text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 border rounded bg-white text-xs sm:text-sm disabled:opacity-50 hover:bg-gray-100"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border rounded bg-white text-xs sm:text-sm disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}