/**
 * GitHub API response types
 */
export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: 'file' | 'dir';
  content?: string;
  encoding?: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

export interface GitHubDirectory {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  type: 'dir';
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

export interface MigrationResult {
  success: boolean;
  fileName: string;
  filePath: string;
  error?: string;
}

export interface MigrationSummary {
  totalFiles: number;
  successCount: number;
  failCount: number;
  duration: number;
  results: MigrationResult[];
}

export interface BatchProgress {
  currentBatch: number;
  totalBatches: number;
  processedFiles: number;
  totalFiles: number;
  startTime: Date;
  estimatedCompletion?: Date;
}