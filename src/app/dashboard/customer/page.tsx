'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useAxiosSecure } from '@/src/hooks/useAxiosSecure';
import Loading from '@/src/app/loading';

export default function CustomerDashboardPage() {
  const { user } = useAuthStore();
  const axiosSecure = useAxiosSecure();

  // 1. Fetch Customer Bills to check payment status dynamically
  const { data: bills = [] } = useQuery({
    queryKey: ['customer-dashboard-bills'],
    queryFn: async () => {
      const res = await axiosSecure.get('/bills/my-bills');
      return res.data?.data || res.data;
    },
  });

  // 2. Fetch Customer's Reported Outages (Reports)
  const { data: outages = [] } = useQuery({
    queryKey: ['customer-dashboard-outages'],
    queryFn: async () => {
      const res = await axiosSecure.get('/outages/my-reports'); // Apnar backend route onujayi adjust kore neben
      return res.data?.data || res.data;
    },
  });

  // 3. Fetch Load Shedding Schedules for User's Area
  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ['customer-dashboard-schedules'],
    queryFn: async () => {
      const res = await axiosSecure.get('/schedules/area-schedules'); // Apnar backend route onujayi adjust kore neben
      return res.data?.data || res.data;
    },
  });

  // Calculate unpaid bills count
  const unpaidBills = bills.filter((b: any) => b.status === 'UNPAID' || b.status === 'OVERDUE');
  const hasUnpaidBills = unpaidBills.length > 0;

  // Calculate active support tickets (reports not resolved/closed)
  const activeReports = outages.filter((o: any) => o.status !== 'RESOLVED' && o.status !== 'CLOSED');

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome, {user?.name || 'Customer'}! 👋</h2>
          <p className="text-sm text-slate-500 mt-1">Check local load shedding schedules, track reports, and view bill updates.</p>
        </div>
        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
          Customer Panel
        </span>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Power Status */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Power Status</p>
          <h3 className="text-2xl font-extrabold text-emerald-600 mt-2">🟢 Active</h3>
          <span className="text-xs text-slate-500 mt-1 inline-block">No interruption currently in your area</span>
        </div>

        {/* My Reports */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">My Reports</p>
          <h3 className="text-3xl font-extrabold text-blue-600 mt-2">
            {String(activeReports.length).padStart(2, '0')}
          </h3>
          <span className="text-xs text-slate-500 mt-1 inline-block">
            {activeReports.length} active support ticket(s)
          </span>
        </div>

        {/* Bills & Payments */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Bills & Payments</p>
          <h3 className={`text-3xl font-extrabold mt-2 ${hasUnpaidBills ? 'text-amber-600' : 'text-emerald-600'}`}>
            {hasUnpaidBills ? `${unpaidBills.length} Unpaid` : 'Paid'}
          </h3>
          <span className="text-xs text-slate-500 mt-1 inline-block">
            {hasUnpaidBills ? 'Pending dues need attention' : 'All dues cleared'}
          </span>
        </div>
      </div>

      {/* Schedule Alert Box */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Area Load Shedding Notice</h3>
          <p className="text-sm text-slate-500">Upcoming power cuts scheduled for your registered zone.</p>
        </div>

        {schedules.length === 0 ? (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 text-center">
            No upcoming load shedding schedules found for your area.
          </div>
        ) : (
          <div className="space-y-3">
            {schedules.map((schedule: any) => (
              <div 
                key={schedule.id}
                className="border border-amber-200 bg-amber-50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900"
              >
                <div>
                  <p className="font-semibold text-sm">{schedule.title || schedule.description || 'Load Shedding Notice'}</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Time: {new Date(schedule.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(schedule.scheduledEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className="bg-amber-200 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-lg uppercase">
                  {schedule.status || 'Scheduled'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}