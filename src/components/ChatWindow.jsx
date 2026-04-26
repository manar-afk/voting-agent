import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import QuickActions from './QuickActions';
import WelcomeScreen from './WelcomeScreen';
import { processQuery } from '../core/assistantLogic';
import { handleWelcomeBranch, checkEligibility } from '../services/electionService';

// Generate a random temporary session ID
const generateSessionId = () => Math.random().toString(36).substring(2, 15);

export default function ChatWindow() {
  const [hasAnsweredWelcome, setHasAnsweredWelcome] = useState(false);
  const [userId] = useState(generateSessionId());
  
  const [messages, setMessages] = useState([]);
  const [actions, setActions] = useState([]);
  
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [waitingForDob, setWaitingForDob] = useState(false);

  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (hasAnsweredWelcome) {
      scrollToBottom();
    }
  }, [messages, isTyping, hasAnsweredWelcome]);

  const handleWelcomeSelect = async (hasVotedBefore) => {
    setIsTyping(true);
    setHasAnsweredWelcome(true);
    
    // Call the service to determine the next branch
    const branchData = await handleWelcomeBranch(userId, hasVotedBefore);
    
    setMessages([
      { role: 'bot', text: branchData.message }
    ]);
    if (branchData.options) {
      setActions(branchData.options);
    }
    
    setIsTyping(false);
  };

  const handleSend = async (text) => {
    const query = text.trim();
    if (!query) return;

    // Add user message
    const newMessages = [...messages, { role: 'user', text: query }];
    setMessages(newMessages);
    setInputVal('');
    setIsTyping(true);

    // Interception logic for Eligibility check
    if (query.toLowerCase() === "check eligibility") {
      setWaitingForDob(true);
      setMessages([...newMessages, { role: 'bot', text: "Sure! To check if you are eligible to vote in the upcoming elections, please provide your Date of Birth (e.g., YYYY-MM-DD or 15 August 2005)." }]);
      setActions([]);
      setIsTyping(false);
      return;
    }

    if (waitingForDob) {
      setWaitingForDob(false);
      const result = checkEligibility(query);
      setMessages([...newMessages, { role: 'bot', text: result.message }]);
      setActions(result.options || ["What is Form 6?", "Electoral Roll vs Voter ID"]);
      setIsTyping(false);
      return;
    }

    // Call the Assistant Engine
    const responseText = await processQuery(query, newMessages.slice(0, -1));

    setIsTyping(false);
    setMessages((prev) => [...prev, { role: 'bot', text: responseText }]);
    
    // If the assistant just answered a general query, we can provide standard actions
    // or keep the last actions. For simplicity, we keep the last ones if none are strictly needed,
    // or reset them if they asked about forms.
    if (query.toLowerCase().includes("electoral roll") || query.toLowerCase().includes("voter id")) {
        setActions(["What is Form 6?", "Check Eligibility"]);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    handleSend(inputVal);
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
