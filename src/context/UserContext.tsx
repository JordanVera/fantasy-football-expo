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
  getTotalActiveEntries: () => number;
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
  const [numberOfTotalActiveEntries, setNumberOfTotalActiveEntries] =
    useState<number>(0);
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

  const getTotalActiveEntries = (): number => {
    return users.reduce((total, user) => {
      // Get all entries for this user
      const totalEntries = user.bullets || 0;
      const inactiveEntries = user.Picks?.reduce((count, pick) => {
        // Check if this pick's entry has a losing pick
        const hasLosingPick = losers.some(
          (loser) => loser.team === pick.team && loser.week === pick.week
        );
        // If this entry has a losing pick, mark it as inactive
        return hasLosingPick ? new Set([...count, pick.entryNumber]) : count;
      }, new Set<number>());

      // Add the number of active entries (total - inactive) to the running total
      return total + (totalEntries - (inactiveEntries?.size || 0));
    }, 0);
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
        getTotalActiveEntries,
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
