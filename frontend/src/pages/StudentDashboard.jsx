import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../services/api';

const StudentDashboard = () => {
  const [data, setData] = useState({ team: null, project: null, mentor: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const response = await studentAPI.getDashboard();
        if (!cancelled && response.data.success) {
          setData(response.data.data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.response?.data?.message || 'Could not load dashboard data.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const teamStatus = data.team ? data.team.name : 'Not in team';
  const projectStatus = data.project ? data.project.status : 'Not created';
  const mentorStatus = data.mentor ? `Assigned (${data.mentor.name})` : 'Not assigned';

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-2xl font-bold text-slate-900">Welcome, {user.name || 'Student'}</h2>
        <p className="mt-2 text-sm text-slate-600">Track your team, proposal, and mentor assignment status from here.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Team Status</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{loading ? 'Loading...' : teamStatus}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Project Status</p>
          <p className="mt-2 text-lg font-semibold capitalize text-slate-900">{loading ? 'Loading...' : projectStatus}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mentor Status</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{loading ? 'Loading...' : mentorStatus}</p>
        </div>
      </div>

      {!loading && !data.team && (
        <button
          type="button"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          onClick={() => navigate('/student/team/create')}
        >
          Create Team
        </button>
      )}

      {!loading && data.team && !data.project && (
        <button
          type="button"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          onClick={() => navigate('/student/project/create')}
        >
          Go to Project Page
        </button>
      )}
    </div>
  );
};

export default StudentDashboard;
