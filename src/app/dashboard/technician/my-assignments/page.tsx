import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  PlayCircle, 
  Send, 
  FileText, 
  MapPin, 
  Calendar,
  Filter
} from 'lucide-react';
import { useAxiosSecure } from '@/src/hooks/useAxiosSecure';
import { useAuthStore } from '@/src/store/useAuthStore';

const TechnicianAssignments = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuthStore();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  // Modal states for actions
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [modalType, setModalType] = useState(null); // 'repair', 'resolve', 'notes'
  const [formData, setFormData] = useState({ note: '', description: '', actionTaken: '', durationMinutes: '' });
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch technician assignments
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(statusFilter && { status: statusFilter }),
      };
      const response = await axiosSecure.get('/assignments/my-assignments', { params });
      
      // Assumes response structure like { data: { result: [], meta: {} } } or similar
      const resultData = response.data?.data || response.data;
      setAssignments(Array.isArray(resultData) ? resultData : resultData.result || []);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [statusFilter, pagination.page]);

  // Handle Status Update (e.g., ACCEPTED, REJECTED)
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/assignments/${id}/status`, { status: newStatus });
      fetchAssignments();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  // Handle Repair Progress Update
  const handleRepairUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    try {
      setActionLoading(true);
      await axiosSecure.post(`/assignments/${selectedAssignment.id}/repair-updates`, {
        note: formData.note,
      });
      setModalType(null);
      setFormData({ note: '', description: '', actionTaken: '', durationMinutes: '' });
      fetchAssignments();
    } catch (error) {
      console.error('Failed to add repair update:', error);
      alert(error.response?.data?.message || 'Failed to add repair update');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Resolve Outage
  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    try {
      setActionLoading(true);
      await axiosSecure.post(`/assignments/${selectedAssignment.id}/resolve`, {
        description: formData.description,
        actionTaken: formData.actionTaken,
        durationMinutes: formData.durationMinutes ? Number(formData.durationMinutes) : undefined,
      });
      setModalType(null);
      setFormData({ note: '', description: '', actionTaken: '', durationMinutes: '' });
      fetchAssignments();
    } catch (error) {
      console.error('Failed to resolve outage:', error);
      alert(error.response?.data?.message || 'Failed to resolve outage');
    } finally {
      setActionLoading(false);
    }
  };

  // Helper for status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      ASSIGNED: 'bg-blue-100 text-blue-800 border-blue-200',
      ACCEPTED: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
      IN_PROGRESS: 'bg-amber-100 text-amber-800 border-amber-200',
      COMPLETED: 'bg-green-100 text-green-800 border-green-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Wrench className="w-7 h-7 text-indigo-600" /> My Assignments
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage and track your assigned power outage resolution tasks.
            </p>
          </div>

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : assignments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No assignments found</h3>
            <p className="text-sm text-gray-500 mt-1">You currently do not have any tasks matching this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => {
              const outage = assignment.outage || {};
              return (
                <div 
                  key={assignment.id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-5">
                    {/* Top Row: Status & Priority */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(assignment.status)}`}>
                        {assignment.status}
                      </span>
                      {outage.priority && (
                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                          outage.priority === 'URGENT' || outage.priority === 'HIGH' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {outage.priority}
                        </span>
                      )}
                    </div>

                    {/* Outage Title & Info */}
                    <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1">
                      {outage.title || 'Outage Task'}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                      {outage.description || outage.reason || 'No specific description provided.'}
                    </p>

                    <div className="space-y-2 text-xs text-gray-500 border-t border-gray-100 pt-3">
                      {outage.area && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate">Area: {outage.area.name} ({outage.area.code})</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span>Assigned: {new Date(assignment.assignedAt).toLocaleString()}</span>
                      </div>
                      {assignment.notes && (
                        <div className="bg-gray-50 p-2 rounded text-gray-700 mt-2">
                          <span className="font-medium">Notes:</span> {assignment.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons Toolbar */}
                  <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 rounded-b-xl flex flex-wrap gap-2 items-center justify-end">
                    {assignment.status === 'ASSIGNED' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(assignment.id, 'ACCEPTED')}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(assignment.id, 'REJECTED')}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {assignment.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleUpdateStatus(assignment.id, 'IN_PROGRESS')}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg flex items-center gap-1 transition"
                      >
                        <PlayCircle className="w-3.5 h-3.5" /> Start Work
                      </button>
                    )}

                    {assignment.status === 'IN_PROGRESS' && (
                      <>
                        <button
                          onClick={() => { setSelectedAssignment(assignment); setModalType('repair'); }}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg flex items-center gap-1 transition"
                        >
                          <FileText className="w-3.5 h-3.5" /> Add Note
                        </button>
                        <button
                          onClick={() => { setSelectedAssignment(assignment); setModalType('resolve'); }}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg flex items-center gap-1 transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modals for Repair Update & Resolution */}
        {modalType && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {modalType === 'repair' ? 'Add Repair Progress Note' : 'Resolve Outage'}
              </h3>

              {modalType === 'repair' ? (
                <form onSubmit={handleRepairUpdateSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Progress Note</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      placeholder="e.g., Damaged feeder cable identified..."
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalType(null)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center gap-1 disabled:opacity-50"
                    >
                      {actionLoading ? 'Saving...' : 'Submit Update'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResolveSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Resolution Description</label>
                    <textarea
                      required
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Power supply has been restored successfully."
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Action Taken</label>
                    <textarea
                      rows={2}
                      value={formData.actionTaken}
                      onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
                      placeholder="Replaced damaged cable and tested feeder."
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      value={formData.durationMinutes}
                      onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                      placeholder="e.g., 75"
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalType(null)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg flex items-center gap-1 disabled:opacity-50"
                    >
                      {actionLoading ? 'Processing...' : 'Complete Outage'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TechnicianAssignments;