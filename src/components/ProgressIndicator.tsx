'use client';

import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

export default function ProgressIndicator() {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('Initializing...');

  useEffect(() => {
    const stages = [
      { progress: 0, stage: 'Initializing video generation...' },
      { progress: 15, stage: 'Processing prompt and parameters...' },
      { progress: 25, stage: 'Analyzing scene composition...' },
      { progress: 40, stage: 'Generating video frames...' },
      { progress: 60, stage: 'Applying visual effects...' },
      { progress: 75, stage: 'Optimizing video quality...' },
      { progress: 85, stage: 'Rendering final video...' },
      { progress: 95, stage: 'Finalizing output...' },
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < stages.length) {
        setProgress(stages[currentIndex].progress);
        setStage(stages[currentIndex].stage);
        currentIndex++;
      }
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Main Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900 dark:text-white">
            Generating Your Video
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {progress}%
          </span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Current Stage */}
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {stage}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This may take up to 15 minutes depending on complexity
          </p>
        </div>
      </div>

      {/* Visual Indicator */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
        <div className="flex items-center justify-center space-x-2">
          {/* Animated Dots */}
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '1.4s'
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI is crafting your video with precision and creativity
          </p>
        </div>
      </div>

      {/* Estimated Time */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Estimated Time Remaining
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              5-15 minutes (varies by complexity and duration)
            </p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          Tips for Better Results:
        </h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Be specific with visual details and camera movements</li>
          <li>• Describe lighting, colors, and atmosphere</li>
          <li>• Include scene transitions for longer videos</li>
          <li>• Mention specific styles or moods you want</li>
        </ul>
      </div>
    </div>
  );
}