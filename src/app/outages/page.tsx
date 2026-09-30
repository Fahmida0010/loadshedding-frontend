'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useAxiosSecure } from '@/src/hooks/useAxiosSecure';
import { useAuthStore } from '@/src/store/useAuthStore';
import Loading from '../loading';

// Zod schema for validating unexpected outage form
const outageReportSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  areaId: z.string().min(1, 'Area ID is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
});

export default function OutagesPage() {
  const { user, token } = useAuthStore();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure(); 

  const [form, setForm] = useState({
    title: '',
    description: '',
    areaId: '',
    priority: 'MEDIUM',
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  // Fetch Outages using TanStack Query
  const { data: outages = [], isLoading } = useQuery({
    queryKey: ['outages'],
    queryFn: async () => {
      const res = await axiosSecure.get('/outages');
      return res.data;
    },
  });

  // Mutation to report unexpected outage with Zod validation
  const reportMutation = useMutation({
    mutationFn: async (newOutage: any) => {
      const res = await axiosSecure.post('/outages',
        newOutage,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outages'] });
      setForm({ title: '', description: '', areaId: '', priority: 'MEDIUM' });
      alert('Outage reported successfully!');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Zod validation check
    const result = outageReportSchema.safeParse(form);
    if (!result.success) {
      setValidationError(result.error.errors[0].message);
      return;
    }

    reportMutation.mutate(form);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Unexpected Outages & Reports 🛠️</h1>
        <p className="text-sm text-gray-600">Track active power outages or report a sudden failure in your zone.</p>
      </div>

      {/* Report Form (Accessible if logged in via Zustand state) */}
      {user && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Report an Unexpected Outage</h2>
          
          {validationError && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
              {validationError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Outage Title (e.g., Transformer Failure)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="px-4 py-2 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Area ID (from Prisma Area model)"
              value={form.areaId}
              onChange={(e) => setForm({ ...form, areaId: e.target.value })}
              className="px-4 py-2 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="px-4 py-2 border rounded-lg text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
            <button
              type="submit"
              disabled={reportMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition shadow-sm disabled:opacity-50"
            >
              {reportMutation.isPending ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
      )}

      {/* Outages List Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {outages.map((item: any) => (
          <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-medium">
                {item.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">{item.description || 'No additional details provided.'}</p>
            <div className="text-xs text-gray-500 pt-2 border-t flex justify-between">
              <span>Priority: {item.priority}</span>
              <span>Reported: {new Date(item.reportedAt).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}