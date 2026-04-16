import React, { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardShell from './DashboardShell';

const navItemToPath = {
  'mentor-dashboard': '/mentor/dashboard',
  'mentor-review': '/mentor/dashboard',
  'mentor-progress': '/mentor/dashboard',
  'mentor-feedback': '/mentor/dashboard'
};

const pathToSelected = (pathname) => {
  if (pathname.startsWith('/mentor/project/') && pathname.includes('/review')) return 'mentor-review';
  if (pathname.startsWith('/mentor/project/') && pathname.includes('/progress')) return 'mentor-progress';
  if (pathname.startsWith('/mentor/project/') && pathname.includes('/feedback')) return 'mentor-feedback';
  return 'mentor-dashboard';
};

const MentorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarSections = useMemo(
    () => [
      {
        id: 'mentor-dashboard',
        label: 'Mentor Control',
        defaultExpanded: true,
        items: [
          { id: 'mentor-dashboard', label: 'Project List' },
          { id: 'mentor-review', label: 'Project Review' },
          { id: 'mentor-progress', label: 'Project Progress' },
          { id: 'mentor-feedback', label: 'Feedback Center' }
        ]
      }
    ],
    []
  );

  return (
    <DashboardShell
      title="Mentor dashboard"
      subtitle="Review proposals, monitor progress, and guide teams with structured feedback."
      sidebarSections={sidebarSections}
      selectedSidebarItem={pathToSelected(location.pathname)}
      onSidebarSelect={(id) => navigate(navItemToPath[id] || '/mentor/dashboard')}
    >
      <Outlet />
    </DashboardShell>
  );
};

export default MentorLayout;
