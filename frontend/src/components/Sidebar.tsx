import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/decks', label: 'Decks', icon: 'layers' },
  { path: '/study', label: 'Study', icon: 'book_5' },
  { path: '/quiz', label: 'Quiz', icon: 'quiz' },
  { path: '/settings', label: 'Profile', icon: 'person' },
];

const adminNavItems = [
  { path: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { path: '/admin/users', label: 'User Management', icon: 'group' },
];

export function Sidebar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials =
    (user?.firstName?.charAt(0) ?? '').toUpperCase() +
    (user?.lastName?.charAt(0) ?? '').toUpperCase() || 'U';

  const displayName = user
    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'User'
    : 'User';

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-gray-300 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-800">
        <h1 className="text-lg font-bold text-white tracking-tight">Flashcard Frenzy</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {isAdmin ? 'Admin Panel' : 'Minimalist Learning'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {isAdmin && (
          <>
            <p className="px-3 text-xs font-semibold uppercase text-gray-500 mb-2">Admin</p>
            {adminNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <span className="material-icons text-xl">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
            <div className="border-t border-gray-800 my-3"></div>
          </>
        )}

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span className="material-icons text-xl">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-3 mb-3">
          {user?.profilePhotoUrl ? (
            <img
              src={user.profilePhotoUrl}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors w-full"
        >
          <span className="material-icons text-xl">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
