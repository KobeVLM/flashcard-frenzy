import React, { useState } from 'react';
import { PageLayout } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import * as userService from '../api/userService';

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();

  // Profile form
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);

    try {
      const response = await userService.updateProfile({
        fullName: fullName !== user?.fullName ? fullName : undefined,
        email: email !== user?.email ? email : undefined,
      });
      if (response.success && response.data) {
        updateUser(response.data);
        setProfileSuccess('Profile updated successfully.');
      } else {
        setProfileError(response.error?.message ?? 'Failed to update profile.');
      }
    } catch {
      setProfileError('An unexpected error occurred.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await userService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (response.success) {
        setPasswordSuccess('Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(response.error?.message ?? 'Failed to change password.');
      }
    } catch {
      setPasswordError('An unexpected error occurred.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-500 mb-8">Manage your account settings and preferences.</p>

        {/* Profile Section */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Profile Information</h2>
          <p className="text-sm text-gray-500 mb-6">Update your personal details.</p>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
              {user?.fullName?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.fullName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className="inline-flex mt-1 px-2.5 py-0.5 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700">
                {user?.role}
              </span>
            </div>
          </div>

          {profileSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600 flex items-center gap-2">
                <span className="material-icons text-sm">check_circle</span>
                {profileSuccess}
              </p>
            </div>
          )}
          {profileError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <span className="material-icons text-sm">error</span>
                {profileError}
              </p>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            <button
              type="submit"
              disabled={profileLoading}
              className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {profileLoading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              Save Changes
            </button>
          </form>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Change Password</h2>
          <p className="text-sm text-gray-500 mb-6">Ensure your account stays secure.</p>

          {passwordSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600 flex items-center gap-2">
                <span className="material-icons text-sm">check_circle</span>
                {passwordSuccess}
              </p>
            </div>
          )}
          {passwordError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <span className="material-icons text-sm">error</span>
                {passwordError}
              </p>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            <button
              type="submit"
              disabled={passwordLoading}
              className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {passwordLoading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              Update Password
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl border border-red-100 p-6">
          <h2 className="text-lg font-semibold text-red-600 mb-1">Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-4">
            Once you log out, you will need to sign in again with your credentials.
          </p>
          <button
            onClick={logout}
            className="px-5 py-2.5 text-red-600 text-sm font-medium border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <span className="material-icons text-sm">logout</span>
            Log Out
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
