import React, { useMemo, useState } from 'react';

/**
 * Shared layout for role dashboards (student, admin) — same visual theme.
 */
const DashboardShell = ({
  title,
  subtitle,
  badge,
  topBar,
  children,
  sidebarSections = [],
  sidebarFooterSection = null,
  selectedSidebarItem = '',
  onSidebarSelect
}) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const roleLabel = user.role ? `${user.role} profile` : 'Profile details';
  const departmentLabel = user.department || 'Not assigned';
  const emailLabel = user.email || 'No email available';
  const [expandedSections, setExpandedSections] = useState(() => {
    const defaultExpanded = {};
    sidebarSections.forEach((section) => {
      defaultExpanded[section.id] = section.defaultExpanded ?? true;
    });
    return defaultExpanded;
  });

  const hasSidebar = sidebarSections.length > 0;
  const displayName = user.name || 'Student';
  const initials = useMemo(() => {
    const trimmed = displayName.trim();
    if (!trimmed) return 'ST';
    return trimmed
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [displayName]);

  const handleToggle = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleItemClick = (itemId) => {
    if (onSidebarSelect) {
      onSidebarSelect(itemId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
      {topBar || (
        <nav className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Sambhavana</p>
              <p className="mt-1 text-sm text-slate-600">
                {user.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)} Portal` : 'User Portal'}
              </p>
            </div>
            <div className="grid gap-1 text-right text-sm text-slate-700">
              <p className="font-semibold text-slate-900">{user.name || 'User'}</p>
              <p className="text-slate-600">{roleLabel}</p>
              <p>
                <span className="font-semibold text-slate-900">Email ID:</span>{' '}
                <span className="break-all">{emailLabel}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-900">Department:</span>{' '}
                <span>{departmentLabel}</span>
              </p>
            </div>
          </div>
        </nav>
      )}
      <div className={hasSidebar ? 'mx-auto max-w-7xl px-4 py-6 lg:px-6' : 'mx-auto max-w-lg px-4 py-10'}>
        <div className={hasSidebar ? 'grid gap-6 lg:grid-cols-[280px_1fr]' : ''}>
          {hasSidebar && (
            <aside className="flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-sm ring-1 ring-slate-100">
              <div className="mb-4 px-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Overview</p>
              </div>
              <nav className="flex-1 space-y-2">
                {sidebarSections.map((section) => {
                  const isExpanded = expandedSections[section.id];
                  return (
                    <div key={section.id} className="rounded-xl border border-slate-200/80 bg-slate-50/70">
                      <button
                        type="button"
                        onClick={() => handleToggle(section.id)}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold text-slate-800"
                      >
                        <span>{section.label}</span>
                        <span className="text-slate-500">{isExpanded ? '−' : '+'}</span>
                      </button>
                      {isExpanded && (
                        <ul className="border-t border-slate-200/80 px-2 py-2">
                          {section.items.map((item) => {
                            const isSelected = selectedSidebarItem === item.id;
                            return (
                              <li key={item.id}>
                                <button
                                  type="button"
                                  onClick={() => handleItemClick(item.id)}
                                  className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white'
                                      : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
                                  }`}
                                >
                                  {item.label}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </nav>

              {sidebarFooterSection && (
                <div className="mt-4 rounded-2xl bg-slate-900 px-4 py-4 text-white">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{displayName}</p>
                      <p className="truncate text-xs text-slate-300">{emailLabel}</p>
                    </div>
                  </div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-slate-300">{sidebarFooterSection.label}</p>
                  <div className="space-y-1">
                    {sidebarFooterSection.items.map((item) => {
                      const isSelected = selectedSidebarItem === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleItemClick(item.id)}
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </aside>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Sambhavana</p>
            <h1 className="mt-2 bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
              {title}
            </h1>
            {subtitle && <p className="mt-2 text-sm leading-relaxed text-slate-600">{subtitle}</p>}
            <p className="mt-3 text-sm text-slate-700">
              Signed in as <span className="font-semibold text-slate-900">{user.name || 'User'}</span>
              {user.department ? (
                <>
                  {' '}
                  · <span className="font-medium text-indigo-700">{user.department}</span>
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
      </div>
    </div>
  );
};

export default DashboardShell;
