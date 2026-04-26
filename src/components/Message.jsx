import React from 'react';
import DOMPurify from 'dompurify';
import ElectionTimeline from './ElectionTimeline';
import BoothWalkthrough from './BoothWalkthrough';

export default function Message({ role, text }) {
  // Basic markdown parser for bold and bullet points
  const formatText = (input) => {
    let formatted = input.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\n\*/g, '<br/>•');
    formatted = formatted.replace(/\n\-/g, '<br/>•');
    formatted = formatted.replace(/\n/g, '<br/>');
    return DOMPurify.sanitize(formatted);
  };

  const hasTimeline = text.includes('[SHOW_TIMELINE]');
  const hasBooth = text.includes('[SHOW_BOOTH]');
  
  let parts = [text];
  if (hasTimeline) parts = text.split('[SHOW_TIMELINE]');
  if (hasBooth) parts = text.split('[SHOW_BOOTH]');

  const cleanText = text.replace('[SHOW_TIMELINE]', '').replace('[SHOW_BOOTH]', '');

  return (
    <div className={`message-wrapper ${role}`}>
      <div 
        className={`message ${role}`} 
        role="text" 
        aria-label={`${role === 'bot' ? 'Assistant' : 'You'} said: ${cleanText}`}
      >
        {parts[0] && <div dangerouslySetInnerHTML={{ __html: formatText(parts[0]) }} />}
        
        {hasTimeline && <ElectionTimeline />}
        {hasBooth && <BoothWalkthrough />}
        
        {parts[1] && <div dangerouslySetInnerHTML={{ __html: formatText(parts[1]) }} />}
      </div>
    </div>
  );
}
