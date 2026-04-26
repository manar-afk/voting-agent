import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import QuickActions from './QuickActions';
import { processQuery } from '../core/assistantLogic';

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Namaste! I am Voter-saathi, your hyper-localized Indian Election Assistant 🇮🇳. How can I assist you with the upcoming elections today?' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    const query = text.trim();
    if (!query) return;

    // Add user message
    const newMessages = [...messages, { role: 'user', text: query }];
    setMessages(newMessages);
    setInputVal('');
    setIsTyping(true);

    // Call the Assistant Engine
    const responseText = await processQuery(query, newMessages.slice(0, -1));

    setIsTyping(false);
    setMessages((prev) => [...prev, { role: 'bot', text: responseText }]);
  };

  const submitForm = (e) => {
    e.preventDefault();
    handleSend(inputVal);
  };

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

      <QuickActions onActionSelect={handleSend} />

      <form className="input-area" onSubmit={submitForm}>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask about poll dates, IDs, Form 6..."
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
