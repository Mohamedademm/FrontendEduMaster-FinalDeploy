import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SmartToy as SmartToyIcon, 
  Person as PersonIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import '../Css/ChatBot-Modern.css';

const ChatBotFloating = ({ isOpen, onToggle }) => {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Save messages to localStorage and scroll to bottom
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessageText = input.trim();    const userMsgData = { 
      sender: 'user', 
      text: userMessageText,
      timestamp: new Date().toLocaleTimeString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsgData]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3000/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessageText }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('API Error Data:', errorData);
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }      const data = await res.json();
      const botResponseText = data.response || t('chatbot_no_response', "Désolé, je n'ai pas pu obtenir de réponse.");

      const botMsgData = { 
        sender: 'bot', 
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' })
      };
      
      // Simulate typing delay for better UX
      setTimeout(() => {
        setMessages((prev) => [...prev, botMsgData]);
        setLoading(false);
      }, 1000);

    } catch (err) {
      console.error("API or processing error:", err);      const errorMsgData = { 
        sender: 'bot', 
        text: t('chatbot_error', `❌ Erreur de communication avec l'IA. (${err.message})`),
        timestamp: new Date().toLocaleTimeString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsgData]);
      setError(t('chatbot_error_short', `Erreur de communication avec l'IA. (${err.message})`));
      setLoading(false);
    }
  };

  const handleResetConversation = () => {
    setShowResetConfirm(false);
    setMessages([]);
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatMessage = (text) => {
    // Simple formatting for code blocks and links
    return text
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  };

  return (
    <>
      {/* Float Button */}      <button 
        className={`chatbot-float-button ${isOpen ? 'opened' : ''}`}
        onClick={onToggle}
        title={isOpen ? t('close_chat') : t('open_ai_assistant')}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>

      {/* ChatBot Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="chatbot-container visible"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-content">
                <div className="chatbot-avatar">
                  <SmartToyIcon />
                </div>
                <div>
                  <h3 className="chatbot-title">EduMaster Assistant</h3>                  <p className="chatbot-subtitle">
                    {loading ? t('chatbot_typing') : t('chatbot_online')}
                  </p>
                </div>
              </div>
              
              <div className="chatbot-header-actions">                <button 
                  className="chatbot-header-btn"
                  onClick={() => setShowResetConfirm(true)}
                  disabled={loading || messages.length === 0}
                  title={t('clear_conversation')}
                >
                  <RefreshIcon fontSize="small" />
                </button>
                <button 
                  className="chatbot-header-btn"
                  onClick={onToggle}
                  title={t('close')}
                >
                  <CloseIcon fontSize="small" />
                </button>
              </div>
            </div>

            {/* Reset Confirmation */}
            {showResetConfirm && (
              <motion.div 
                className="reset-confirm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >                <div className="reset-confirm-title">
                  {t('confirm_clear_conversation')}
                </div>
                <div className="reset-confirm-actions">
                  <button 
                    className="reset-confirm-btn cancel"
                    onClick={() => setShowResetConfirm(false)}
                  >
                    {t('cancel')}
                  </button>
                  <button 
                    className="reset-confirm-btn confirm"
                    onClick={handleResetConversation}
                    disabled={loading}
                  >
                    {t('confirm')}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Error Display */}
            {error && (
              <motion.div 
                className="chatbot-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.div>
            )}

            {/* Messages */}
            <div className="chatbot-messages">
              {messages.length === 0 ? (                <div className="welcome-message">
                  <SmartToyIcon className="welcome-icon" />
                  <h4 className="welcome-title">{t('chatbot_welcome_title')}</h4>
                  <p className="welcome-subtitle">
                    {t('chatbot_welcome_message')}
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      className={`message-container ${msg.sender}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`message-avatar ${msg.sender}`}>
                        {msg.sender === 'user' ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
                      </div>
                      <div className="message-content">
                        <div className={`message-bubble ${msg.sender}`}>
                          <div 
                            dangerouslySetInnerHTML={{ 
                              __html: formatMessage(msg.text) 
                            }} 
                          />
                        </div>
                        <div className={`message-time ${msg.sender}`}>
                          {msg.timestamp}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

              {/* Typing Indicator */}
              {loading && (
                <motion.div 
                  className="message-container bot"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="message-avatar bot">
                    <SmartToyIcon fontSize="small" />
                  </div>
                  <div className="typing-indicator">
                    <div className="typing-dots">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chatbot-input-container">
              <form className="chatbot-input-form" onSubmit={handleSubmit}>
                <div className="chatbot-input-wrapper">                  <textarea
                    ref={inputRef}
                    className="chatbot-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('chatbot_placeholder')}
                    disabled={loading}
                    rows={1}
                    style={{
                      height: 'auto',
                      minHeight: '40px',
                      maxHeight: '120px',
                      resize: 'none',
                      overflow: 'hidden'
                    }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                  />
                </div>
                <button 
                  type="submit"
                  className="chatbot-send-btn"
                  disabled={loading || !input.trim()}
                  title={t('send_message')}
                >
                  <SendIcon fontSize="small" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBotFloating;
