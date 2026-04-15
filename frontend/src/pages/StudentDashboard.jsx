import React from 'react';
import DashboardShell from '../components/DashboardShell';

const StudentDashboard = () => (
  <DashboardShell
    title="Student dashboard"
    subtitle="Your space for coursework, submissions, and feedback from your cohort."
    badge="This area is for enrolled students only. Mentors and admins use their own dashboards after sign-in."
  >
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
      <p className="text-center text-slate-600">
        Project tools and listings for your department will appear here as the platform grows.
      </p>
    </div>
  </DashboardShell>
);

export default StudentDashboard;
