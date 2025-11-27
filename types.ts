export interface SnapshotData {
  score: number;
  style: string;
  keywords: string[];
}

export interface AnalysisResult {
  snapshot: SnapshotData;
  roast: string[];
  advice: string[];
  scoreComment: string;
}
