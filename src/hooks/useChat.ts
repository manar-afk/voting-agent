import { useState, useEffect, useRef } from 'react';
import { processQuery, ChatMessage } from '../core/assistantLogic';
import { handleWelcomeBranch, checkEligibility } from '../services/electionService';

export function useChat(userId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [waitingForDob, setWaitingForDob] = useState(false);
  const [hasAnsweredWelcome, setHasAnsweredWelcome] = useState(false);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (hasAnsweredWelcome) {
      scrollToBottom();
    }
  }, [messages, isTyping, hasAnsweredWelcome]);

  const handleWelcomeSelect = async (hasVotedBefore: boolean) => {
    setIsTyping(true);
    setHasAnsweredWelcome(true);
    
    const branchData = await handleWelcomeBranch(userId, hasVotedBefore);
    
    setMessages([
      { role: 'bot', text: branchData.message }
    ]);
    if (branchData.options) {
      setActions(branchData.options);
    }
    
    setIsTyping(false);
  };

  const handleSend = async (text: string) => {
    const query = text.trim();
    if (!query) return;

    const userMsg: ChatMessage = { role: 'user', text: query };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsTyping(true);

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

    const responseText = await processQuery(query, newMessages.slice(0, -1));

    setIsTyping(false);
    setMessages((prev) => [...prev, { role: 'bot', text: responseText }]);
    
    if (query.toLowerCase().includes("electoral roll") || query.toLowerCase().includes("voter id")) {
        setActions(["What is Form 6?", "Check Eligibility"]);
    }
  };

  return {
    messages,
    actions,
    isTyping,
    waitingForDob,
    hasAnsweredWelcome,
    endOfMessagesRef,
    handleWelcomeSelect,
    handleSend
  };
}
