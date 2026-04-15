import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import DashboardShell from '../components/DashboardShell';
import InputField from '../components/InputField';
import Button from '../components/Button';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [mentorForm, setMentorForm] = useState({
    name: '',
    email: '',
    password: '',
    expertise: ''
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await adminAPI.getDepartmentOverview();
        if (!cancelled && data.success) {
          setStats(data.data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.response?.data?.message || 'Could not load department overview.');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMentorForm((prev) => ({
      ...prev,
      [name]: value
    }));
    if (formError) {
      setFormError('');
    }
    if (formSuccess) {
      setFormSuccess('');
    }
  };

  const handleCreateMentor = async (e) => {
    e.preventDefault();

    if (!mentorForm.name.trim() || !mentorForm.email.trim() || !mentorForm.password || !mentorForm.expertise.trim()) {
      setFormError('All mentor account fields are required.');
      return;
    }

    if (mentorForm.password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (!stats?.department) {
      setFormError('Department context is still loading. Please wait and try again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await adminAPI.createMentor({
        name: mentorForm.name.trim(),
        email: mentorForm.email.trim().toLowerCase(),
        password: mentorForm.password,
        expertise: mentorForm.expertise.trim(),
        department: stats.department
      });

      if (response.data.success) {
        setFormSuccess('Mentor account created. The mentor can now log in with the assigned email and password.');
        setMentorForm({
          name: '',
          email: '',
          password: '',
          expertise: ''
        });
        const overview = await adminAPI.getDepartmentOverview();
        if (overview.data.success) {
          setStats(overview.data.data);
        }
      }
    } catch (e) {
      setFormError(e.response?.data?.message || 'Could not create mentor account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardShell
      title="Admin dashboard"
      subtitle="Metrics and actions are limited to your department. Mentors you create are assigned to your department automatically."
    >
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {stats && (
        <>
          <dl className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm ring-1 ring-slate-100">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Students</dt>
              <dd className="mt-2 text-3xl font-bold text-slate-900">{stats.studentCount}</dd>
              <dd className="mt-1 text-xs text-slate-500">In {stats.department}</dd>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm ring-1 ring-slate-100">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mentors</dt>
              <dd className="mt-2 text-3xl font-bold text-slate-900">{stats.mentorCount}</dd>
              <dd className="mt-1 text-xs text-slate-500">In {stats.department}</dd>
            </div>
          </dl>

          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">Create mentor account</h3>
            <p className="mt-1 text-sm text-slate-600">
              New mentors are created under your department ({stats.department}) and can sign in from the main login page.
            </p>

            {formError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{formError}</div>
            )}
            {formSuccess && (
              <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">{formSuccess}</div>
            )}

            <form onSubmit={handleCreateMentor} className="mt-5 grid gap-4 md:grid-cols-2">
              <InputField
                label="Mentor name"
                name="name"
                value={mentorForm.name}
                onChange={handleChange}
                placeholder="e.g. Arjun Mehta"
              />
              <InputField
                label="Mentor email"
                type="email"
                name="email"
                value={mentorForm.email}
                onChange={handleChange}
                placeholder="mentor@university.edu"
              />
              <InputField
                label="Temporary password"
                type="password"
                name="password"
                value={mentorForm.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
              />
              <InputField
                label="Expertise"
                name="expertise"
                value={mentorForm.expertise}
                onChange={handleChange}
                placeholder="e.g. Data Science, NLP"
              />

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  loading={isSubmitting}
                  loadingMessage="Creating mentor account..."
                  disabled={isSubmitting}
                  className="w-full rounded-xl py-3 text-sm font-semibold"
                >
                  Create mentor
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </DashboardShell>
  );
};

export default AdminDashboard;
