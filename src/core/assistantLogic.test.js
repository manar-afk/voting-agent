import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processQuery, fallbackMatcher } from './assistantLogic';
import { FALLBACK_MESSAGES } from './constants';

// Mock fetch
global.fetch = vi.fn();

describe('Voter-saathi Assistant Logic Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fallbackMatcher', () => {
    it('should return neutral failsafe for political queries', () => {
      const response = fallbackMatcher("Who should I vote for?");
      expect(response).toBe(FALLBACK_MESSAGES.NEUTRAL_FAILSAFE);
    });

    it('should return timeline message for date queries', () => {
      const response = fallbackMatcher("When is the election?");
      expect(response).toBe(FALLBACK_MESSAGES.TIMELINE);
    });

    it('should return booth message for booth queries', () => {
      const response = fallbackMatcher("What happens inside the booth?");
      expect(response).toBe(FALLBACK_MESSAGES.BOOTH);
    });

    it('should return offline message for unknown queries', () => {
      const response = fallbackMatcher("Random text here");
      expect(response).toBe(FALLBACK_MESSAGES.OFFLINE);
    });
  });

  describe('processQuery', () => {
    it('should strictly block political opinions even before calling API', async () => {
      const response = await processQuery("Who should I vote for?", []);
      expect(response).toBe(FALLBACK_MESSAGES.NEUTRAL_FAILSAFE);
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should call backend API and return response text', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ text: "AI Response" })
      });

      const response = await processQuery("How do I register?", []);
      expect(response).toBe("AI Response");
      expect(fetch).toHaveBeenCalledWith('/api/chat', expect.any(Object));
    });

    it('should return fallback when API fails', async () => {
      fetch.mockRejectedValueOnce(new Error('Network Error'));

      const response = await processQuery("When is the poll?", []);
      expect(response).toBe(FALLBACK_MESSAGES.TIMELINE);
    });
  });
});

