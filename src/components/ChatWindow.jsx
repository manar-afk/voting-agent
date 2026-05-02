import React, { useState } from 'react';
import Message from './Message';
import QuickActions from './QuickActions';
import WelcomeScreen from './WelcomeScreen';
import { useChat } from '../hooks/useChat';

const generateSessionId = () => Math.random().toString(36).substring(2, 15);

export default function ChatWindow() {
  const [userId] = useState(generateSessionId());
  const {
    messages,
    actions,
    isTyping,
    waitingForDob,
    hasAnsweredWelcome,
    endOfMessagesRef,
    handleWelcomeSelect,
    handleSend
  } = useChat(userId);
  
  const [inputVal, setInputVal] = useState('');

  const submitForm = (e) => {
    e.preventDefault();
    const text = inputVal.trim();
    if (text) {
      handleSend(text);
      setInputVal('');
    }
  };

  if (!hasAnsweredWelcome) {
    return <WelcomeScreen onSelect={handleWelcomeSelect} />;
  }

  return (
    <>
      <div className="chat-window" aria-live="polite">
        {messages.map((msg, idx) => (
          <Message key={idx} role={msg.role} text={msg.text} />
        ))}
        {isTyping && (
          <div className="typing-indicator" aria-label="Assistant is typing...">
            Voter-saathi is typing...
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {actions.length > 0 && <QuickActions onActionSelect={handleSend} actions={actions} />}

      <form className="input-area" onSubmit={submitForm}>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={waitingForDob ? "Enter your DOB (e.g. 1995-08-15)..." : "Ask about poll dates, IDs, Form 6..."}
          aria-label="Message Input"
          disabled={isTyping}
        />
        <button type="submit" disabled={isTyping || !inputVal.trim()} aria-label="Send Message">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>
    </>
  );
}

