import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI, teamAPI, ticketAPI } from '../services/api';

const StudentTaskCreatePage = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [project, setProject] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    deadline: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [teamRes, projectRes] = await Promise.all([teamAPI.getMyTeam(), projectAPI.getMyProject()]);
        if (!cancelled) {
          setTeam(teamRes.data.data.team);
          setProject(projectRes.data.data);
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Could not load task creation data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isLeader = useMemo(
    () => team?.leader?._id && String(team.leader._id) === String(user.id),
    [team, user.id]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.assignedTo || !form.priority || !form.deadline) {
      setError('All fields are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      const response = await ticketAPI.createTicket(form);
      if (response.data.success) {
        setMessage('Task created successfully.');
        setForm({ title: '', description: '', assignedTo: '', priority: 'medium', deadline: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create task.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-sm text-slate-600">Loading...</div>;
  if (error && !team) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>;
  if (!isLeader) return <div className="text-sm text-slate-600">Only team leader can create tasks.</div>;
  if (!project || project.status !== 'approved') {
    return <div className="text-sm text-slate-600">Tasks can be created only after project approval.</div>;
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-xl font-bold text-slate-900">Create Task</h2>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      {message && <p className="mt-2 text-sm text-green-700">{message}</p>}
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Title"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          rows={4}
          placeholder="Description"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={form.assignedTo}
          onChange={(e) => setForm((prev) => ({ ...prev, assignedTo: e.target.value }))}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Assign member</option>
          {team.members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name} ({member.email})
            </option>
          ))}
        </select>
        <select
          value={form.priority}
          onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <input
          type="date"
          value={form.deadline}
          onChange={(e) => setForm((prev) => ({ ...prev, deadline: e.target.value }))}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? 'Creating...' : 'Create Task'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/student/tasks')}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Board
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentTaskCreatePage;
