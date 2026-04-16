import React, { useEffect, useMemo, useState } from 'react';
import { teamAPI } from '../services/api';

const TeamDashboardPage = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [actionState, setActionState] = useState({ loading: false, message: '', error: '' });

  const isLeader = useMemo(
    () => teamData?.team?.leader?._id && String(teamData.team.leader._id) === String(user.id),
    [teamData, user.id]
  );

  const loadTeam = async () => {
    try {
      const response = await teamAPI.getMyTeam();
      if (response.data.success) setTeamData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load team details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail.trim()) {
      setActionState({ loading: false, message: '', error: 'Email is required.' });
      return;
    }
    setActionState({ loading: true, message: '', error: '' });
    try {
      const response = await teamAPI.addMember({ email: memberEmail.trim().toLowerCase() });
      if (response.data.success) {
        setActionState({ loading: false, message: 'Member added successfully.', error: '' });
        setMemberEmail('');
        await loadTeam();
      }
    } catch (err) {
      setActionState({ loading: false, message: '', error: err.response?.data?.message || 'Failed to add member.' });
    }
  };

  const handleRemoveMember = async (memberId) => {
    setActionState({ loading: true, message: '', error: '' });
    try {
      const response = await teamAPI.removeMember(memberId);
      if (response.data.success) {
        setActionState({ loading: false, message: 'Member removed successfully.', error: '' });
        await loadTeam();
      }
    } catch (err) {
      setActionState({
        loading: false,
        message: '',
        error: err.response?.data?.message || 'Failed to remove member.'
      });
    }
  };

  if (loading) return <div className="text-sm text-slate-600">Loading team details...</div>;
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>;
  if (!teamData?.team) return <div className="text-sm text-slate-600">No team found. Create a team first.</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-xl font-bold text-slate-900">{teamData.team.name}</h2>
        <p className="mt-1 text-sm text-slate-600">Leader: {teamData.team.leader?.name}</p>
        <p className="mt-1 text-xs text-slate-500">Department: {teamData.team.department}</p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
        <h3 className="text-lg font-semibold text-slate-900">Members</h3>
        <ul className="mt-4 space-y-2">
          {teamData.team.members.map((member) => (
            <li key={member._id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-slate-900">{member.name}</p>
                <p className="text-xs text-slate-500">{member.email}</p>
              </div>
              {isLeader && String(member._id) !== String(user.id) && (
                <button
                  type="button"
                  onClick={() => handleRemoveMember(member._id)}
                  className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {isLeader && (
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">Add Member</h3>
          <form onSubmit={handleAddMember} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              placeholder="Student email"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={actionState.loading}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-70"
            >
              Add Member
            </button>
          </form>
          {actionState.error && <p className="mt-3 text-sm text-red-700">{actionState.error}</p>}
          {actionState.message && <p className="mt-3 text-sm text-green-700">{actionState.message}</p>}
        </div>
      )}
    </div>
  );
};

export default TeamDashboardPage;
