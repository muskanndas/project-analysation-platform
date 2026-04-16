import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { feedbackAPI } from '../services/api';

const categories = ['backend', 'frontend', 'design', 'docs', 'testing'];
const priorities = ['low', 'medium', 'high'];

const MentorProjectFeedbackPage = () => {
  const { id } = useParams();
  const [feedback, setFeedback] = useState([]);
  const [form, setForm] = useState({ message: '', category: 'backend', priority: 'medium' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadFeedback = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await feedbackAPI.getProjectFeedback(id);
      if (response.data.success) setFeedback(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load feedback list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, [id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) {
      setError('Feedback message is required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const response = await feedbackAPI.createFeedback({ projectId: id, ...form, message: form.message.trim() });
      if (response.data.success) {
        setForm({ message: '', category: 'backend', priority: 'medium' });
        await loadFeedback();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-xl font-bold text-slate-900">Create Feedback</h2>
        {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
        <form onSubmit={handleCreate} className="mt-4 space-y-3">
          <textarea
            value={form.message}
            onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            rows={4}
            placeholder="Enter guidance for student team..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <div className="grid gap-3 md:grid-cols-2">
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={form.priority}
              onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
        <h3 className="text-lg font-semibold text-slate-900">Feedback List</h3>
        {loading ? (
          <p className="mt-3 text-sm text-slate-600">Loading feedback...</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {feedback.map((item) => (
              <li key={item._id} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm text-slate-800">{item.message}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {item.category} · {item.priority} · {item.status.replace('_', ' ')}
                </p>
              </li>
            ))}
            {feedback.length === 0 && <li className="text-sm text-slate-600">No feedback created yet.</li>}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MentorProjectFeedbackPage;
