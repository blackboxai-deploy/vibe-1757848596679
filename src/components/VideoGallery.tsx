'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { VideoGenerationResponse } from '@/lib/videoService';

export default function VideoGallery() {
  const [videos, setVideos] = useState<VideoGenerationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/videos');
      const data = await response.json();
      
      if (data.success) {
        setVideos(data.videos || []);
      } else {
        setError('Failed to load videos');
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVideo = async (videoId: string) => {
    try {
      const response = await fetch(`/api/videos?id=${videoId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setVideos(videos.filter(video => video.id !== videoId));
      } else {
        console.error('Failed to delete video');
      }
    } catch (err) {
      console.error('Error deleting video:', err);
    }
  };

  const downloadVideo = async (video: VideoGenerationResponse) => {
    if (!video.videoUrl) return;

    try {
      const response = await fetch(video.videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-video-${video.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Video Gallery
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Loading your videos...</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Error Loading Gallery
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <Button onClick={fetchVideos}>Try Again</Button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Video Gallery
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your generated videos will appear here
          </p>
        </div>
        
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        
        <div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No videos generated yet
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Generate Your First Video
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Video Gallery
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {videos.length} video{videos.length !== 1 ? 's' : ''} generated
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              {/* Video Thumbnail/Preview */}
              {video.videoUrl ? (
                <div className="relative">
                  <video
                    src={video.videoUrl}
                    className="w-full aspect-video object-cover"
                    muted
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {video.duration}s
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* Video Info */}
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-900 dark:text-white font-medium line-clamp-2">
                    {video.prompt}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {video.aspectRatio} • {video.quality}
                  </p>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'Unknown date'}
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => downloadVideo(video)}
                    disabled={!video.videoUrl}
                    className="flex-1"
                  >
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteVideo(video.id)}
                  >
                    Delete
                  </Button>
                </div>

                {video.status === 'failed' && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2">
                    <p className="text-xs text-red-700 dark:text-red-300">
                      Generation failed: {video.error || 'Unknown error'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <Button variant="outline" onClick={fetchVideos}>
          Refresh Gallery
        </Button>
      </div>
    </div>
  );
}