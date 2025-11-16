import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage, ChatSession, AUTO_RESPONSES, DEFAULT_AGENT } from '../types/chat';
import { useAuth } from '../contexts/AuthContext';

const CHAT_STORAGE_KEY = 'chat_sessions';
const TYPING_DELAY = 1000; // Simulated typing delay
const RESPONSE_DELAY = 2000; // Simulated response delay

export const useChat = () => {
  const { user } = useAuth();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Load chat session from localStorage
  useEffect(() => {
    if (!user) return;

    const savedSessions = localStorage.getItem(CHAT_STORAGE_KEY);
    if (savedSessions) {
      try {
        const sessions: ChatSession[] = JSON.parse(savedSessions);
        const userSession = sessions.find(s => s.userId === user.id && s.status === 'active');
        
        if (userSession) {
          setSession({
            ...userSession,
            messages: userSession.messages.map(m => ({
              ...m,
              timestamp: new Date(m.timestamp),
            })),
            startedAt: new Date(userSession.startedAt),
            lastMessageAt: new Date(userSession.lastMessageAt),
          });

          // Count unread messages
          const unread = userSession.messages.filter(m => m.sender === 'agent' && !m.read).length;
          setUnreadCount(unread);
        }
      } catch (e) {
        console.error('Error loading chat session:', e);
      }
    }
  }, [user]);

  // Save session to localStorage
  const saveSession = useCallback((updatedSession: ChatSession) => {
    if (!user) return;

    const savedSessions = localStorage.getItem(CHAT_STORAGE_KEY);
    let sessions: ChatSession[] = [];

    if (savedSessions) {
      try {
        sessions = JSON.parse(savedSessions);
      } catch (e) {
        console.error('Error parsing saved sessions:', e);
      }
    }

    // Update or add session
    const existingIndex = sessions.findIndex(s => s.id === updatedSession.id);
    if (existingIndex >= 0) {
      sessions[existingIndex] = updatedSession;
    } else {
      sessions.push(updatedSession);
    }

    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions));
    setSession(updatedSession);
  }, [user]);

  // Start new chat session
  const startChat = useCallback(() => {
    if (!user) return;

    const newSession: ChatSession = {
      id: `chat_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      messages: [
        {
          id: `msg_${Date.now()}`,
          text: AUTO_RESPONSES.greeting,
          sender: 'agent',
          timestamp: new Date(),
          read: false,
        },
      ],
      status: 'active',
      startedAt: new Date(),
      lastMessageAt: new Date(),
    };

    saveSession(newSession);
    setUnreadCount(1);
  }, [user, saveSession]);

  // Send message
  const sendMessage = useCallback((text: string) => {
    if (!session || !text.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      read: true,
    };

    const updatedSession: ChatSession = {
      ...session,
      messages: [...session.messages, userMessage],
      lastMessageAt: new Date(),
    };

    saveSession(updatedSession);

    // Simulate agent typing
    setAgentTyping(true);

    // Auto-response after delay
    setTimeout(() => {
      const response = getAutoResponse(text);
      const agentMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        text: response,
        sender: 'agent',
        timestamp: new Date(),
        read: isOpen,
      };

      const finalSession: ChatSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, agentMessage],
        lastMessageAt: new Date(),
      };

      saveSession(finalSession);
      setAgentTyping(false);

      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    }, RESPONSE_DELAY);
  }, [session, saveSession, isOpen]);

  // Get auto response based on keywords
  const getAutoResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery') || lowerMessage.includes('livraison')) {
      return AUTO_RESPONSES.shipping;
    }
    if (lowerMessage.includes('return') || lowerMessage.includes('refund') || lowerMessage.includes('retour')) {
      return AUTO_RESPONSES.returns;
    }
    if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('card')) {
      return AUTO_RESPONSES.payment;
    }
    if (lowerMessage.includes('loyalty') || lowerMessage.includes('points') || lowerMessage.includes('reward')) {
      return AUTO_RESPONSES.loyalty;
    }
    if (lowerMessage.includes('product') || lowerMessage.includes('item') || lowerMessage.includes('catalog')) {
      return AUTO_RESPONSES.products;
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('assist') || lowerMessage.includes('aide')) {
      return AUTO_RESPONSES.help;
    }

    return AUTO_RESPONSES.default;
  };

  // Open chat widget
  const openChat = useCallback(() => {
    setIsOpen(true);

    // Mark messages as read
    if (session) {
      const updatedSession: ChatSession = {
        ...session,
        messages: session.messages.map(m => ({ ...m, read: true })),
      };
      saveSession(updatedSession);
      setUnreadCount(0);
    }

    // Start new session if none exists
    if (!session) {
      startChat();
    }
  }, [session, saveSession, startChat]);

  // Close chat widget
  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  // End chat session
  const endChat = useCallback(() => {
    if (!session) return;

    const updatedSession: ChatSession = {
      ...session,
      status: 'closed',
    };

    saveSession(updatedSession);
    setSession(null);
    setIsOpen(false);
    setUnreadCount(0);
  }, [session, saveSession]);

  // Simulate user typing
  const setUserTyping = useCallback((typing: boolean) => {
    if (!session) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (typing) {
      typingTimeoutRef.current = setTimeout(() => {
        // Typing stopped
      }, TYPING_DELAY);
    }
  }, [session]);

  return {
    session,
    isOpen,
    agentTyping,
    unreadCount,
    agent: DEFAULT_AGENT,
    openChat,
    closeChat,
    sendMessage,
    endChat,
    setUserTyping,
  };
};
