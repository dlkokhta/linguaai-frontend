import { describe, it, expect } from 'vitest';

const normalizeOptions = (options: string[]) =>
  options.flatMap((o) => o.trim().split(/\s+/));

describe('normalizeOptions', () => {
  it('splits multi-word options into separate words', () => {
    expect(normalizeOptions(['am going', 'was', 'is'])).toEqual(['am', 'going', 'was', 'is']);
  });

  it('leaves single-word options unchanged', () => {
    expect(normalizeOptions(['is', 'was', 'studying'])).toEqual(['is', 'was', 'studying']);
  });

  it('handles leading and trailing whitespace', () => {
    expect(normalizeOptions([' is ', ' was going '])).toEqual(['is', 'was', 'going']);
  });

  it('handles three-word options', () => {
    expect(normalizeOptions(['will have been'])).toEqual(['will', 'have', 'been']);
  });

  it('returns empty array for empty input', () => {
    expect(normalizeOptions([])).toEqual([]);
  });

  it('does not duplicate already single words', () => {
    const result = normalizeOptions(['drinks', 'drinking', 'drank']);
    expect(result).toEqual(['drinks', 'drinking', 'drank']);
  });
});
