import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ElectionTimeline from './ElectionTimeline';
import BoothWalkthrough from './BoothWalkthrough';
import React from 'react';

// Mock Speech Synthesis
Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn(() => []),
  },
  writable: true,
});

describe('Visual Components', () => {
  describe('ElectionTimeline', () => {
    it('should render all 7 stages of the election process', () => {
      render(<ElectionTimeline />);
      expect(screen.getByText(/Notification/i)).toBeDefined();
      expect(screen.getByText(/Counting/i)).toBeDefined();
      const nodes = screen.getAllByText(/^\d$/); // Match single digits
      expect(nodes.length).toBe(7);
    });
  });

  describe('BoothWalkthrough', () => {
    it('should render the first step of the booth walkthrough', () => {
      render(<BoothWalkthrough />);
      expect(screen.getByText(/Identity Check/i)).toBeDefined();
      expect(screen.getByText(/Step 1 of 4/i)).toBeDefined();
    });
  });
});
