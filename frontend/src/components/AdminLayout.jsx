import React, { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiActivity, FiBookOpen, FiCheckSquare, FiClipboard, FiHome, FiUsers } from 'react-icons/fi';
import DashboardShell from './DashboardShell';

const navItemToPath = {
  'admin-dashboard': '/admin/dashboard',
  'admin-students': '/admin/students',
  'admin-mentors': '/admin/mentors',
  'admin-projects': '/admin/projects',
  'admin-tasks': '/admin/tasks',
  'admin-mentor-monitoring': '/admin/mentor-monitoring'
};

const pathToSelected = (pathname) => {
  if (pathname.startsWith('/admin/students')) return 'admin-students';
  if (pathname.startsWith('/admin/mentors')) return 'admin-mentors';
  if (pathname.startsWith('/admin/projects')) return 'admin-projects';
  if (pathname.startsWith('/admin/tasks')) return 'admin-tasks';
  if (pathname.startsWith('/admin/mentor-monitoring')) return 'admin-mentor-monitoring';
  return 'admin-dashboard';
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarSections = useMemo(
    () => [
      {
        id: 'admin-core',
        label: 'Admin Panel',
        defaultExpanded: true,
        items: [
          { id: 'admin-dashboard', label: 'Dashboard', icon: FiHome },
          { id: 'admin-students', label: 'Students', icon: FiUsers },
          { id: 'admin-mentors', label: 'Mentors', icon: FiBookOpen },
          { id: 'admin-projects', label: 'Projects', icon: FiClipboard },
          { id: 'admin-tasks', label: 'Tasks', icon: FiCheckSquare },
          { id: 'admin-mentor-monitoring', label: 'Mentor Monitoring', icon: FiActivity }
        ]
      }
    ],
    []
  );

  // DashboardShell sidebar currently renders label-only. We keep icon metadata for future enhancement.
  const sidebarNoIcons = sidebarSections.map((section) => ({
    ...section,
    items: section.items.map(({ id, label }) => ({ id, label }))
  }));

  return (
    <DashboardShell
      title="Admin control panel"
      subtitle="Monitor students, mentors, projects, and tasks across the system."
      sidebarSections={sidebarNoIcons}
      selectedSidebarItem={pathToSelected(location.pathname)}
      onSidebarSelect={(id) => navigate(navItemToPath[id] || '/admin/dashboard')}
    >
      <Outlet />
    </DashboardShell>
  );
};

export default AdminLayout;
