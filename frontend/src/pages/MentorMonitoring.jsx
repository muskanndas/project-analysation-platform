import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';

const MentorMonitoring = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await adminAPI.getMentorMonitoring();
        if (!cancelled && res.data.success) setRows(res.data.data);
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.message || 'Could not load mentor monitoring.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-lg font-semibold text-slate-900">Mentor Monitoring</h2>
        <p className="mt-1 text-sm text-slate-600">Reuses the same task-based progress calculation used in mentor monitoring.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
      {loading ? (
        <div className="text-sm text-slate-600">Loading mentor monitoring...</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-100">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Mentor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3 text-right">Tasks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r._id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{r.title}</td>
                  <td className="px-4 py-3 text-slate-700">{r.teamName}</td>
                  <td className="px-4 py-3 text-slate-700">
                    <div className="font-medium text-slate-900">{r.mentorName}</div>
                    <div className="text-xs text-slate-500">{r.mentorEmail}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                      {r.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full bg-indigo-600" style={{ width: `${r.progress}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{r.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {r.tasks.completed}/{r.tasks.total}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-slate-600" colSpan={6}>
                    No mentor-assigned projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MentorMonitoring;
