interface InsightTraceProps {
  insights: Array<{
    id: string;
    caption: string;
    finding: string;
    recommendation: string;
    confidence: number;
  }>;
  className?: string;
}

export default function InsightTrace({ insights, className = "" }: InsightTraceProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {insights.map((insight, index) => (
        <div
          key={insight.id}
          className="relative pl-8 pb-4 border-l-2 border-neutral-200 last:border-l-transparent"
        >
          <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs text-white font-medium">{index + 1}</span>
          </div>
          
          <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
            <div>
              <h4 className="text-sm font-medium text-neutral-900">{insight.caption}</h4>
            </div>
            
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Finding</p>
              <p className="text-sm text-neutral-700">{insight.finding}</p>
            </div>
            
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Recommendation</p>
              <p className="text-sm text-neutral-700">{insight.recommendation}</p>
            </div>
            
            <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
              <span className="text-xs text-neutral-500">Confidence:</span>
              <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${insight.confidence * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-primary">
                {Math.round(insight.confidence * 100)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
