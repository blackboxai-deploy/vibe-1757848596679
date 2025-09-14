import { NextRequest, NextResponse } from 'next/server';
import { VideoService } from '@/lib/videoService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { prompt, duration, aspectRatio, quality } = body;

    // Validate required fields
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Validate prompt
    const validation = VideoService.validatePrompt(prompt);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Validate optional parameters
    if (duration && (duration < 1 || duration > 30)) {
      return NextResponse.json(
        { error: 'Duration must be between 1 and 30 seconds' },
        { status: 400 }
      );
    }

    const validAspectRatios = ['16:9', '9:16', '1:1', '4:3', '3:4'];
    if (aspectRatio && !validAspectRatios.includes(aspectRatio)) {
      return NextResponse.json(
        { error: 'Invalid aspect ratio. Supported: 16:9, 9:16, 1:1, 4:3, 3:4' },
        { status: 400 }
      );
    }

    const validQualities = ['standard', 'high', 'premium'];
    if (quality && !validQualities.includes(quality)) {
      return NextResponse.json(
        { error: 'Invalid quality. Supported: standard, high, premium' },
        { status: 400 }
      );
    }

    // Generate video
    const result = await VideoService.generateVideo({
      prompt,
      duration: duration || 5,
      aspectRatio: aspectRatio || '16:9',
      quality: quality || 'standard'
    });

    // Store video information (in a real app, this would go to a database)
    // For now, we'll return the result directly
    return NextResponse.json({
      success: true,
      video: result
    });

  } catch (error) {
    console.error('Video generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error during video generation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Video Generation API',
    endpoint: '/api/generate-video',
    methods: ['POST'],
    systemPrompt: VideoService.getSystemPrompt(),
    supportedParameters: {
      prompt: 'string (required, 10-1000 characters)',
      duration: 'number (optional, 1-30 seconds, default: 5)',
      aspectRatio: 'string (optional, 16:9|9:16|1:1|4:3|3:4, default: 16:9)',
      quality: 'string (optional, standard|high|premium, default: standard)'
    }
  });
}