import React, { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardShell from './DashboardShell';

const navItemToPath = {
  'student-dashboard': '/student/dashboard',
  'create-team': '/student/team/create',
  'my-team': '/student/team',
  'add-members': '/student/team',
  'submit-project': '/student/project/create',
  'project-details': '/student/project',
  'tasks-board': '/student/tasks',
  'create-task': '/student/tasks/create',
  'my-tasks': '/student/tasks/my',
  'mentor-feedback': '/student/feedback',
  messages: '/student/dashboard',
  'my-profile': '/student/dashboard'
};

const pathToSelectedItem = (pathname) => {
  if (pathname.startsWith('/student/team/create')) return 'create-team';
  if (pathname.startsWith('/student/team')) return 'my-team';
  if (pathname.startsWith('/student/project/create')) return 'submit-project';
  if (pathname.startsWith('/student/project')) return 'project-details';
  if (pathname.startsWith('/student/tasks/create')) return 'create-task';
  if (pathname.startsWith('/student/tasks/my')) return 'my-tasks';
  if (pathname.startsWith('/student/tasks')) return 'tasks-board';
  if (pathname.startsWith('/student/feedback')) return 'mentor-feedback';
  return 'student-dashboard';
};

const StudentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarSections = useMemo(
    () => [
      {
        id: 'dashboard',
        label: 'Student Dashboard',
        defaultExpanded: true,
        items: [{ id: 'student-dashboard', label: 'Overview' }]
      },
      {
        id: 'team-management',
        label: 'Team Management',
        defaultExpanded: true,
        items: [
          { id: 'create-team', label: 'Create Team' },
          { id: 'my-team', label: 'My Team' },
          { id: 'add-members', label: 'Add Members' }
        ]
      },
      {
        id: 'project-management',
        label: 'Project Management',
        defaultExpanded: true,
        items: [
          { id: 'submit-project', label: 'Submit Project' },
          { id: 'project-details', label: 'Project Details' }
        ]
      },
      {
        id: 'feedback-communication',
        label: 'Feedback & Communication',
        defaultExpanded: true,
        items: [
          { id: 'mentor-feedback', label: 'Mentor Feedback' },
          { id: 'messages', label: 'Messages' }
        ]
      },
      {
        id: 'task-management',
        label: 'Task Management',
        defaultExpanded: true,
        items: [
          { id: 'tasks-board', label: 'Task Board' },
          { id: 'create-task', label: 'Create Task' },
          { id: 'my-tasks', label: 'My Tasks' }
        ]
      }
    ],
    []
  );

  const selectedSidebarItem = pathToSelectedItem(location.pathname);

  const sidebarFooterSection = useMemo(
    () => ({
      id: 'profile',
      label: 'Profile',
      items: [{ id: 'my-profile', label: 'My Profile' }]
    }),
    []
  );

  const handleSidebarSelect = (itemId) => {
    navigate(navItemToPath[itemId] || '/student/dashboard');
  };

  return (
    <DashboardShell
      title="Student workspace"
      subtitle="Manage team formation, project proposal submission, and mentor assignment in one place."
      sidebarSections={sidebarSections}
      sidebarFooterSection={sidebarFooterSection}
      selectedSidebarItem={selectedSidebarItem}
      onSidebarSelect={handleSidebarSelect}
    >
      <Outlet />
    </DashboardShell>
  );
};

export default StudentLayout;
