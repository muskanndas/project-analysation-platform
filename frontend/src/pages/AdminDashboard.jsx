import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import DashboardShell from '../components/DashboardShell';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await adminAPI.getDepartmentOverview();
        if (!cancelled && data.success) {
          setStats(data.data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.response?.data?.message || 'Could not load department overview.');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DashboardShell
      title="Admin dashboard"
      subtitle="Metrics and actions are limited to your department. Mentors you create are assigned to your department automatically."
    >
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {stats && (
        <dl className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm ring-1 ring-slate-100">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Students</dt>
            <dd className="mt-2 text-3xl font-bold text-slate-900">{stats.studentCount}</dd>
            <dd className="mt-1 text-xs text-slate-500">In {stats.department}</dd>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm ring-1 ring-slate-100">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mentors</dt>
            <dd className="mt-2 text-3xl font-bold text-slate-900">{stats.mentorCount}</dd>
            <dd className="mt-1 text-xs text-slate-500">In {stats.department}</dd>
          </div>
        </dl>
      )}
    </DashboardShell>
  );
};

export default AdminDashboard;
