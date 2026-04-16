import React, { useEffect, useState } from 'react';
import { projectAPI } from '../services/api';

const statusColor = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

const ProjectDetailsPage = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await projectAPI.getMyProject();
        if (!cancelled && response.data.success) {
          setProject(response.data.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Could not load project details.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="text-sm text-slate-600">Loading project details...</div>;
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>;
  if (!project) return <div className="text-sm text-slate-600">No project found.</div>;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-xl font-bold text-slate-900">{project.title}</h2>
      <p className="mt-2 text-sm text-slate-700">{project.description}</p>
      <p className="mt-3 text-sm text-slate-700">
        <span className="font-semibold text-slate-900">Category:</span> {project.category}
      </p>
      <p className="mt-2 text-sm text-slate-700">
        <span className="font-semibold text-slate-900">Tech Stack:</span> {project.techStack.join(', ')}
      </p>
      <div className="mt-4">
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColor[project.status]}`}>
          {project.status}
        </span>
      </div>
      {project.status === 'pending' && (
        <p className="mt-3 text-sm text-amber-700">Your project is under review. Please wait for mentor feedback.</p>
      )}
      {project.status === 'rejected' && (
        <p className="mt-3 text-sm text-red-700">Your project was rejected. You can resubmit with improvements.</p>
      )}
      {project.status === 'approved' && (
        <p className="mt-3 text-sm text-green-700">Your project is approved. Next module is now enabled.</p>
      )}

      <div className="mt-5 border-t border-slate-200 pt-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Mentor Info</h3>
        {project.mentor ? (
          <div className="mt-2 text-sm text-slate-700">
            <p>
              <span className="font-semibold text-slate-900">Name:</span> {project.mentor.name}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Email:</span> {project.mentor.email}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-600">Mentor has not been assigned yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
