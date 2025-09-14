interface VideoGenerationRequest {
  prompt: string;
  duration?: number;
  aspectRatio?: string;
  quality?: string;
}

interface VideoGenerationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  thumbnailUrl?: string;
  prompt: string;
  duration?: number;
  aspectRatio?: string;
  quality?: string;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

export class VideoService {
  private static readonly API_ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
  private static readonly DEFAULT_MODEL = 'replicate/google/veo-3';
  private static readonly GENERATION_TIMEOUT = 15 * 60 * 1000; // 15 minutes

  private static getHeaders() {
    return {
      'CustomerId': 'cus_T3K1TXLa3rY9da',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer xxx',
    };
  }

  static async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    const { prompt, duration = 5, aspectRatio = '16:9', quality = 'standard' } = request;
    
    // Generate unique ID for this video generation
    const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Enhanced prompt with video generation specifications
    const enhancedPrompt = `Generate a high-quality video: ${prompt}. 
    Duration: ${duration} seconds, Aspect ratio: ${aspectRatio}, Quality: ${quality}.
    Create a visually engaging video with smooth transitions and professional cinematography.`;

    const requestBody = {
      model: this.DEFAULT_MODEL,
      messages: [
        {
          role: 'user',
          content: enhancedPrompt
        }
      ]
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.GENERATION_TIMEOUT);

      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Video generation failed with status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // The response should contain the video URL
      const videoUrl = data.choices?.[0]?.message?.content || data.content || data.url;
      
      if (!videoUrl) {
        throw new Error('No video URL returned from the generation service');
      }

      return {
        id: videoId,
        status: 'completed',
        videoUrl: videoUrl,
        prompt,
        duration,
        aspectRatio,
        quality,
        createdAt: new Date(),
        completedAt: new Date()
      };

    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            id: videoId,
            status: 'failed',
            prompt,
            duration,
            aspectRatio,
            quality,
            createdAt: new Date(),
            error: 'Video generation timeout - please try with a shorter duration or simpler prompt'
          };
        }
        
        return {
          id: videoId,
          status: 'failed',
          prompt,
          duration,
          aspectRatio,
          quality,
          createdAt: new Date(),
          error: error.message
        };
      }

      return {
        id: videoId,
        status: 'failed',
        prompt,
        duration,
        aspectRatio,
        quality,
        createdAt: new Date(),
        error: 'Unknown error occurred during video generation'
      };
    }
  }

  static validatePrompt(prompt: string): { isValid: boolean; error?: string } {
    if (!prompt.trim()) {
      return { isValid: false, error: 'Prompt cannot be empty' };
    }

    if (prompt.length < 10) {
      return { isValid: false, error: 'Prompt must be at least 10 characters long' };
    }

    if (prompt.length > 1000) {
      return { isValid: false, error: 'Prompt must be less than 1000 characters' };
    }

    // Check for potentially harmful content
    const harmfulPatterns = [
      /violence/i,
      /explicit/i,
      /nsfw/i,
      /adult content/i
    ];

    for (const pattern of harmfulPatterns) {
      if (pattern.test(prompt)) {
        return { isValid: false, error: 'Prompt contains inappropriate content' };
      }
    }

    return { isValid: true };
  }

  static getSystemPrompt(): string {
    return `You are an expert video generation AI assistant. Create high-quality, visually engaging videos based on user prompts. Focus on:

1. Professional cinematography with smooth camera movements
2. Rich visual details and atmospheric lighting
3. Coherent storytelling and scene composition  
4. Natural motion and realistic physics
5. Appropriate pacing for the specified duration
6. High production value and visual appeal

Generate videos that are suitable for professional and creative use cases. Avoid any inappropriate, violent, or explicit content.`;
  }
}

export type { VideoGenerationRequest, VideoGenerationResponse };