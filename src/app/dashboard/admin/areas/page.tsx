"use client";
import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';
import { 
  Plus, Search, Edit2, Trash2, AlertTriangle, 
  MapPin, Users, ChevronLeft, ChevronRight, X 
} from 'lucide-react';
import { useAxiosSecure } from '@/src/hooks/useAxiosSecure';
import { useAuthStore } from '@/src/store/useAuthStore';
import Swal from 'sweetalert2';
import Loading from '@/src/app/loading';

// TypeScript Interfaces & Types
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

interface Feeder {
  id: string;
  name: string;
  code: string;
}

interface Area {
  id: string;
  feederId: string;
  name: string;
  code: string;
  location?: string;
  population?: number;
  priority: Priority;
  feeder?: Feeder;
}

interface AreaFormData {
  feederId: string;
  name: string;
  code: string;
  location: string;
  population: string | number;
  priority: Priority;
}

const PRIORITIES: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

const priorityColors: Record<Priority, string> = {
  LOW: 'bg-blue-100 text-blue-800 border-blue-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
  URGENT: 'bg-red-100 text-red-800 border-red-200',
};

export default function AreaManagementPage() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuthStore();

  // State Management
  const [areas, setAreas] = useState<Area[]>([]);
  const [feeders, setFeeders] = useState<Feeder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [selectedFeederFilter, setSelectedFeederFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [currentArea, setCurrentArea] = useState<Area | null>(null);

  // Form Data State
  const [formData, setFormData] = useState<AreaFormData>({
    feederId: '',
    name: '',
    code: '',
    location: '',
    population: '',
    priority: 'MEDIUM',
  });

  // Fetch Feeders for dropdown selection
  const fetchFeeders = useCallback(async () => {
    try {
      const response = await axiosSecure.get('/feeders');
      const resData = response.data;
      setFeeders(resData?.data?.data || resData?.data || resData || []);
    } catch (err) {
      console.error('Failed to fetch feeders:', err);
    }
  }, [axiosSecure]);

  const fetchAreas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (searchTerm.trim()) {
        params.append('searchTerm', searchTerm.trim());
      }

      if (selectedPriority) {
        params.append('priority', selectedPriority);
      }

      if (selectedFeederFilter) {
        params.append('feederId', selectedFeederFilter);
      }

      const response = await axiosSecure.get(
        `/areas?${params.toString()}`
      );

      const apiData = response;

      // Extract area data safely
      const areaData = Array.isArray(apiData?.data)
        ? apiData.data
        : Array.isArray((apiData as any)?.data?.data)
        ? (apiData as any).data.data
        : [];

      // Extract metadata safely for total pages
      const metaData = apiData?.meta || (apiData?.data as any)?.meta;

      setAreas(areaData);
      setTotalPages(
        Number(metaData?.totalPage || metaData?.totalPages) || 1
      );

    } catch (err: any) {
      console.error('Failed to fetch areas:', err);

      setAreas([]);
      setTotalPages(1);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load areas data.'
      );
    } finally {
      setLoading(false);
    }
  }, [
    axiosSecure,
    page,
    limit,
    searchTerm,
    selectedPriority,
    selectedFeederFilter,
  ]);

  useEffect(() => {
    fetchFeeders();
  }, [fetchFeeders]);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  // Handle Input Changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open Create Modal
  const openCreateModal = () => {
    setFormData({ feederId: '', name: '', code: '', location: '', population: '', priority: 'MEDIUM' });
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (area: Area) => {
    setCurrentArea(area);
    setFormData({
      feederId: area.feederId || '',
      name: area.name || '',
      code: area.code || '',
      location: area.location || '',
      population: area.population ?? '',
      priority: area.priority || 'MEDIUM',
    });
    setIsEditModalOpen(true);
  };

  // Create Area Handler (POST /areas)
  const handleCreateArea = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await axiosSecure.post('/areas', {
        ...formData,
        population: formData.population ? parseInt(String(formData.population), 10) : undefined,
      });
      setIsCreateModalOpen(false);
      fetchAreas();

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Area created successfully.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response?.data?.message || 'Failed to create area.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Update Area Handler (PATCH /areas/:id)
  const handleUpdateArea = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentArea) return;
    try {
      setActionLoading(true);
      await axiosSecure.patch(`/areas/${currentArea.id}`, {
        ...formData,
        population: formData.population ? parseInt(String(formData.population), 10) : null,
      });
      setIsEditModalOpen(false);
      fetchAreas();

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Area updated successfully.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response?.data?.message || 'Failed to update area.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Area Handler with SweetAlert Confirmation
  const confirmDeleteArea = (area: Area) => {
    Swal.fire({
      title: 'Are you sure?',
      html: `You want to delete <strong class="text-gray-900">${area.name}</strong>? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setActionLoading(true);
          await axiosSecure.delete(`/areas/${area.id}`);
          fetchAreas();

          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Area has been deleted.',
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (err: any) {
          Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: err.response?.data?.message || 'Failed to delete area.',
          });
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Area Management</h1>
          <p className="text-sm text-gray-500">Manage power distribution areas, priorities, and assignments.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow transition"
          >
            <Plus className="w-5 h-5 mr-2" /> Add New Area
          </button>
        )}
      </div>

      {/* Filters & Search Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or code..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
          />
        </div>

        {/* Priority Filter */}
        <select
          value={selectedPriority}
          onChange={(e) => { setSelectedPriority(e.target.value); setPage(1); }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm bg-white"
        >
          <option value="">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {/* Feeder Filter */}
        <select
          value={selectedFeederFilter}
          onChange={(e) => { setSelectedFeederFilter(e.target.value); setPage(1); }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm bg-white"
        >
          <option value="">All Feeders</option>
          {feeders.map((f) => (
            <option key={f.id} value={f.id}>{f.name} ({f.code})</option>
          ))}
        </select>

        {/* Reset Filters */}
        <button
          onClick={() => { setSearchTerm(''); setSelectedPriority(''); setSelectedFeederFilter(''); setPage(1); }}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm transition"
        >
          Clear Filters
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 text-red-700 rounded-r-lg">
          {error}
        </div>
      )}

      {/* Main Content: Responsive Table / Cards */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <Loading/> : areas.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-lg font-medium">No areas found.</p>
            <p className="text-sm">Try adjusting your search criteria or add a new area.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-200">
                    <th className="py-3 px-4">Name & Code</th>
                    <th className="py-3 px-4">Feeder</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Population</th>
                    <th className="py-3 px-4">Priority</th>
                    {user?.role === 'ADMIN' && <th className="py-3 px-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                  {areas.map((area) => (
                    <tr key={area.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">{area.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{area.code}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900">{area.feeder?.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500 font-mono">{area.feeder?.code}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="truncate max-w-xs">{area.location || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{area.population?.toLocaleString() || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${priorityColors[area.priority] || 'bg-gray-100 text-gray-800'}`}>
                          {area.priority}
                        </span>
                      </td>
                      {user?.role === 'ADMIN' && (
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(area)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDeleteArea(area)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 md:hidden">
              {areas.map((area) => (
                <div key={area.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{area.name}</h3>
                        <span className="text-xs font-mono text-gray-500">{area.code}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${priorityColors[area.priority]}`}>
                        {area.priority}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-sm text-gray-600 my-3">
                      <p className="text-xs"><strong className="text-gray-700">Feeder:</strong> {area.feeder?.name || 'N/A'}</p>
                      <p className="flex items-center gap-1.5 text-xs"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {area.location || 'N/A'}</p>
                      <p className="flex items-center gap-1.5 text-xs"><Users className="w-3.5 h-3.5 text-gray-400" /> {area.population?.toLocaleString() || 'N/A'} residents</p>
                    </div>
                  </div>
                  {user?.role === 'ADMIN' && (
                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => openEditModal(area)}
                        className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded hover:bg-indigo-100 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDeleteArea(area)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm">
              <span className="text-gray-600">
                Page <strong>{page}</strong> of{" "}
                <strong>{totalPages}</strong>
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page <= 1 || loading}
                  className="px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page >= totalPages || loading}
                  className="px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create / Edit Modal */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {isCreateModalOpen ? 'Create New Area' : 'Edit Area'}
            </h2>
            <form onSubmit={isCreateModalOpen ? handleCreateArea : handleUpdateArea} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feeder</label>
                <select
                  name="feederId"
                  value={formData.feederId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                >
                  <option value="">Select Feeder</option>
                  {feeders.map((f) => (
                    <option key={f.id} value={f.id}>{f.name} ({f.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Amberkhana"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area Code</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="e.g. SYL-AMB-001"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Details</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Amberkhana, Sylhet"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Population</label>
                  <input
                    type="number"
                    name="population"
                    value={formData.population}
                    onChange={handleInputChange}
                    placeholder="e.g. 35000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition flex items-center justify-center min-w-[90px]"
                >
                  {actionLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isCreateModalOpen ? 'Create' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}