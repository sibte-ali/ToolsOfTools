import { describe, it, expect } from 'vitest';
import { getFileGitDate } from './gitDate';

describe('getFileGitDate', () => {
  it('returns a valid YYYY-MM-DD date for a tracked git file', () => {
    const date = getFileGitDate('src/content/tools/en/krutidev-to-unicode.md');
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('falls back to provided fallback date if file does not exist', () => {
    const date = getFileGitDate('non-existent-file-xyz-123.md', '2026-01-15');
    expect(date).toBe('2026-01-15');
  });

  it('falls back to default date if no fallback provided and file not found', () => {
    const date = getFileGitDate('another-non-existent-file-456.md');
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('caches the result on repeated calls', () => {
    const date1 = getFileGitDate('src/content/tools/en/krutidev-to-unicode.md');
    const date2 = getFileGitDate('src/content/tools/en/krutidev-to-unicode.md');
    expect(date1).toBe(date2);
  });
});
