import React from 'react';

const ACTIONS = [
  "I am a First-Time Voter",
  "Poll Dates & Leave Rules",
  "Valid ID Checklist",
  "Voting Process Steps",
  "Find My Polling Booth"
];

export default function QuickActions({ onActionSelect }) {
  return (
    <div className="quick-actions" aria-label="Suggested questions">
      {ACTIONS.map((action, index) => (
        <button
          key={index}
          className="quick-action-btn"
          onClick={() => onActionSelect(action)}
          aria-label={`Ask: ${action}`}
        >
          {action}
        </button>
      ))}
    </div>
  );
}
