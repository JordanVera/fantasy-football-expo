// src/context/UsersContext.js
import React, { createContext, useContext, ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { api } from '../services/ApiService';
import type UserWithPicks from '../types/UserWithPicks';
import type Loser from '../types/Loser';
import { useAuth } from './AuthContext';

// Define the context type
type UsersContextType = {
  users: UserWithPicks[];
  loadingUsers: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  losers: Loser[];
  loadingLosers: boolean;
  fetchLosers: () => Promise<void>;
  hasLosingPick: (entryNumber: number) => boolean;
};

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserWithPicks[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

  const [losers, setLosers] = useState<Loser[]>([]);
  const [loadingLosers, setLoadingLosers] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (): Promise<void> => {
    try {
      setLoadingUsers(true);
      setError(null);
      const data = await api.getAllUsers();

      console.log('usersData', data);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchLosers = async (): Promise<void> => {
    try {
      setLoadingLosers(true);
      setError(null);
      const data = await api.getLosers();

      if (data.success) {
        setLosers(data.losers);

        // console.log('losers', losers);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch losers');
    } finally {
      setLoadingLosers(false);
    }
  };

  const hasLosingPick = (entryNumber: number) => {
    if (!user?.Picks || !losers) return false;

    // Get all picks for this entry number
    const entryPicks = user.Picks.filter(
      (pick) => pick.entryNumber === entryNumber
    );

    // Check if any of the picks for this entry match a loser
    return entryPicks.some((pick) =>
      losers.some(
        (loser) => loser.team === pick.team && loser.week === pick.week
      )
    );
  };

  useEffect(() => {
    fetchUsers();
    fetchLosers();
  }, []);

  return (
    <UsersContext.Provider
      value={{
        users,
        loadingUsers,
        error,
        fetchUsers,
        losers,
        loadingLosers,
        fetchLosers,
        hasLosingPick,
      }}
    >
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
