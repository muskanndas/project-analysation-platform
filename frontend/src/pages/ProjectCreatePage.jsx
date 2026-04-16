import React, { useState } from 'react';
import { projectAPI } from '../services/api';

const ProjectCreatePage = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    techStack: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.techStack.trim() || !form.category.trim()) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        ...form,
        techStack: form.techStack
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      };
      const response = await projectAPI.createProject(payload);
      if (response.data.success) {
        setSuccess(
          response.data.data.mentorAssigned
            ? `Project submitted. Mentor assigned: ${response.data.data.mentor.name}`
            : 'Project submitted. Mentor assignment pending.'
        );
        setForm({ title: '', description: '', techStack: '', category: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-xl font-bold text-slate-900">Submit Project Proposal</h2>
      <p className="mt-1 text-sm text-slate-600">Only team leader can submit. Status starts as pending.</p>
      {error && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div>
      )}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Project title"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Project description"
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <input
          name="techStack"
          value={form.techStack}
          onChange={handleChange}
          placeholder="Tech stack (comma separated)"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-70"
        >
          {loading ? 'Submitting...' : 'Submit Project'}
        </button>
      </form>
    </div>
  );
};

export default ProjectCreatePage;
