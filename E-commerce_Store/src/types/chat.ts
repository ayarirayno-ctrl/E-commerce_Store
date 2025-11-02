export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  read: boolean;
}

export interface ChatSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  messages: ChatMessage[];
  status: 'active' | 'closed';
  startedAt: Date;
  lastMessageAt: Date;
  agentTyping?: boolean;
  userTyping?: boolean;
}

export interface ChatAgent {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
}

export const DEFAULT_AGENT: ChatAgent = {
  id: 'agent-1',
  name: 'Sarah',
  avatar: '👩‍💼',
  status: 'online',
};

export const AUTO_RESPONSES: Record<string, string> = {
  greeting: "Hello! 👋 I'm Sarah, your customer support agent. How can I help you today?",
  shipping: "We offer free shipping on orders over $50. Standard delivery takes 3-5 business days, and express shipping is 1-2 days. 📦",
  returns: "We have a 30-day return policy. Items must be unused and in original packaging. Return shipping is free! 🔄",
  payment: "We accept all major credit cards, PayPal, and Apple Pay. All payments are secured with SSL encryption. 💳",
  loyalty: "Our loyalty program has 4 tiers: Bronze, Silver, Gold, and Platinum. Earn 10 points per €1 spent, with multipliers up to 2.5x! 🎁",
  products: "We have over 200 products across electronics, fashion, home & garden, and sports categories. What are you looking for? 🔍",
  help: "I can help you with:\n• Order tracking\n• Shipping information\n• Returns & refunds\n• Product questions\n• Loyalty program\n• Payment issues\n\nWhat would you like to know?",
  default: "Thank you for your message! A support agent will respond shortly. In the meantime, you can check our FAQ section. 😊",
};
