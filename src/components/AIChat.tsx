import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { playSound } from '../utils/sounds';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hi! I'm Mokshit's AI twin. Ask me anything about his work, skills, or projects!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const toggleChat = () => {
    if (!isOpen) playSound('open');
    else playSound('close');
    setIsOpen(!isOpen);
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);
    playSound('message');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.AIzaSyA58zhFCxgk-t8OaIQ6g4W-Zc324QVA8-Y });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }]
          }
        ],
        config: {
          systemInstruction: `You are Mokshit Sharma, a passionate AI/ML Engineer, Data Scientist, and Gen AI Specialist. 
          Your tone is professional yet approachable, enthusiastic about technology, and helpful. 
          You are proud of your projects like 'Reddit Sentiment Analysis', 'Zudio EDA', 'Credit Card Fraud Detection', and 'Zomato SQL Analysis'. 
          You have experience in building intelligent systems, predictive models, and scalable AI solutions.
          When people ask about your skills, mention your expertise in Python, NumPy, Pandas, Scikit-learn, TensorFlow, PyTorch, and NLP.
          If they ask about your work, talk about your internships and certifications from Google, Kaggle, and HackerRank.
          Keep your responses concise and engaging. Use technical terms correctly but explain them if needed. 
          You are currently looking for opportunities to solve real-world problems using AI.
          Answer as if you are Mokshit himself.`,
          temperature: 0.7,
        }
      });

      const botResponse = response.text || "I'm sorry, I couldn't process that. Could you try again?";
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
      playSound('message');
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Oops! My brain hit a snag. Let's try that again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-accent rounded-full flex items-center justify-center shadow-lg shadow-accent/20 text-slate-950 hover:bg-accent/90 transition-colors"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-ping opacity-75" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] md:w-[400px] h-[500px] glass-card flex flex-col overflow-hidden border-accent/20"
          >
            {/* Header */}
            <div className="p-4 border-b border-[var(--border-primary)] bg-accent/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <Bot size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[var(--text-primary)]">Mokshit's AI Twin</h4>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              <Sparkles className="text-accent/40" size={18} />
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-accent text-slate-950 rounded-tr-none' 
                      : 'bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form 
              onSubmit={handleSend}
              className="p-4 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]/50"
            >
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-accent/50 transition-colors text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-slate-950 hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;
