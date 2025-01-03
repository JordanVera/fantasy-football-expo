import { API_URL } from '@env';

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
    const response = await fetch(`${this.baseUrl}/login`, {
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

  async signup(email: string, password: string, name?: string) {
    const response = await fetch(`${this.baseUrl}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      throw new Error('Signup failed');
    }

    return response.json();
  }
}

// Export a default instance
export const api = new ApiService();
