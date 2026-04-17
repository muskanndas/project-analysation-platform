import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';

const TaskMonitoring = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await adminAPI.getTasks();
        if (!cancelled && res.data.success) setTasks(res.data.data);
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.message || 'Could not load tasks.');
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
        <h2 className="text-lg font-semibold text-slate-900">Tasks</h2>
        <p className="mt-1 text-sm text-slate-600">System-wide ticket monitoring.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
      {loading ? (
        <div className="text-sm text-slate-600">Loading tasks...</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-100">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Assigned</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Project</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((t) => (
                <tr key={t._id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{t.title}</td>
                  <td className="px-4 py-3 text-slate-700">{t.assignedTo?.name || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                      {t.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{t.project?.title || '-'}</td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-slate-600" colSpan={4}>
                    No tasks found.
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

export default TaskMonitoring;
