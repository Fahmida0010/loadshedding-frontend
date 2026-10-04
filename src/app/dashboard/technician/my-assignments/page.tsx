'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  PlayCircle, 
  FileText, 
  MapPin, 
  Calendar,
  Filter,
  Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useAxiosSecure } from '@/src/hooks/useAxiosSecure';
import { useAuthStore } from '@/src/store/useAuthStore';
import Loading from '@/src/app/loading';

interface Area {
  id: string;
  name: string;
  code: string;
  location?: string;
}

interface Outage {
  id: string;
  title: string;
  description?: string;
  reason?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: string;
  area?: Area;
}

interface TechnicianAssignment {
  id: string;
  outageId: string;
  technicianId: string;
  assignedById: string;
  status: 'ASSIGNED' | 'ACCEPTED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED';
  notes?: string | null;
  assignedAt: string;
  acceptedAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  outage?: Outage;
}

export default function MyAssignments() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuthStore();

  const [assignments, setAssignments] = useState<TechnicianAssignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  const [selectedAssignment, setSelectedAssignment] = useState<TechnicianAssignment | null>(null);
  const [modalType, setModalType] = useState<'repair' | 'resolve' | null>(null);
  
  const [note, setNote] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [actionTaken, setActionTaken] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {};
      if (statusFilter) params.status = statusFilter;

      const response = await axiosSecure.get('/assignments/my-assignments', { params });
      
      const resultData = response.data?.data || response.data;
      setAssignments(Array.isArray(resultData) ? resultData : resultData.result || []);
    } catch (error) {
      console.error('Failed to fetch technician assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAssignments();
    } else {
      setLoading(false);
    }
  }, [statusFilter, user?.id]);

  // Handle Status Update (Accept, Reject, In Progress) with Swal Confirmation
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    let actionTitle = 'Are you sure?';
    let confirmButtonText = 'Yes, proceed!';
    
    if (newStatus === 'ACCEPTED') {
      actionTitle = 'Accept this assignment?';
      confirmButtonText = 'Yes, Accept';
    } else if (newStatus === 'REJECTED') {
      actionTitle = 'Reject this assignment?';
      confirmButtonText = 'Yes, Reject';
    } else if (newStatus === 'IN_PROGRESS') {
      actionTitle = 'Start working on this task?';
      confirmButtonText = 'Yes, Start Work';
    }

    const result = await Swal.fire({
      title: actionTitle,
      text: `Status will be updated to ${newStatus}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#6b7280',
      confirmButtonText: confirmButtonText,
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/assignments/${id}/status`, { status: newStatus });
        Swal.fire({
          title: 'Success!',
          text: `Assignment status successfully updated to ${newStatus}.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        fetchAssignments();
      } catch (error: any) {
        console.error('Failed to update status:', error);
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to update assignment status.',
          icon: 'error',
        });
      }
    }
  };

  // Handle Repair Progress Note Submission with Swal
  const handleRepairUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    try {
      setActionLoading(true);
      await axiosSecure.post(`/assignments/${selectedAssignment.id}/repair-updates`, { note });
      setModalType(null);
      setNote('');
      fetchAssignments();
      Swal.fire({
        title: 'Success!',
        text: 'Repair progress note added successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      console.error('Failed to add repair update:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to add repair update.',
        icon: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Outage Resolution Submission with Swal
  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    try {
      setActionLoading(true);
      await axiosSecure.post(`/assignments/${selectedAssignment.id}/resolve`, {
        description,
        actionTaken,
        durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
      });
      setModalType(null);
      setDescription('');
      setActionTaken('');
      setDurationMinutes('');
      fetchAssignments();
      Swal.fire({
        title: 'Resolved!',
        text: 'Outage has been successfully marked as resolved.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      console.error('Failed to resolve outage:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to resolve outage.',
        icon: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
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
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Wrench className="w-7 h-7 text-indigo-600" /> Technician Assignments
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome back, <span className="font-semibold text-gray-900">{user?.name || 'Technician'}</span>. View and manage your assigned outage tasks below.
            </p>
          </div>

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

        {loading ? ( <Loading/>
        ) : assignments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No assignments found</h3>
            <p className="text-sm text-gray-500 mt-1">You do not have any tasks assigned under this filter category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => {
              const outage = assignment.outage;
              return (
                <div 
                  key={assignment.id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(assignment.status)}`}>
                        {assignment.status}
                      </span>
                      {outage?.priority && (
                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                          outage.priority === 'URGENT' || outage.priority === 'HIGH' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {outage.priority}
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1">
                      {outage?.title || 'Outage Assignment'}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                      {outage?.description || outage?.reason || 'No description provided.'}
                    </p>

                    <div className="space-y-2 text-xs text-gray-500 border-t border-gray-100 pt-3">
                      {outage?.area && (
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

        {modalType && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {modalType === 'repair' ? 'Add Repair Progress Update' : 'Resolve Outage'}
              </h3>

              {modalType === 'repair' ? (
                <form onSubmit={handleRepairUpdateSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Progress Note</label>
                    <textarea
                      required
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="e.g., Damaged feeder cable identified and replacement started."
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
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
                    >
                      {actionLoading ? 'Saving...' : 'Submit Note'}
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
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Power supply has been restored successfully."
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Action Taken</label>
                    <textarea
                      rows={2}
                      value={actionTaken}
                      onChange={(e) => setActionTaken(e.target.value)}
                      placeholder="Replaced damaged cable and tested the feeder connection."
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
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
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
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
}