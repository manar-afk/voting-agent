import React from 'react';

const DEFAULT_ACTIONS = [
  "I am a First-Time Voter",
  "Poll Dates & Leave Rules",
  "Valid ID Checklist",
  "Voting Process Steps",
  "Find My Polling Booth"
];

export default function QuickActions({ onActionSelect, actions = DEFAULT_ACTIONS }) {
  const handleAction = (action) => {
    if (action === "Find My Polling Booth" || action === "Find Polling Booth") {
      // Use Google Maps Search for polling booths
      window.open('https://www.google.com/maps/search/polling+booth+near+me', '_blank');
      return;
    }
    onActionSelect(action);
  };

  return (
    <div className="quick-actions" aria-label="Suggested questions">
      {actions.map((action, index) => (
        <button
          key={index}
          className="quick-action-btn"
          onClick={() => handleAction(action)}
          aria-label={`Ask: ${action}`}
        >
          {action}
        </button>
      ))}
    </div>
  );
}
