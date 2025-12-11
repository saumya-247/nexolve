import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileAudio, FileImage, FileVideo, FileQuestion, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalysisProgress } from '@/components/AnalysisProgress';

const typeConfig = {
  audio: {
    icon: FileAudio,
    title: 'Audio Analysis',
    description: 'Upload audio files to detect voice manipulation',
    accept: 'audio/*',
    color: 'text-primary',
  },
  image: {
    icon: FileImage,
    title: 'Image Analysis',
    description: 'Detect face swaps and image manipulation',
    accept: 'image/*',
    color: 'text-primary',
  },
  video: {
    icon: FileVideo,
    title: 'Video Analysis',
    description: 'Analyze videos for deepfake content',
    accept: 'video/*',
    color: 'text-primary',
  },
  unknown: {
    icon: FileQuestion,
    title: 'Unknown File',
    description: 'We\'ll auto-detect and analyze any media',
    accept: 'audio/*,image/*,video/*',
    color: 'text-warning',
  },
};

export const UploadCard = ({ type, onAnalysisComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [error, setError] = useState(null);
  const config = typeConfig[type];
  const Icon = config.icon;

  const transformBackendResponse = (backendResult) => {
    const isDeepfake = backendResult.label === "FAKE";
    
    return {
      fileName: backendResult.filename,
      fileType: backendResult.file_type,
      overallScore: backendResult.confidence,
      isDeepfake: isDeepfake,
      confidence: backendResult.confidence,
      probability:backendResult.probability,
      segments: [
        {
          start: 0,
          end: 100,
          isFake: isDeepfake,
          confidence: backendResult.confidence,
          probability:backendResult.probability,
          reason: isDeepfake ? 'AI manipulation detected' : 'No manipulation detected'
        }
      ],
      details: [
        {
          label: 'Detection Status',
          value: backendResult.label,
          status: isDeepfake ? 'fake' : 'authentic'
        },
        {
          label: 'Confidence Score',
          value: `${backendResult.confidence}%`,
          status: backendResult.confidence > 70 ? (isDeepfake ? 'fake' : 'authentic') : 'warning'
        },
        {
          label: 'File Type',
          value: backendResult.file_type.toUpperCase(),
          status: 'info'
        },
        {
          label: 'Analysis Model',
          value: 'ViT (Vision Transformer)',
          status: 'info'
        }
      ],
      suspicious_frames: backendResult.suspicious_frames || []
    };
  };

  const simulateProgress = () => {
    setProgress(0);
    setStage('Initializing');
    
    const intervals = [
      { delay: 300, progress: 25, stage: 'Uploading file' },
      { delay: 600, progress: 50, stage: 'Analyzing content' },
      { delay: 900, progress: 75, stage: 'Processing results' },
      { delay: 1200, progress: 100, stage: 'Complete' }
    ];

    intervals.forEach(({ delay, progress, stage }) => {
      setTimeout(() => {
        setProgress(progress);
        setStage(stage);
      }, delay);
    });
  };

  const analyzeFile = async (file) => {
    setIsAnalyzing(true);
    setError(null);
    simulateProgress();

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const backendResult = await response.json();
      console.log('Backend result:', backendResult);

      const transformedResult = transformBackendResponse(backendResult);
      console.log('Transformed result:', transformedResult);

      if (onAnalysisComplete) {
        onAnalysisComplete(transformedResult);
      }

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message);
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
        setProgress(0);
        setStage('');
      }, 500);
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      analyzeFile(file);
    }
  }, []);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      analyzeFile(file);
    }
  }, []);

  const handleRemoveFile = useCallback((e) => {
    e.stopPropagation();
    setUploadedFile(null);
    setError(null);
  }, []);

  return (
    <Card
      variant="upload"
      className={cn(
        'group relative overflow-hidden',
        isDragging && 'border-primary bg-primary/5 glow-primary',
        uploadedFile && 'border-authentic/50',
        isAnalyzing && 'opacity-95'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={config.accept}
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        disabled={isAnalyzing}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="text-center pb-2">
        <div className={cn(
          'mx-auto mb-3 p-4 rounded-xl bg-secondary/50 transition-all duration-300 group-hover:scale-110',
          config.color
        )}>
          <Icon className="w-8 h-8" />
        </div>
        <CardTitle className={cn('text-lg', config.color)}>{config.title}</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="text-center">
        {isAnalyzing ? (
          <AnalysisProgress progress={progress} stage={stage} />
        ) : uploadedFile ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-authentic/10 rounded-lg border border-authentic/30">
              <span className="text-sm text-authentic truncate max-w-[150px]">
                {uploadedFile.name}
              </span>
              <button
                onClick={handleRemoveFile}
                className="p-1 hover:bg-fake/20 rounded-full transition-colors z-20 relative"
              >
                <X className="w-4 h-4 text-fake" />
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Upload className="w-4 h-4" />
            <span className="text-sm">Drop file or click to upload</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
