import React, { useState, useCallback } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { UploadCard } from '@/components/UploadCard';
import { AnalysisResult } from '@/components/AnalysisResult';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

const Index = () => {
  const [analysisState, setAnalysisState] = useState('idle');
  const [result, setResult] = useState(null);

  const handleAnalysisComplete = useCallback((analysisResult) => {
    console.log('Analysis complete:', analysisResult);
    setResult(analysisResult);
    setAnalysisState('complete');
  }, []);

  const handleReset = useCallback(() => {
    setAnalysisState('idle');
    setResult(null);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      <main className="container mx-auto px-4 pb-20">
        {analysisState === 'idle' && (
          <section className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold font-display mb-2">
                Upload Media for Analysis
              </h2>
              <p className="text-muted-foreground">
                Choose a category or let us auto-detect your file type
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <UploadCard type="audio" onAnalysisComplete={handleAnalysisComplete} />
              <UploadCard type="image" onAnalysisComplete={handleAnalysisComplete} />
              <UploadCard type="video" onAnalysisComplete={handleAnalysisComplete} />
              <UploadCard type="unknown" onAnalysisComplete={handleAnalysisComplete} />
            </div>
          </section>
        )}

        {analysisState === 'complete' && result && (
          <section className="max-w-3xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold font-display mb-2">
                  Analysis Complete
                </h2>
                <p className="text-muted-foreground">
                  Review the detailed breakdown below
                </p>
              </div>
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                New Analysis
              </Button>
            </div>
            <AnalysisResult result={result} />
          </section>
        )}
      </main>
      
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground font-display">
          <p>Deepfake Detection System • Powered by Advanced AI</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
