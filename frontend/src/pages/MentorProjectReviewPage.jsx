import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mentorAPI } from '../services/api';

const ACTIONS = ['approved', 'rejected', 'changes_requested'];

const MentorProjectReviewPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [action, setAction] = useState('approved');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [projectRes, reviewRes] = await Promise.all([mentorAPI.getReviewProject(id), mentorAPI.getReviews(id)]);
      if (projectRes.data.success) setProject(projectRes.data.data);
      if (reviewRes.data.success) setReviews(reviewRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load review page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Comment is mandatory for review.');
      return;
    }
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      const response = await mentorAPI.reviewProject({ projectId: id, action, comment: comment.trim() });
      if (response.data.success) {
        setMessage('Review submitted successfully.');
        setComment('');
        await loadData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-sm text-slate-600">Loading project review...</div>;
  if (error && !project) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>;
  if (!project) return <div className="text-sm text-slate-600">Project not found.</div>;

  const canAct = project.status === 'pending';

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-xl font-bold text-slate-900">{project.title}</h2>
        <p className="mt-1 text-sm text-slate-600">Team: {project.team?.name}</p>
        <p className="mt-3 text-sm text-slate-700">{project.description}</p>
        <p className="mt-3 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Tech Stack:</span> {project.techStack.join(', ')}
        </p>
        <p className="mt-2 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Category:</span> {project.category}
        </p>
        <p className="mt-2 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Status:</span>{' '}
          <span className="capitalize">{project.status.replace('_', ' ')}</span>
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
        <h3 className="text-lg font-semibold text-slate-900">Take Action</h3>
        {!canAct && <p className="mt-2 text-sm text-amber-700">Actions are disabled because this project is not pending.</p>}
        {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
        {message && <p className="mt-2 text-sm text-green-700">{message}</p>}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {ACTIONS.map((option) => (
              <button
                key={option}
                type="button"
                disabled={!canAct}
                onClick={() => setAction(option)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                  action === option ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                } disabled:opacity-50`}
              >
                {option.replace('_', ' ')}
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            disabled={!canAct}
            placeholder="Write your review comment..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none disabled:bg-slate-100"
          />
          <button
            type="submit"
            disabled={!canAct || submitting}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
        <h3 className="text-lg font-semibold text-slate-900">Review History</h3>
        <ul className="mt-4 space-y-3">
          {reviews.map((review) => (
            <li key={review._id} className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {review.action.replace('_', ' ')} · v{review.version}
              </p>
              <p className="mt-1 text-sm text-slate-800">{review.comment}</p>
              <p className="mt-1 text-xs text-slate-500">{new Date(review.createdAt).toLocaleString()}</p>
            </li>
          ))}
          {reviews.length === 0 && <li className="text-sm text-slate-600">No review history yet.</li>}
        </ul>
      </div>
    </div>
  );
};

export default MentorProjectReviewPage;
