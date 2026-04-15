import React from 'react';

/**
 * Shared layout for role dashboards (student, admin) — same visual theme.
 */
const DashboardShell = ({ title, subtitle, badge, children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 px-4 py-10">
      <div className="mx-auto max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
          Sambhavana
        </p>
        <h1 className="mt-2 bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {subtitle}
          </p>
        )}
        <p className="mt-3 text-sm text-slate-700">
          Signed in as{' '}
          <span className="font-semibold text-slate-900">{user.name || 'User'}</span>
          {user.department ? (
            <>
              {' '}
              ·{' '}
              <span className="font-medium text-indigo-700">{user.department}</span>
            </>
          ) : null}
        </p>
        {badge && (
          <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/80 px-4 py-3 text-sm text-indigo-900">
            {badge}
          </div>
        )}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
};

export default DashboardShell;
