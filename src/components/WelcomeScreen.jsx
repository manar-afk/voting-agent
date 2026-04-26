import React, { useState } from 'react';

export default function WelcomeScreen({ onSelect }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelection = (hasVotedBefore) => {
    setIsTransitioning(true);
    // Add a slight delay for visual transition
    setTimeout(() => {
      onSelect(hasVotedBefore);
    }, 400);
  };

  return (
    <div className={`welcome-screen ${isTransitioning ? 'fade-out' : 'fade-in'}`} aria-live="polite">
      <div className="welcome-card">
        <div className="welcome-icon">🇮🇳</div>
        <h2>Namaste! I am Voter-saathi</h2>
        <p className="welcome-subtitle">Your "Zero-Knowledge to Informed Voter" Assistant</p>
        
        <div className="welcome-question-container">
          <p className="welcome-question">To personalize your journey, I just have one quick question:</p>
          <h3 className="highlight-question">Have you ever voted before?</h3>
          
          <div className="welcome-actions">
            <button 
              className="btn-primary" 
              onClick={() => handleSelection(true)}
              aria-label="Yes, I have voted before"
            >
              Yes, I have voted
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => handleSelection(false)}
              aria-label="No, this is my first time"
            >
              No, I am a first-time voter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
