import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import InputField from '../components/InputField';
import Button from '../components/Button';

const MentorManagement = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', expertise: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.getMentors();
      if (res.data.success) setMentors(res.data.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Could not load mentors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    setActionError('');
    setSuccess('');
    try {
      await adminAPI.deleteMentor(id);
      await load();
    } catch (e) {
      setActionError(e.response?.data?.message || 'Could not delete mentor.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setActionError('');
    setSuccess('');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setActionError('');
    setSuccess('');

    if (!form.name.trim() || !form.email.trim() || !form.password || !form.expertise.trim()) {
      setActionError('All fields are required.');
      return;
    }
    if (form.password.length < 6) {
      setActionError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await adminAPI.createMentor({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        expertise: form.expertise.trim(),
        department: user.department
      });
      if (res.data.success) {
        setSuccess('Mentor created successfully.');
        setForm({ name: '', email: '', password: '', expertise: '' });
        await load();
      }
    } catch (e) {
      setActionError(e.response?.data?.message || 'Could not create mentor.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-lg font-semibold text-slate-900">Mentors</h2>
        <p className="mt-1 text-sm text-slate-600">Create and manage mentor accounts.</p>
      </div>

      {(error || actionError) && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error || actionError}</div>
      )}
      {success && <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">{success}</div>}

      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Add mentor</h3>
        <form onSubmit={handleCreate} className="mt-4 grid gap-4 md:grid-cols-2">
          <InputField label="Name" name="name" value={form.name} onChange={handleChange} placeholder="Mentor name" />
          <InputField
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="mentor@university.edu"
          />
          <InputField
            label="Temporary password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
          />
          <InputField
            label="Expertise"
            name="expertise"
            value={form.expertise}
            onChange={handleChange}
            placeholder="e.g. Data Science"
          />
          <div className="md:col-span-2">
            <Button type="submit" loading={submitting} loadingMessage="Creating..." disabled={submitting} className="w-full rounded-xl py-3 text-sm font-semibold">
              Create mentor
            </Button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="text-sm text-slate-600">Loading mentors...</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-100">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mentors.map((m) => (
                <tr key={m._id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{m.name}</td>
                  <td className="px-4 py-3 text-slate-700">{m.email}</td>
                  <td className="px-4 py-3 text-slate-700">{m.department || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(m._id)}
                      className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {mentors.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-slate-600" colSpan={4}>
                    No mentors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MentorManagement;
