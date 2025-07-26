import { NextRequest, NextResponse } from 'next/server';

// Mock data for timesheets
const mockTimesheets = [
  {
    id: '1',
    weekNumber: 1,
    date: '2024-01-01',
    status: 'approved' as const,
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
    status: 'pending' as const,
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
    status: 'rejected' as const,
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
    status: 'approved' as const,
    hours: 40,
    description: 'Week 4 timesheet',
    userId: '1',
    createdAt: '2024-01-22T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    // In a real application, you would verify the JWT token here
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Timesheets retrieved successfully',
      data: mockTimesheets,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weekNumber, date, hours, description } = body;

    // In a real application, you would save this to a database
    const newTimesheet = {
      id: Date.now().toString(),
      weekNumber,
      date,
      status: 'pending' as const,
      hours,
      description,
      userId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Timesheet created successfully',
      data: newTimesheet,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
} 