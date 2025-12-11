import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

export const AnalysisProgress = ({ progress, stage }) => {
  return (
    <div className="w-full space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="text-sm font-display text-foreground">{stage}</span>
        </div>
        <span className="text-sm font-display text-primary">{progress}%</span>
      </div>
      
      <div className="relative">
        <Progress value={progress} className="h-2 bg-secondary" />
        <div 
          className="absolute top-0 left-0 h-full bg-primary/20 animate-pulse-slow rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground font-display">
        <span>Initializing</span>
        <span>Analyzing</span>
        <span>Processing</span>
        <span>Complete</span>
      </div>
    </div>
  );
};
