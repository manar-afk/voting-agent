import React, { useState, useEffect } from 'react';

const BOOTH_STEPS = [
  { 
    id: 1, 
    title: 'Officer 1: Identity Check', 
    desc: 'Present your Voter ID or alternative ID. The officer will check your name on the Electoral Roll and loudly call out your serial number.',
    icon: '🛂'
  },
  { 
    id: 2, 
    title: 'Officer 2 & 3: Ink & Register', 
    desc: 'Your left forefinger is marked with indelible ink. You sign or provide a thumb impression on the register, and receive a voter slip.',
    icon: '✍️'
  },
  { 
    id: 3, 
    title: 'The Voting Cabin', 
    desc: 'Hand the slip to the Presiding Officer and enter the voting cabin. Press the blue button on the EVM next to the symbol of your chosen candidate.',
    icon: '🗳️'
  },
  { 
    id: 4, 
    title: 'The 7-Second Rule (VVPAT)', 
    desc: 'Look at the VVPAT machine window. A printed paper slip with your candidate\'s symbol will appear for exactly 7 seconds before dropping into the sealed box. Verification complete!',
    icon: '⏱️'
  }
];

export default function BoothWalkthrough() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Cancel speech if component unmounts
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleNext = () => {
    if (currentStep < BOOTH_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  const currentData = BOOTH_STEPS[currentStep];

  return (
    <div className="booth-container" aria-label="Virtual Booth Simulation">
      <div className="booth-header">
        <h3>Virtual Booth Walkthrough</h3>
        <p>Step {currentStep + 1} of {BOOTH_STEPS.length}</p>
      </div>

      <div className="booth-card slide-up">
        <div className="booth-icon">{currentData.icon}</div>
        <h4>{currentData.title}</h4>
        <p>{currentData.desc}</p>
        
        <button 
          className="btn-speak" 
          onClick={() => speakText(currentData.desc)}
          aria-label="Listen to instructions"
        >
          {isSpeaking ? '🔊 Speaking...' : '🔈 Listen'}
        </button>
      </div>

      <div className="booth-controls">
        <button 
          onClick={handlePrev} 
          disabled={currentStep === 0}
          className="btn-booth-nav"
        >
          ← Back
        </button>
        <button 
          onClick={handleNext} 
          disabled={currentStep === BOOTH_STEPS.length - 1}
          className="btn-booth-nav primary"
        >
          Next →
        </button>
      </div>
      
      {/* Progress Dots */}
      <div className="booth-progress">
        {BOOTH_STEPS.map((_, idx) => (
          <span key={idx} className={`dot ${idx === currentStep ? 'active' : ''}`}></span>
        ))}
      </div>
    </div>
  );
}
