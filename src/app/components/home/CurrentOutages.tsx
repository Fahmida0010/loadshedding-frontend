'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useAxiosSecure } from '@/src/hooks/useAxiosSecure';
import Loading from '../../loading';

export default function CurrentOutageSection() {
  const axiosSecure = useAxiosSecure(); 

  // Fetch Outages using TanStack Query with safety check for undefined data
  const { data: outages = [], isLoading, error: queryError } = useQuery({
    queryKey: ['outages'],
    queryFn: async () => {
      const res = await axiosSecure.get('/outages');
      // Safety check: ensure it always returns an array even if res.data is undefined
      return res.data?.data || res.data || [];
    },
  });

  if (isLoading) return <Loading />;

  if (queryError) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center text-red-500">
        <h2 className="text-xl font-bold">Failed to load outages</h2>
        <p className="text-sm">{(queryError as any)?.message || 'Something went wrong.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-orange-50 p-6 rounded-2xl border border-orange-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            Unexpected Outages & Reports 🛠️
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Track active power outages or sudden failures reported across different zones.
          </p>
        </div>
        <Link
          href="/outages"
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm shrink-0"
        >
          View All Outages & Report →
        </Link>
      </div>

      {/* Outages List Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Current Active Outage Reports</h3>
        </div>

        {Array.isArray(outages) && outages.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm">No unexpected outages reported right now.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {Array.isArray(outages) && outages.map((item: any) => (
              <div 
                key={item.id} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">
                      📍 {item.area?.name || item.Area?.name || 'Specified Area'} {item.area?.zone ? `(${item.area.zone})` : ''}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-800 font-semibold uppercase tracking-wide">
                      {item.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description || 'No additional details provided.'}
                  </p>
                </div>

                <div className="text-xs text-gray-500 pt-3 border-t flex justify-between items-center">
                  <span className="font-medium text-gray-700">
                    Priority: <span className="font-bold text-red-600">{item.priority}</span>
                  </span>
                  <span>{new Date(item.reportedAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}