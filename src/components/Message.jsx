import React from 'react';
import DOMPurify from 'dompurify';

export default function Message({ role, text }) {
  // Use DOMPurify and marked or just simple regex for markdown if needed via LLM.
  // We'll trust LLM HTML if sanitized or we just render newlines.
  
  // Basic markdown parser for bold and bullet points
  const formatText = (input) => {
    let formatted = input.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\n\*/g, '<br/>•');
    formatted = formatted.replace(/\n\-/g, '<br/>•');
    formatted = formatted.replace(/\n/g, '<br/>');
    return DOMPurify.sanitize(formatted);
  };

  return (
    <div className={`message-wrapper ${role}`}>
      <div 
        className={`message ${role}`} 
        role="text" 
        aria-label={`${role === 'bot' ? 'Assistant' : 'You'} said: ${text}`}
        dangerouslySetInnerHTML={{ __html: formatText(text) }}
      />
    </div>
  );
}
