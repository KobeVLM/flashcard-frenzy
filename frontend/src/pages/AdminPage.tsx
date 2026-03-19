import React, { useState } from 'react';
import { useAdminStats, useAdminUsers } from '../hooks/useAdmin';
import { PageLayout } from '../components/Sidebar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { StatCard } from '../components/StatCard';
import * as adminService from '../api/adminService';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useAdminStats();
  const { users, loading: usersLoading, error: usersError, refetch: refetchUsers } = useAdminUsers();

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDeleteUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      await adminService.deleteAdminUser(userId);
      setDeleteConfirm(null);
      refetchUsers();
      refetchStats();
    } catch {
      // Error handled silently
    } finally {
      setActionLoading(null);
    }
  };

  const loading = statsLoading || usersLoading;
  const error = statsError || usersError;

  return (
    <PageLayout>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">System Administration</h2>
        <p className="text-gray-500 mt-1">Manage platform users and view system analytics.</p>
      </div>

      {loading && <LoadingSpinner message="Loading admin data..." />}
      {error && <ErrorMessage message={error} onRetry={() => { refetchStats(); refetchUsers(); }} />}

      {!loading && !error && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Users"
              value={stats?.totalUsers?.toLocaleString() ?? '0'}
              icon="group"
              subtitle="Up from last month"
            />
            <StatCard
              label="Total Decks"
              value={stats?.totalDecks?.toLocaleString() ?? '0'}
              icon="layers"
              subtitle="Consistent growth"
            />
            <StatCard
              label="Total Flashcards"
              value={stats?.totalFlashcards?.toLocaleString() ?? '0'}
              icon="content_copy"
              subtitle="Approaching 1M goal"
            />
            <StatCard
              label="Active Rate"
              value={stats?.activeRate ? `${stats.activeRate}%` : '—'}
              icon="trending_up"
              subtitle="Seasonal fluctuation"
            />
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Recent Users</h3>
              <span className="text-sm text-gray-400">
                Showing {users.length} of {stats?.totalUsers ?? users.length} users
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-semibold">
                            {u.fullName?.charAt(0)?.toUpperCase() ?? 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{u.fullName}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.id !== user?.id && (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setDeleteConfirm(u.id)}
                              disabled={actionLoading === u.id}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete user"
                            >
                              <span className="material-icons text-lg">delete</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-12 text-sm text-gray-400">
                No users found.
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete User?</h3>
                <p className="text-sm text-gray-500 mb-6">
                  This will permanently delete the user and all their data (decks, flashcards, quiz
                  results). This cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteUser(deleteConfirm)}
                    disabled={actionLoading === deleteConfirm}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {actionLoading === deleteConfirm ? 'Deleting...' : 'Delete User'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
}
