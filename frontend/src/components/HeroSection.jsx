import React from 'react';
import { Shield, Scan, Zap } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-fake/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 text-center space-y-6 max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-display text-primary animate-fade-in">
          <Shield className="w-4 h-4" />
          <span>Advanced AI Detection</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <span className="text-foreground">Detect </span>
          <span className="text-gradient-primary">Deepfakes</span>
          <br />
          <span className="text-foreground">With Precision</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Upload any media file and our AI will analyze it for manipulation, 
          identifying fake regions with detailed confidence scores.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 pt-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Scan className="w-5 h-5 text-primary" />
            <span className="text-sm">Frame-by-frame analysis</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-sm">Real-time detection</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm">99.7% accuracy</span>
          </div>
        </div>
      </div>
    </section>
  );
};
