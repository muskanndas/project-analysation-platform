import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';

const filters = ['', 'pending', 'approved', 'rejected', 'changes_requested'];

const ProjectMonitoring = () => {
  const [status, setStatus] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async (selected) => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.getProjects(selected || undefined);
      if (res.data.success) setProjects(res.data.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Could not load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(status);
  }, [status]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm ring-1 ring-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Projects</h2>
            <p className="mt-1 text-sm text-slate-600">Monitor project submissions and mentor assignments.</p>
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            {filters.map((f) => (
              <option key={f || 'all'} value={f}>
                {f ? f.replace('_', ' ') : 'All statuses'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
      {loading ? (
        <div className="text-sm text-slate-600">Loading projects...</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-100">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Mentor</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{p.title}</td>
                  <td className="px-4 py-3 text-slate-700">{p.team?.name || '-'}</td>
                  <td className="px-4 py-3 text-slate-700">{p.mentor?.name || 'Unassigned'}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                      {p.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-slate-600" colSpan={4}>
                    No projects found.
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

export default ProjectMonitoring;
