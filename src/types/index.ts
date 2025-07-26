export interface User {
  id: string;
  email: string;
  name: string;
}

export interface TimesheetEntry {
  id: string;
  weekNumber: number;
  date: string;
  status: 'completed' | 'incomplete' | 'missing';
  hours: number;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface CreateTimesheetEntry {
  weekNumber: number;
  date: string;
  hours: number;
  description?: string;
}

export interface UpdateTimesheetEntry extends Partial<CreateTimesheetEntry> {
  id: string;
  status?: 'completed' | 'incomplete' | 'missing';
} 