import { describe, it, expect, vi } from 'vitest';
import { checkEligibility, findForm, handleWelcomeBranch } from './electionService';

// Mock Firebase
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

    it('should identify users under 18 but near cutoff as eligible for advance application', () => {
      // Mock today as 2026-03-01. User turns 18 on 2026-03-15.
      // Next cutoff is April 1st 2026.
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-03-01'));
      
      const result = checkEligibility('2008-03-15');
      expect(result.eligible).toBe(true);
      expect(result.message).toContain('advance application');
      
      vi.useRealTimers();
    });

    it('should identify very young users as ineligible', () => {
      const result = checkEligibility('2020-01-01');
      expect(result.eligible).toBe(false);
      expect(result.message).toContain('must be 18 to vote');
    });

    it('should handle invalid dates gracefully', () => {
      const result = checkEligibility('not-a-date');
      expect(result.eligible).toBe(false);
      expect(result.message).toContain('valid date');
    });
  });

  describe('findForm', () => {
    it('should return Form 6 for registration intent', () => {
      expect(findForm('new voter').form).toBe('Form 6');
      expect(findForm('registering').form).toBe('Form 6');
    });

    it('should return Form 8 for correction intent', () => {
      expect(findForm('change address').form).toBe('Form 8');
      expect(findForm('correction').form).toBe('Form 8');
    });

    it('should return Form 7 for deletion intent', () => {
      expect(findForm('delete name').form).toBe('Form 7');
      expect(findForm('objection').form).toBe('Form 7');
    });
  });

  describe('handleWelcomeBranch', () => {
    it('should route experienced voters to Module C', async () => {
      const result = await handleWelcomeBranch('user123', true);
      expect(result.stage).toBe('Module_C_Booth');
      expect(result.options).toContain('Election Timeline');
    });

    it('should route new voters to Module A', async () => {
      const result = await handleWelcomeBranch('user456', false);
      expect(result.stage).toBe('Module_A_Foundation');
      expect(result.options).toContain('Check Eligibility');
    });
  });
});
