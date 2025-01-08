// src/context/UsersContext.js
import React, { createContext, useContext, ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { api } from '../services/ApiService';
import type UserWithPicks from '../types/UserWithPicks';

// Define the context type
type UsersContextType = {
  users: UserWithPicks[];
  loadingUsers: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
};

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<UserWithPicks[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (): Promise<void> => {
    try {
      setLoadingUsers(true);
      setError(null);
      const data = await api.getAllUsers();

      console.log('data', data);
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

  return (
    <UsersContext.Provider value={{ users, loadingUsers, error, fetchUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsersContext must be used within a UsersProvider');
  }
  return context;
};
