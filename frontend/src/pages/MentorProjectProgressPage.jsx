import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mentorAPI } from '../services/api';

const MentorProjectProgressPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await mentorAPI.getProjectProgress(id);
        if (!cancelled && response.data.success) setData(response.data.data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Could not load project progress.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <div className="text-sm text-slate-600">Loading progress...</div>;
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>;
  if (!data) return <div className="text-sm text-slate-600">No progress data found.</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-xl font-bold text-slate-900">{data.project.title}</h2>
        <p className="mt-2 text-sm text-slate-600">Progress: {data.progress}%</p>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-indigo-600" style={{ width: `${data.progress}%` }} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">Completed: {data.summary.completed}</div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">In Progress: {data.summary.inProgress}</div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">Pending: {data.summary.pending}</div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
        <h3 className="text-lg font-semibold text-slate-900">Task Table</h3>
        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="pb-2 pr-4">Task</th>
                <th className="pb-2 pr-4">Assigned To</th>
                <th className="pb-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.tasks.map((task) => (
                <tr key={task._id} className="border-t border-slate-100">
                  <td className="py-2 pr-4">{task.name}</td>
                  <td className="py-2 pr-4">{task.assignedTo?.name || 'Unassigned'}</td>
                  <td className="py-2 pr-4 capitalize">{task.status.replace('_', ' ')}</td>
                </tr>
              ))}
              {data.tasks.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-3 text-slate-600">
                    No tasks yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">Activity Feed</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {data.activityLogs.map((log) => (
              <li key={log._id}>
                {log.message} <span className="text-xs text-slate-500">({new Date(log.createdAt).toLocaleString()})</span>
              </li>
            ))}
            {data.activityLogs.length === 0 && <li className="text-slate-600">No activities yet.</li>}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">Reports</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {data.reports.map((report) => (
              <li key={report._id}>
                <p className="font-semibold">{report.title}</p>
                <p className="text-xs text-slate-500 capitalize">{report.type} report</p>
              </li>
            ))}
            {data.reports.length === 0 && <li className="text-slate-600">No reports submitted yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MentorProjectProgressPage;
