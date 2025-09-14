'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { VideoGenerationResponse } from '@/lib/videoService';

interface VideoPreviewProps {
  video: VideoGenerationResponse;
}

export default function VideoPreview({ video }: VideoPreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!video.videoUrl) return;

    setIsDownloading(true);
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
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && video.videoUrl) {
      try {
        await navigator.share({
          title: 'Check out this AI-generated video!',
          text: `Video: ${video.prompt.substring(0, 100)}...`,
          url: video.videoUrl,
        });
      } catch (error) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(video.videoUrl);
        alert('Video URL copied to clipboard!');
      }
    } else if (video.videoUrl) {
      navigator.clipboard.writeText(video.videoUrl);
      alert('Video URL copied to clipboard!');
    }
  };

  if (video.status === 'failed') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-red-900 dark:text-red-100 mb-2">
                Generation Failed
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                {video.error || 'An error occurred during video generation'}
              </p>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Please try again with a different prompt or settings
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Video Player */}
      {video.videoUrl ? (
        <div className="relative">
          <video
            src={video.videoUrl}
            controls
            className="w-full rounded-lg shadow-lg"
            style={{
              aspectRatio: video.aspectRatio?.replace(':', '/') || '16/9'
            }}
          >
            Your browser does not support the video tag.
          </video>
          
          {/* Video Overlay Info */}
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {video.duration}s • {video.quality}
          </div>
        </div>
      ) : (
        <div 
          className="bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center"
          style={{
            aspectRatio: video.aspectRatio?.replace(':', '/') || '16/9',
            minHeight: '200px'
          }}
        >
          <div className="text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Video preview not available
            </p>
          </div>
        </div>
      )}

      {/* Video Details */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Video Details
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {video.prompt}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {video.duration} seconds
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Aspect Ratio</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {video.aspectRatio}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Quality</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                {video.quality}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
              <p className="text-sm font-medium text-green-600 dark:text-green-400 capitalize">
                {video.status}
              </p>
            </div>
          </div>
          
          {video.createdAt && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Created: {new Date(video.createdAt).toLocaleString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button 
          onClick={handleDownload}
          disabled={!video.videoUrl || isDownloading}
          className="flex-1"
        >
          {isDownloading ? 'Downloading...' : 'Download Video'}
        </Button>
        <Button 
          variant="outline"
          onClick={handleShare}
          disabled={!video.videoUrl}
        >
          Share
        </Button>
      </div>

      {/* Success Message */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              Video Generated Successfully!
            </p>
            <p className="text-xs text-green-700 dark:text-green-300">
              Your video has been generated and saved to your gallery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}