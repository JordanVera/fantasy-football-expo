import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  async test() {
    const response = await fetch(`${this.baseUrl}/test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }

  async login(email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  }

  async signup(params: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    username: string;
    phoneNumber: string;
  }) {
    const response = await fetch(`${this.baseUrl}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Signup failed');
    }

    return response.json();
  }

  async createPicks(picks: { pick: string; entry: number }[], week: number) {
    const response = await fetch(`${this.baseUrl}/picks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
      },
      body: JSON.stringify({ picks, week }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create picks');
    }

    return response.json();
  }

  async getAllUsers() {
    const response = await fetch(`${this.baseUrl}/users/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch users');
    }

    return response.json();
  }

  async getUser(userId: string) {
    const response = await fetch(`${this.baseUrl}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch user');
    }

    return response.json();
  }

  async getLosers() {
    const response = await fetch(`${this.baseUrl}/losers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch losers');
    }

    return response.json();
  }

  async getAvailableWeeks(): Promise<number[]> {
    const response = await fetch(`${this.baseUrl}/dates/available`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch available weeks');
    }

    return (await response.json()).weeks;
  }

  async getStartingWeek(): Promise<number> {
    const response = await fetch(`${this.baseUrl}/dates/starting`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch starting week');
    }

    return (await response.json()).startingWeek;
  }
}

// Export a default instance
export const api = new ApiService();
