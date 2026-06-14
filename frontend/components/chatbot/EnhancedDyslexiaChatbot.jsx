'use client';

import { useState, useRef, useEffect } from 'react';
import chatbotData from './chatbot-dataset.json';
import styles from './DyslexiaChatbot.module.css';

const EnhancedDyslexiaChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickQuestions, setQuickQuestions] = useState([]);
  const [activeCategory, setActiveCategory] = useState('general');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize with welcome message and quick questions
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: "👋 Hi there! Welcome to LearnBridge Kids Assistant!\n\nI'm here to help you learn about our dyslexia support platform. Ask me anything!",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: 'general'
      }
    ]);

    // Generate dynamic quick questions from dataset
    const allQuestions = [];
    Object.values(chatbotData.categories).forEach(category => {
      category.forEach(item => {
        allQuestions.push(item.question);
      });
    });
    
    // Shuffle and pick 6 random questions
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setQuickQuestions(shuffled.slice(0, 6));
  }, []);

  // Scroll to bottom with smooth animation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [isOpen]);

  // Calculate similarity between two strings
  const calculateSimilarity = (str1, str2) => {
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    
    // Check for exact match in keywords
    let keywordMatches = 0;
    Object.values(chatbotData.categories).forEach(category => {
      category.forEach(item => {
        item.keywords.forEach(keyword => {
          if (str1.toLowerCase().includes(keyword)) {
            keywordMatches += 2.5;
          }
        });
      });
    });

    // Count word matches
    let matches = 0;
    words1.forEach(word => {
      if (word.length > 3 && words2.includes(word)) {
        matches += 2;
      } else if (word.length > 2 && words2.includes(word)) {
        matches += 1;
      }
    });

    // Check for partial matches
    words1.forEach(word1 => {
      words2.forEach(word2 => {
        if (word1.length > 3 && word2.length > 3) {
          if (word1.includes(word2) || word2.includes(word1)) {
            matches += 0.7;
          }
        }
      });
    });

    return matches + keywordMatches;
  };

  // Find the best matching question
  const findBestMatch = (userQuestion) => {
    let bestMatch = null;
    let highestScore = 0;
    let matchedCategory = null;

    const userQ = userQuestion.toLowerCase().trim();

    Object.entries(chatbotData.categories).forEach(([category, questions]) => {
      questions.forEach(qa => {
        let score = calculateSimilarity(userQ, qa.question.toLowerCase());
        
        qa.keywords.forEach(keyword => {
          if (userQ.includes(keyword)) {
            score += 3.5;
          }
        });

        const questionWords = ['what', 'how', 'when', 'where', 'why', 'who', 'which', 'can', 'is', 'are', 'does', 'do', 'tell', 'explain', 'show'];
        questionWords.forEach(qWord => {
          if (userQ.startsWith(qWord)) {
            score += 1.2;
          }
        });

        if (score > highestScore) {
          highestScore = score;
          bestMatch = qa;
          matchedCategory = category;
        }
      });
    });

    if (highestScore < 2) {
      return null;
    }

    return { answer: bestMatch.answer, category: matchedCategory };
  };

  // Get random fallback response
  const getFallbackResponse = () => {
    const randomIndex = Math.floor(Math.random() * chatbotData.fallbackResponses.length);
    return chatbotData.fallbackResponses[randomIndex];
  };

  // Handle user message
  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 600));

    const match = findBestMatch(input);
    
    let botResponse;
    if (match) {
      botResponse = {
        id: messages.length + 2,
        text: match.answer,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: match.category
      };
      setActiveCategory(match.category);
    } else {
      botResponse = {
        id: messages.length + 2,
        text: getFallbackResponse(),
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: 'general'
      };
    }

    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);

    // Update quick questions
    if (match && match.category) {
      const categoryQuestions = chatbotData.categories[match.category]
        .map(q => q.question)
        .filter(q => !quickQuestions.includes(q));
      
      if (categoryQuestions.length > 0) {
        const newQuestions = categoryQuestions
          .sort(() => 0.5 - Math.random())
          .slice(0, 2);
        
        setQuickQuestions(prev => {
          const updated = [...prev.slice(2), ...newQuestions];
          return updated;
        });
      }
    }
  };

  // Handle quick question click
  const handleQuickQuestion = (question) => {
    if (isTyping) return;
    setInput(question);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    const categoryIntros = {
      general: "Tell me about LearnBridge Kids",
      games: "What games do you have?",
      features: "What are the main features?",
      dashboards: "Tell me about dashboards",
      registration: "How do I register?",
      technical: "What are technical requirements?",
      support: "How can I get support?",
      research: "What research backs this?",
      business: "Tell me about business model"
    };
    
    handleQuickQuestion(categoryIntros[category] || `Tell me about ${category}`);
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      general: 'ℹ️',
      games: '🎮',
      features: '✨',
      dashboards: '📊',
      registration: '👤',
      technical: '⚙️',
      support: '🆘',
      research: '🔬',
      business: '💼'
    };
    return icons[category] || '💬';
  };

  // Format message text
  const formatMessage = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map((line, index) => (
      <p key={index} className={styles.messageLine}>
        {line}
      </p>
    ));
  };

  // Clear chat
  const handleClearChat = () => {
    if (window.confirm('Clear all messages?')) {
      setMessages([
        {
          id: 1,
          text: "👋 Chat cleared! How can I help you?",
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: 'general'
        }
      ]);
    }
  };

  return (
    <>
      {/* Floating Chat Button - LEFT SIDE */}
      <button 
        className={`${styles.chatbotToggle} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isOpen ? (
          <span className={styles.closeIcon}>✕</span>
        ) : (
          <>
            <span className={styles.botIcon}>🧠</span>
            <span className={styles.pulseRing}></span>
            <span className={styles.notificationDot}></span>
          </>
        )}
      </button>

      {/* Chat Window */}
      <div className={`${styles.chatbotWindow} ${isOpen ? styles.open : ''}`}>
        {/* Header */}
        <div className={styles.chatbotHeader}>
          <div className={styles.headerContent}>
            <div className={styles.botAvatar}>
              <span className={styles.avatarIcon}>🎓</span>
            </div>
            <div className={styles.headerText}>
              <h3 className={styles.chatbotTitle}>LearnBridge Assistant</h3>
              <p className={styles.chatbotSubtitle}>
                <span className={styles.onlineIndicator}></span>
                Online • Ready to help
              </p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button 
              className={styles.clearButton}
              onClick={handleClearChat}
              aria-label="Clear chat"
            >
              🗑️
            </button>
            <button 
              className={styles.minimizeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Minimize"
            >
              −
            </button>
          </div>
          <div className={styles.headerStats}>
            <span className={styles.statItem}>
              <span className={styles.statIcon}>💬</span> 300+ Q&A
            </span>
            <span className={styles.statItem}>
              <span className={styles.statIcon}>📂</span> 10 Topics
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className={styles.categoryTabs}>
          {Object.keys(chatbotData.categories).map(category => (
            <button
              key={category}
              className={`${styles.categoryTab} ${activeCategory === category ? styles.active : ''}`}
              onClick={() => handleCategoryClick(category)}
              disabled={isTyping}
            >
              {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Quick Questions */}
        <div className={styles.quickQuestions}>
          <p className={styles.quickQuestionsTitle}>
            <span className={styles.lightbulbIcon}>💡</span> Quick questions:
          </p>
          <div className={styles.quickQuestionsGrid}>
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                className={styles.quickQuestionBtn}
                onClick={() => handleQuickQuestion(question)}
                disabled={isTyping}
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Container - MAXIMUM SPACE */}
        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.botMessage}`}
            >
              {message.sender === 'bot' && (
                <div className={styles.botAvatarSmall}>
                  <span>🤖</span>
                </div>
              )}
              <div className={styles.messageContent}>
                <div className={styles.messageText}>
                  {formatMessage(message.text)}
                </div>
                <div className={styles.messageMeta}>
                  <span className={styles.messageTime}>{message.timestamp}</span>
                  {message.category && (
                    <span className={styles.messageCategory}>
                      {getCategoryIcon(message.category)} {message.category}
                    </span>
                  )}
                </div>
              </div>
              {message.sender === 'user' && (
                <div className={styles.userAvatarSmall}>
                  <span>👤</span>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className={styles.typingIndicator}>
              <div className={styles.typingDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className={styles.typingText}>Thinking...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={styles.inputContainer}>
          <div className={styles.inputHintTop}>
            <span className={styles.examplesIcon}>📝</span>
            Ask anything about our platform
          </div>
          <div className={styles.inputWrapper}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your question here..."
              className={styles.messageInput}
              disabled={isTyping}
              maxLength={500}
            />
            <button
              onClick={handleSend}
              className={styles.sendButton}
              disabled={!input.trim() || isTyping}
              aria-label="Send"
            >
              <svg className={styles.sendIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
          <div className={styles.inputHint}>
            Press <kbd>Enter</kbd> to send
          </div>
        </div>
      </div>
    </>
  );
};

export default EnhancedDyslexiaChatbot;