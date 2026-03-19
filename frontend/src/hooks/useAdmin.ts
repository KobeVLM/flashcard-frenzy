import { useState, useEffect, useCallback } from 'react';
import * as adminService from '../api/adminService';
import type { AdminStats, AdminUser } from '../types';

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getAdminStats();
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.error?.message ?? 'Failed to load stats.');
      }
    } catch {
      setError('Failed to load admin stats. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getAdminUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError(response.error?.message ?? 'Failed to load users.');
      }
    } catch {
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}
