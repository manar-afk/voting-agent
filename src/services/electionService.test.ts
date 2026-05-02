import { describe, it, expect, vi } from 'vitest';
import { checkEligibility, findForm } from './electionService';

vi.mock('../firebaseConfig', () => ({
  db: {},
  analytics: {}
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(() => Promise.resolve())
}));

vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn()
}));

describe('Election Service Logic', () => {
  describe('checkEligibility', () => {
    it('should identify 18+ voters as eligible', () => {
      const result = checkEligibility('2000-01-01');
      expect(result.eligible).toBe(true);
      expect(result.message).toContain('eligible to register');
    });

    it('should handle leap year birthdays correctly', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-02-28'));
      const result = checkEligibility('2007-02-29'); // March 1st, 2007
      expect(result.eligible).toBe(false); // Not 18 by April 1st cutoff
      vi.useRealTimers();
    });

    it('should identify users under 18 but near cutoff as eligible for advance application', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-03-01'));
      const result = checkEligibility('2008-03-15');
      expect(result.eligible).toBe(true);
      expect(result.message).toContain('advance application');
      vi.useRealTimers();
    });

    it('should identify boundary cases (birthday on cutoff day)', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-03-31'));
      // Birthday on April 1st (next cutoff)
      const result = checkEligibility('2008-04-01');
      expect(result.eligible).toBe(true);
      expect(result.message).toContain('advance application');
      vi.useRealTimers();
    });
  });

  describe('findForm', () => {
    it('should return Unknown for ambiguous intent', () => {
      const result = findForm('I want a burger');
      expect(result.form).toBe('Unknown');
    });
  });
});
