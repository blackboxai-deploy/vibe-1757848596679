'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import ProgressIndicator from './ProgressIndicator';
import VideoPreview from './VideoPreview';
import type { VideoGenerationResponse } from '@/lib/videoService';

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState([5]);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [quality, setQuality] = useState('standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<VideoGenerationResponse | null>(null);
  const [error, setError] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a video prompt');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedVideo(null);

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          duration: duration[0],
          aspectRatio,
          quality,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video');
      }

      if (data.success && data.video) {
        setGeneratedVideo(data.video);
        
        // Save to video history
        await fetch('/api/videos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data.video),
        });
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (err) {
      console.error('Video generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate video');
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchSystemPrompt = async () => {
    try {
      const response = await fetch('/api/generate-video');
      const data = await response.json();
      setSystemPrompt(data.systemPrompt || '');
    } catch (err) {
      console.error('Failed to fetch system prompt:', err);
    }
  };

  // Load system prompt on component mount
  useState(() => {
    fetchSystemPrompt();
  });

  const handleReset = () => {
    setPrompt('');
    setDuration([5]);
    setAspectRatio('16:9');
    setQuality('standard');
    setGeneratedVideo(null);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          AI Video Generator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Transform your ideas into stunning videos using advanced AI technology. 
          Describe your vision and watch it come to life.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Generation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Your Video</CardTitle>
            <CardDescription>
              Describe the video you want to generate with as much detail as possible
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Prompt Input */}
            <div className="space-y-2">
              <Label htmlFor="prompt">Video Description</Label>
              <Textarea
                id="prompt"
                placeholder="A serene sunset over a calm lake with gentle ripples, surrounded by mountains and autumn trees. The camera slowly pans across the landscape as golden light reflects on the water..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] resize-none"
                maxLength={1000}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Be descriptive for best results</span>
                <span>{prompt.length}/1000</span>
              </div>
            </div>

            {/* Duration Slider */}
            <div className="space-y-2">
              <Label>Duration: {duration[0]} seconds</Label>
              <Slider
                value={duration}
                onValueChange={setDuration}
                max={30}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1s</span>
                <span>30s</span>
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <Label>Aspect Ratio</Label>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                  <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                  <SelectItem value="4:3">4:3 (Traditional)</SelectItem>
                  <SelectItem value="3:4">3:4 (Portrait Traditional)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quality */}
            <div className="space-y-2">
              <Label>Quality</Label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !prompt.trim()}
                className="flex-1"
              >
                {isGenerating ? 'Generating...' : 'Generate Video'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleReset}
                disabled={isGenerating}
              >
                Reset
              </Button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Result Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Video</CardTitle>
            <CardDescription>
              Your AI-generated video will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating && <ProgressIndicator />}
            
            {generatedVideo && !isGenerating && (
              <VideoPreview video={generatedVideo} />
            )}
            
            {!isGenerating && !generatedVideo && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Enter a prompt and click "Generate Video" to get started
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Prompt Display */}
      {systemPrompt && (
        <Card>
          <CardHeader>
            <CardTitle>AI System Configuration</CardTitle>
            <CardDescription>
              Current system prompt used for video generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {systemPrompt}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}