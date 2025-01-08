import { useState, useEffect } from 'react';
import { api } from '../services/ApiService';
import type UserWithPicks from '../types/UserWithPicks';

export function useUsers() {
  const [users, setUsers] = useState<UserWithPicks[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      setError(null);
      const data = await api.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loadingUsers,
    error,
    fetchUsers,
  };
}
