import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { data } = body;
    
    if (!data) {
      return NextResponse.json(
        { message: 'No data provided' },
        { status: 400 }
      );
    }

    // For simplicity, return the base64 data as the URL
    // In production, you might upload to S3, Cloudinary, etc.
    return NextResponse.json({ url: data });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

