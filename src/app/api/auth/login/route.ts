import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Dummy authentication
    if (email === 'demo@example.com' && password === 'password') {
      const user = {
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
      };

      const token = 'dummy-jwt-token-' + Date.now();

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          token,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials',
        },
        { status: 401 }
      );
    }
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