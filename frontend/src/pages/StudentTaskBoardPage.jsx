import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI, ticketAPI, teamAPI } from '../services/api';

const columns = ['pending', 'in-progress', 'completed'];

const StudentTaskBoardPage = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [team, setTeam] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [progressData, setProgressData] = useState({ total: 0, completed: 0, progress: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [teamRes, projectRes] = await Promise.all([teamAPI.getMyTeam(), projectAPI.getMyProject()]);
      const teamInfo = teamRes.data.data.team;
      const projectInfo = projectRes.data.data;
      setTeam(teamInfo);
      setProject(projectInfo);
      const [ticketRes, progressRes] = await Promise.all([
        ticketAPI.getProjectTickets(projectInfo._id),
        ticketAPI.getProjectProgress(projectInfo._id)
      ]);
      setTickets(ticketRes.data.data);
      setProgressData(progressRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load task board.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const isLeader = useMemo(
    () => team?.leader?._id && String(team.leader._id) === String(user.id),
    [team, user.id]
  );

  const grouped = useMemo(() => {
    const base = { pending: [], 'in-progress': [], completed: [] };
    tickets.forEach((ticket) => {
      if (base[ticket.status]) {
        base[ticket.status].push(ticket);
      }
    });
    return base;
  }, [tickets]);

  const handleDelete = async (ticketId) => {
    try {
      await ticketAPI.deleteTicket(ticketId);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete task.');
    }
  };

  const handleUpdate = async (ticketId, status) => {
    try {
      await ticketAPI.updateStatus({ ticketId, status });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update task.');
    }
  };

  if (loading) return <div className="text-sm text-slate-600">Loading task board...</div>;
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-xl font-bold text-slate-900">Task Board</h2>
        <p className="mt-1 text-sm text-slate-600">{project?.title || 'Project'}</p>
        <p className="mt-2 text-sm text-slate-700">
          Progress: <span className="font-semibold">{progressData.progress}%</span> ({progressData.completed}/{progressData.total}
          {' '}completed)
        </p>
        {isLeader && (
          <button
            type="button"
            onClick={() => navigate('/student/tasks/create')}
            className="mt-4 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Create Task
          </button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((column) => (
          <div key={column} className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">{column.replace('-', ' ')}</h3>
            <div className="mt-3 space-y-3">
              {grouped[column].map((ticket) => (
                <div key={ticket._id} className="rounded-lg border border-slate-200 p-3">
                  <p className="text-sm font-semibold text-slate-900">{ticket.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{ticket.assignedTo?.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {ticket.priority} · {new Date(ticket.deadline).toLocaleDateString()}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <select
                      value={ticket.status}
                      onChange={(e) => handleUpdate(ticket._id, e.target.value)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                    >
                      <option value="pending">pending</option>
                      <option value="in-progress">in progress</option>
                      <option value="completed">completed</option>
                    </select>
                    {isLeader && (
                      <button
                        type="button"
                        onClick={() => handleDelete(ticket._id)}
                        className="rounded-md border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {grouped[column].length === 0 && <p className="text-xs text-slate-500">No tasks</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentTaskBoardPage;
