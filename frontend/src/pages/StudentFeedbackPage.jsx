import React, { useEffect, useState } from 'react';
import { feedbackAPI } from '../services/api';

const StudentFeedbackPage = () => {
  const [project, setProject] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFeedback = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await feedbackAPI.getStudentFeedback();
      if (response.data.success) {
        setProject(response.data.data.project);
        setFeedback(response.data.data.feedback);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load feedback.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const updateStatus = async (feedbackId, status) => {
    try {
      await feedbackAPI.updateStatus(feedbackId, status);
      await loadFeedback();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update feedback status.');
    }
  };

  if (loading) return <div className="text-sm text-slate-600">Loading feedback...</div>;
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-xl font-bold text-slate-900">Student Feedback</h2>
      {project && <p className="mt-1 text-sm text-slate-600">Project: {project.title}</p>}
      <ul className="mt-5 space-y-3">
        {feedback.map((item) => (
          <li key={item._id} className="rounded-lg border border-slate-200 p-3">
            <p className="text-sm text-slate-800">{item.message}</p>
            <p className="mt-1 text-xs text-slate-500">
              {item.category} · {item.priority} · {item.status.replace('_', ' ')}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => updateStatus(item._id, 'in_progress')}
                className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                disabled={item.status === 'resolved'}
              >
                Mark In Progress
              </button>
              <button
                type="button"
                onClick={() => updateStatus(item._id, 'resolved')}
                className="rounded-md bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700"
              >
                Mark Resolved
              </button>
            </div>
          </li>
        ))}
        {feedback.length === 0 && <li className="text-sm text-slate-600">No feedback found for your project.</li>}
      </ul>
    </div>
  );
};

export default StudentFeedbackPage;
