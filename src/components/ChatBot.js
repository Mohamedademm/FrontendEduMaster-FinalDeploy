import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Send as SendIcon, 
  Refresh as RefreshIcon, 
  SmartToy as SmartToyIcon, 
  Person as PersonIcon
} from '@mui/icons-material';
import '../Css/ChatBot-Modern.css';

const ChatBot = () => {
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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
      }, 1000);    } catch (err) {
      console.error("API or processing error:", err);
      const errorMsgData = { 
        sender: 'bot', 
        text: t('chatbot_communication_error', `❌ Erreur de communication avec l'IA. (${err.message})`),
        timestamp: new Date().toLocaleTimeString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsgData]);
      setError(t('chatbot_communication_error_simple', `Erreur de communication avec l'IA. (${err.message})`));
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
    <div className="chatbot-container" style={{paddingTop:'500px', position: 'relative', height: '80%', width: '100%' }}>
      {/* Header */}
      <div className="chatbot-header">
        <div className="chatbot-header-content">
          <div className="chatbot-avatar">
            <SmartToyIcon />
          </div>          <div>
            <h3 className="chatbot-title">{t('chatbot_title', 'EduMaster Assistant')}</h3>
            <p className="chatbot-subtitle">
              {loading ? t('chatbot_typing', 'En train d\'écrire...') : t('chatbot_online', 'En ligne • IA Gemini')}
            </p>
          </div>
        </div>
        
        <div className="chatbot-header-actions">          <button 
            className="chatbot-header-btn"
            onClick={() => setShowResetConfirm(true)}
            disabled={loading || messages.length === 0}
            title={t('clear_conversation', 'Effacer la conversation')}
          >
            <RefreshIcon fontSize="small" />
          </button>
        </div>
      </div>

      {/* Reset Confirmation */}
      {showResetConfirm && (
        <motion.div 
          className="reset-confirm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >          <div className="reset-confirm-title">
            {t('confirm_clear_conversation', 'Êtes-vous sûr de vouloir effacer cette conversation ?')}
          </div>
          <div className="reset-confirm-actions">            <button 
              className="reset-confirm-btn cancel"
              onClick={() => setShowResetConfirm(false)}
            >
              {t('cancel', 'Annuler')}
            </button>
            <button 
              className="reset-confirm-btn confirm"
              onClick={handleResetConversation}
              disabled={loading}
            >
              {t('confirm', 'Confirmer')}
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
        {messages.length === 0 ? (          <div className="welcome-message">
            <SmartToyIcon className="welcome-icon" />
            <h4 className="welcome-title">{t('chatbot_welcome_title', 'Bienvenue sur EduMaster Assistant')}</h4>
            <p className="welcome-subtitle">
              {t('chatbot_welcome_message', 'Je suis là pour vous aider avec vos questions sur les cours, les micro-cours et tout ce qui concerne votre apprentissage. Posez-moi une question pour commencer !')}
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
          <div className="chatbot-input-wrapper">            <textarea
              ref={inputRef}
              className="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('chatbot_placeholder', 'Tapez votre message ici...')}
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
          </div>          <button 
            type="submit"
            className="chatbot-send-btn"
            disabled={loading || !input.trim()}
            title={t('send_message', 'Envoyer le message')}
          >
            <SendIcon fontSize="small" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
