import React, { useState } from 'react';
import { teamAPI } from '../services/api';

const TeamCreatePage = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Team name is required.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await teamAPI.createTeam({ name: name.trim() });
      if (response.data.success) {
        setSuccess('Team created successfully.');
        setName('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create team.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-xl font-bold text-slate-900">Create Team</h2>
      <p className="mt-1 text-sm text-slate-600">Create your team and become the team leader.</p>
      {error && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div>
      )}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Team name"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Creating...' : 'Create Team'}
        </button>
      </form>
    </div>
  );
};

export default TeamCreatePage;
