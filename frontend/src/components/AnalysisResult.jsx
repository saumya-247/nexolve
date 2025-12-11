import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  authentic: { icon: CheckCircle2, color: 'text-authentic', bg: 'bg-authentic/10', border: 'border-authentic/30' },
  fake: { icon: XCircle, color: 'text-fake', bg: 'bg-fake/10', border: 'border-fake/30' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' },
  info: { icon: Info, color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border' },
};

export const AnalysisResult = ({ result }) => {
  const overallStatus = result.isDeepfake ? 'fake' : 'authentic';
  const OverallIcon = statusConfig[overallStatus].icon;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Overall Result */}
      <Card variant={result.isDeepfake ? 'fake' : 'authentic'}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <OverallIcon className={cn('w-6 h-6', statusConfig[overallStatus].color)} />
              <span>{result.isDeepfake ? 'Deepfake Detected' : 'Authentic Content'}</span>
            </CardTitle>
            <Badge variant={result.isDeepfake ? 'destructive' : 'default'} className="font-display">
              {result.probability}% {result.isDeepfake ? 'Fake': 'Real'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            File: <span className="text-foreground">{result.fileName}</span>
          </p>
        </CardContent>
      </Card>

      {/* Timeline Visualization */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-base">Analysis Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-12 bg-secondary rounded-lg overflow-hidden">
            {result.segments.map((segment, index) => {
              const width = ((segment.end - segment.start) / 100) * 100;
              const left = segment.start;
              return (
                <div
                  key={index}
                  className={cn(
                    'absolute top-0 h-full transition-all duration-300 cursor-pointer group',
                    segment.isFake ? 'bg-fake/60 hover:bg-fake/80' : 'bg-authentic/60 hover:bg-authentic/80'
                  )}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  title={`${segment.isFake ? 'Fake' : 'Real'}: ${segment.confidence}% hi`}
                >
                  <div className={cn(
                    'absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-display opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10',
                    segment.isFake ? 'bg-fake text-fake-foreground' : 'bg-authentic text-authentic-foreground'
                  )}>
                    {segment.isFake ? 'Fake' : 'Real'} ({segment.confidence}%)
                  </div>
                </div>
              );
            })}
            
            {/* Scan line animation */}
            <div className="absolute top-0 w-0.5 h-full bg-foreground/50 animate-scan" />
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-muted-foreground font-display">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
          
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-authentic" />
              <span className="text-xs text-muted-foreground">Authentic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-fake" />
              <span className="text-xs text-muted-foreground">Fake/Manipulated</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-base">Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.details.map((detail, index) => {
            const config = statusConfig[detail.status];
            const Icon = config.icon;
            return (
              <div
                key={index}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border',
                  config.bg,
                  config.border
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-4 h-4', config.color)} />
                  <span className="text-sm font-medium">{detail.label}</span>
                </div>
                <span className={cn('text-sm font-display', config.color)}>{detail.value}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
