/**
 * Only these accounts may exist as admins (enforced at seed, login, and DB validation).
 * Password for all is set at seed time (default: password123, override with SEED_ADMIN_PASSWORD).
 */
export const SEEDED_ADMIN_ACCOUNTS = [
  { email: 'cs_admin@system.com', name: 'Admin (CS)', department: 'Computer Science' },
  { email: 'ai_admin@system.com', name: 'Admin (AI)', department: 'AI' },
  { email: 'ec_admin@system.com', name: 'Admin (EC)', department: 'EC' },
];

export const SEEDED_ADMIN_EMAILS = SEEDED_ADMIN_ACCOUNTS.map((a) => a.email.toLowerCase());

export const getSeededAdminByEmail = (email) => {
  const e = String(email || '')
    .trim()
    .toLowerCase();
  return SEEDED_ADMIN_ACCOUNTS.find((a) => a.email.toLowerCase() === e) || null;
};

/** True if this user is one of the three seeded department admins (email + department match). */
export const isAuthorizedSeededAdmin = (user) => {
  if (!user || user.role !== 'admin') return false;
  const def = getSeededAdminByEmail(user.email);
  if (!def) return false;
  return String(user.department || '').trim() === def.department;
};
