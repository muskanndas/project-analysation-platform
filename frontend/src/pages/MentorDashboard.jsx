import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mentorAPI } from '../services/api';

const FILTERS = ['', 'pending', 'approved', 'rejected', 'changes_requested'];

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const response = await mentorAPI.getProjects(statusFilter || undefined);
        if (!cancelled && response.data.success) {
          setProjects(response.data.data);
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Could not load projects.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-xl font-bold text-slate-900">Assigned projects</h2>
        <p className="mt-1 text-sm text-slate-600">Review, monitor, and provide feedback to your assigned teams.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const active = statusFilter === filter;
            const label = filter ? filter.replace('_', ' ') : 'all';
            return (
              <button
                key={filter || 'all'}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                  active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {loading && <div className="text-sm text-slate-600">Loading projects...</div>}
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}

      {!loading && !error && (
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-100">
          <ul className="divide-y divide-slate-200">
            {projects.map((project) => (
              <li key={project._id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{project.title}</p>
                  <p className="text-xs text-slate-500">{project.teamName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                    {project.status.replace('_', ' ')}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate(`/mentor/project/${project._id}/review`)}
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                  >
                    Review
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/mentor/project/${project._id}/progress`)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/mentor/project/${project._id}/feedback`)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Feedback
                  </button>
                </div>
              </li>
            ))}
            {projects.length === 0 && <li className="p-4 text-sm text-slate-600">No projects found for this filter.</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;
