import { NextRequest, NextResponse } from 'next/server';

// In a real application, this would be connected to a database
// For demo purposes, we'll use in-memory storage
let videoStorage: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // In a real app, this would query from database with user authentication
    const videos = videoStorage.slice(offset, offset + limit);
    
    return NextResponse.json({
      success: true,
      videos,
      total: videoStorage.length,
      limit,
      offset
    });

  } catch (error) {
    console.error('Error fetching videos:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Add video to storage (in a real app, this would be saved to database)
    videoStorage.unshift({
      ...body,
      id: body.id || `video_${Date.now()}`,
      createdAt: new Date().toISOString()
    });
    
    // Keep only last 100 videos to prevent memory issues
    if (videoStorage.length > 100) {
      videoStorage = videoStorage.slice(0, 100);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Video saved successfully'
    });

  } catch (error) {
    console.error('Error saving video:', error);
    
    return NextResponse.json(
      { error: 'Failed to save video' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('id');
    
    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }
    
    const initialLength = videoStorage.length;
    videoStorage = videoStorage.filter(video => video.id !== videoId);
    
    if (videoStorage.length === initialLength) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Video deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting video:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}