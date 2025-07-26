import { ApiResponse, LoginCredentials, AuthResponse, TimesheetEntry, CreateTimesheetEntry, UpdateTimesheetEntry } from '../types';

// Mock data for timesheets
const mockTimesheets: TimesheetEntry[] = [
  {
    id: '1',
    weekNumber: 1,
    date: '2024-01-01',
    status: 'completed',
    hours: 40,
    description: 'Week 1 timesheet',
    userId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    weekNumber: 2,
    date: '2024-01-08',
    status: 'completed',
    hours: 38,
    description: 'Week 2 timesheet',
    userId: '1',
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
  },
  {
    id: '3',
    weekNumber: 3,
    date: '2024-01-15',
    status: 'incomplete',
    hours: 42,
    description: 'Week 3 timesheet',
    userId: '1',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '4',
    weekNumber: 4,
    date: '2024-01-22',
    status: 'completed',
    hours: 40,
    description: 'Week 4 timesheet',
    userId: '1',
    createdAt: '2024-01-22T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z',
  },
  {
    id: '5',
    weekNumber: 5,
    date: '2024-01-28',
    status: 'missing',
    hours: 0,
    description: '',
    userId: '1',
    createdAt: '2024-01-28T00:00:00Z',
    updatedAt: '2024-01-28T00:00:00Z',
  },
];

let timesheets = [...mockTimesheets];

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Mock API functions
async function mockApiRequest<T>(data: T, delay: number = 500): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Success',
        data,
      });
    }, delay);
  });
}

export const api = {
  // Auth endpoints
  login: async (credentials: LoginCredentials) => {
    // Dummy authentication
    if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
      const user = {
        id: '1',
        email: 'demo@example.com',
        name: 'John Doe',
      };
      const token = 'dummy-jwt-token-' + Date.now();
      
      return mockApiRequest<AuthResponse>({
        user,
        token,
      });
    } else {
      throw new ApiError(401, 'Invalid credentials');
    }
  },

  logout: async () => {
    return mockApiRequest({ message: 'Logged out successfully' });
  },

  // Timesheet endpoints
  getTimesheets: async () => {
    return mockApiRequest<TimesheetEntry[]>(timesheets);
  },

  getTimesheet: async (id: string) => {
    const timesheet = timesheets.find(t => t.id === id);
    if (!timesheet) {
      throw new ApiError(404, 'Timesheet not found');
    }
    return mockApiRequest<TimesheetEntry>(timesheet);
  },

  createTimesheet: async (data: CreateTimesheetEntry) => {
    const newTimesheet: TimesheetEntry = {
      id: Date.now().toString(),
      ...data,
      status: 'incomplete',
      userId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    timesheets.push(newTimesheet);
    return mockApiRequest<TimesheetEntry>(newTimesheet);
  },

  updateTimesheet: async (id: string, data: UpdateTimesheetEntry) => {
    const index = timesheets.findIndex(t => t.id === id);
    if (index === -1) {
      throw new ApiError(404, 'Timesheet not found');
    }
    timesheets[index] = { ...timesheets[index], ...data, updatedAt: new Date().toISOString() };
    return mockApiRequest<TimesheetEntry>(timesheets[index]);
  },

  deleteTimesheet: async (id: string) => {
    const index = timesheets.findIndex(t => t.id === id);
    if (index === -1) {
      throw new ApiError(404, 'Timesheet not found');
    }
    timesheets.splice(index, 1);
    return mockApiRequest({ message: 'Timesheet deleted successfully' });
  },
};

export { ApiError }; 