import { execSync } from 'node:child_process';
import fs from 'node:fs';

const dateCache = new Map<string, string>();

/**
 * Retrieves the last git commit date (YYYY-MM-DD) for a given file.
 * Falls back to file modification time (mtime) or fallback date if git is unavailable or file is uncommitted.
 */
export function getFileGitDate(filePath: string, fallbackDate?: string): string {
  if (dateCache.has(filePath)) {
    return dateCache.get(filePath)!;
  }

  let dateStr = '';
  try {
    const stdout = execSync(`git log -1 --format="%cs" -- "${filePath}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
    if (stdout && /^\d{4}-\d{2}-\d{2}$/.test(stdout)) {
      dateStr = stdout;
    }
  } catch {
    // git command failed or not in a git repo
  }

  if (!dateStr) {
    try {
      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        dateStr = stat.mtime.toISOString().split('T')[0];
      }
    } catch {
      // ignore stat errors
    }
  }

  if (!dateStr && fallbackDate) {
    dateStr = fallbackDate;
  }

  if (!dateStr) {
    dateStr = '2026-03-01';
  }

  dateCache.set(filePath, dateStr);
  return dateStr;
}
