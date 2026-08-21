const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`API GET request failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`[API GET ${endpoint} Error]:`, error);
      throw error;
    }
  },

  post: async <T>(endpoint: string, body: any): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`API POST request failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`[API POST ${endpoint} Error]:`, error);
      throw error;
    }
  },
};
