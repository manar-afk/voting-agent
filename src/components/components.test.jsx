import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Message from './Message';
import QuickActions from './QuickActions';
import WelcomeScreen from './WelcomeScreen';
import React from 'react';

describe('UI Components', () => {
  describe('Message Component', () => {
    it('should render user messages correctly', () => {
      render(<Message role="user" text="Hello" />);
      expect(screen.getByText('Hello')).toBeDefined();
      expect(screen.getByRole('text')).toHaveClass('user');
    });

    it('should render bot messages with formatting', () => {
      render(<Message role="bot" text="**Bold** text" />);
      const strong = screen.getByText('Bold');
      expect(strong.tagName).toBe('STRONG');
    });

    it('should trigger visual component placeholders', () => {
      render(<Message role="bot" text="Here is the timeline [SHOW_TIMELINE]" />);
      // Since it's lazy loaded, it might show the fallback first
      expect(screen.getByText(/Loading/i)).toBeDefined();
    });
  });

  describe('QuickActions Component', () => {
    it('should render action buttons', () => {
      const actions = ["Action 1", "Action 2"];
      render(<QuickActions actions={actions} onActionSelect={() => {}} />);
      expect(screen.getByText('Action 1')).toBeDefined();
      expect(screen.getByText('Action 2')).toBeDefined();
    });

    it('should call onActionSelect when a button is clicked', () => {
      const onSelect = vi.fn();
      render(<QuickActions actions={["Click Me"]} onActionSelect={onSelect} />);
      fireEvent.click(screen.getByText('Click Me'));
      expect(onSelect).toHaveBeenCalledWith('Click Me');
    });

    it('should handle Google Maps action separately', () => {
      const onSelect = vi.fn();
      // Mock window.open
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {});
      
      render(<QuickActions actions={["Find My Polling Booth"]} onActionSelect={onSelect} />);
      fireEvent.click(screen.getByText('Find My Polling Booth'));
      
      expect(openSpy).toHaveBeenCalled();
      expect(onSelect).not.toHaveBeenCalled();
      
      openSpy.mockRestore();
    });
  });

  describe('WelcomeScreen Component', () => {
    it('should render welcome options', () => {
      render(<WelcomeScreen onSelect={() => {}} />);
      expect(screen.getByText(/voted before/i)).toBeDefined();
    });

    it('should call onSelect with true when Yes is clicked after transition', () => {
      vi.useFakeTimers();
      const onSelect = vi.fn();
      render(<WelcomeScreen onSelect={onSelect} />);
      fireEvent.click(screen.getByText(/Yes/i));
      
      vi.runAllTimers();
      
      expect(onSelect).toHaveBeenCalledWith(true);
      vi.useRealTimers();
    });
  });
});
