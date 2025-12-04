import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface QueryResponse {
  status: string;
  sql: string;
  data: Record<string, any>[];
  message?: string;
}

export const askQuestion = async (query: string): Promise<QueryResponse> => {
  try {
    const response = await api.post<QueryResponse>('/ask', { query });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'An error occurred');
    }
    throw new Error('Failed to connect to the server');
  }
};

export interface DashboardData {
  summary: {
    total_volume: number;
    total_count: number;
    avg_amount: number;
  };
  by_category: { name: string; value: number }[];
  daily_trend: { date: string; amount: number }[];
}

export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await api.get<DashboardData>('/dashboard');
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch dashboard data:", error);
    throw new Error('Failed to load dashboard data');
  }
};

export interface SavedReport {
  id: number;
  name: string;
  query: string;
  created_at: string;
}

export const getReports = async (): Promise<SavedReport[]> => {
  const response = await api.get<SavedReport[]>('/reports');
  return response.data;
};

export const saveReport = async (name: string, query: string): Promise<SavedReport> => {
  const response = await api.post<SavedReport>('/reports', { name, query });
  return response.data;
};

export const deleteReport = async (id: number): Promise<void> => {
  await api.delete(`/reports/${id}`);
};
