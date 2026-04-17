import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await adminAPI.getDashboard();
        if (!cancelled && data.success) {
          setStats(data.data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.response?.data?.message || 'Could not load admin dashboard.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}

      {loading && <div className="text-sm text-slate-600">Loading dashboard...</div>}

      {stats && (
        <dl className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm ring-1 ring-slate-100">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total students</dt>
            <dd className="mt-2 text-3xl font-bold text-slate-900">{stats.studentCount}</dd>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm ring-1 ring-slate-100">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total mentors</dt>
            <dd className="mt-2 text-3xl font-bold text-slate-900">{stats.mentorCount}</dd>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm ring-1 ring-slate-100">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total projects</dt>
            <dd className="mt-2 text-3xl font-bold text-slate-900">{stats.totalProjects}</dd>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm ring-1 ring-slate-100">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pending projects</dt>
            <dd className="mt-2 text-3xl font-bold text-slate-900">{stats.pendingProjects}</dd>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm ring-1 ring-slate-100">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Approved projects</dt>
            <dd className="mt-2 text-3xl font-bold text-slate-900">{stats.approvedProjects}</dd>
          </div>
        </dl>
      )}
    </div>
  );
};

export default AdminDashboard;
