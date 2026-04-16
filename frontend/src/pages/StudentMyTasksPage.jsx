import React, { useEffect, useState } from 'react';
import { ticketAPI } from '../services/api';

const StudentMyTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await ticketAPI.getMyTasks();
      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load my tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleUpdate = async (ticketId, status) => {
    try {
      await ticketAPI.updateStatus({ ticketId, status });
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update task status.');
    }
  };

  if (loading) return <div className="text-sm text-slate-600">Loading my tasks...</div>;
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-xl font-bold text-slate-900">My Tasks</h2>
      <ul className="mt-4 space-y-3">
        {tasks.map((task) => (
          <li key={task._id} className="rounded-lg border border-slate-200 p-3">
            <p className="text-sm font-semibold text-slate-900">{task.title}</p>
            <p className="mt-1 text-xs text-slate-500">
              {task.priority} · due {new Date(task.deadline).toLocaleDateString()}
            </p>
            <p className="mt-1 text-xs text-slate-500">Project: {task.projectId?.title || 'N/A'}</p>
            <div className="mt-2">
              <select
                value={task.status}
                onChange={(e) => handleUpdate(task._id, e.target.value)}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs"
              >
                <option value="pending">pending</option>
                <option value="in-progress">in progress</option>
                <option value="completed">completed</option>
              </select>
            </div>
          </li>
        ))}
        {tasks.length === 0 && <li className="text-sm text-slate-600">No tasks assigned yet.</li>}
      </ul>
    </div>
  );
};

export default StudentMyTasksPage;
