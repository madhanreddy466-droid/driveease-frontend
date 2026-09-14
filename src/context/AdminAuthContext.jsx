import { createContext, useContext, useState } from 'react';

// Matches the ADMINS list from the old admin.html.
// Add more { email, pass, name, initials } entries here if you have other admins.
const ADMINS = [
  { email: 'madhan466@gmail.com', pass: '90909090', name: 'Madhan', initials: 'M' },
];

const STORAGE_KEY = 'driveease_admin';

const AdminAuthContext = createContext(null);

function readStoredAdmin() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(readStoredAdmin);

  const adminLogin = (email, pass) => {
    const match = ADMINS.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.pass === pass
    );
    if (!match) {
      throw new Error('Invalid admin email or password.');
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(match));
    setAdmin(match);
    return match;
  };

  const adminLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, adminLogin, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
