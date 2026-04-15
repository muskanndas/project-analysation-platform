import React from 'react';
import DashboardShell from '../components/DashboardShell';

const MentorDashboard = () => (
  <DashboardShell
    title="Mentor dashboard"
    subtitle="Guide students, review work, and collaborate within your department."
    badge="Mentor tools and queues for your cohort will appear here as the platform grows."
  >
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
      <p className="text-center text-slate-600">
        Welcome back. Check back soon for assigned students and review tasks.
      </p>
    </div>
  </DashboardShell>
);

export default MentorDashboard;
