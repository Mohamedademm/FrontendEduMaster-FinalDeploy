import React, { useState, useEffect, useRef } from 'react';
import '../Css/ChatAndForum.css';

function ChatAndForum() {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [newMessageNotification, setNewMessageNotification] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const currentUserId = user._id || null;

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/api/discussion/messages');
      const data = await res.json();
      if (data.success) {
        const sortedMessages = data.messages.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        // Si on a déjà des messages, détecter si nouveaux messages arrivés
        if (
          chatMessages.length &&
          sortedMessages.length > chatMessages.length &&
          !isScrolledToBottom()
        ) {
          setNewMessageNotification(true);
        }

        setChatMessages(sortedMessages);
      } else {
        setError('Failed to fetch messages.');
      }
    } catch (err) {
      setError('An error occurred while fetching messages.');
    } finally {
      setLoading(false);
    }
  };

  // Scroll intelligent : scroller vers bas seulement si on est proche du bas
  const isScrolledToBottom = () => {
    const el = messagesContainerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 50; // 50px tolerance
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setNewMessageNotification(false);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isScrolledToBottom()) {
      scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessages]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (chatInput.trim() === '') {
      setError('Message cannot be empty.');
      return;
    }
    if (!currentUserId || !user.firstName || !user.lastName) {
      setError('You must be logged in to send a message.');
      return;
    }

    try {
      setSending(true);
      const userId = currentUserId;
      const username = `${user.firstName} ${user.lastName}`;

      const res = await fetch('http://localhost:3000/api/discussion/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, username, message: chatInput.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to send message.');
        setSending(false);
        return;
      }

      await res.json();
      setChatInput('');
      await fetchMessages();
    } catch {
      setError('An error occurred while sending the message.');
    } finally {
      setSending(false);
    }
  };

  // Gestion des touches pour multi-lignes
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sending && chatInput.trim() !== '') {
        handleChatSubmit(e);
      }
    }
  };

  const formatTimestamp = (ts) => {
    try {
      const date = new Date(ts);
      return date.toLocaleString(undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="chat-forum-container" role="main" aria-label="Chat and forum container">
      <header className="chat-forum-header">
        <h2>Chat & Forum</h2>
        {error && (
          <div className="error-message" role="alert" aria-live="assertive">
            {error}
          </div>
        )}
        {newMessageNotification && (
          <button
            className="new-message-notif"
            onClick={scrollToBottom}
            aria-live="polite"
            aria-label="New messages, click to scroll to bottom"
          >
            New messages ↓
          </button>
        )}
      </header>
      <div className="chat-forum-content">
        <div className="chat-section" aria-live="polite" aria-relevant="additions">
          <h2>Discussion</h2>
          <div
            className="chat-messages"
            tabIndex="0"
            aria-label="Chat messages"
            ref={messagesContainerRef}
          >
            {loading ? (
              <p className="loading-text">Loading messages...</p>
            ) : chatMessages.length === 0 ? (
              <p className="no-messages-text">No messages yet. Start the conversation!</p>
            ) : (
              chatMessages.map((msg) => {
                const isSelf = msg.userId === currentUserId;
                const isSystem = msg.userId === 'system';
                return (
                  <div
                    key={msg._id}
                    className={
                      isSystem
                        ? 'chat-message system-message'
                        : isSelf
                        ? 'chat-message self'
                        : 'chat-message other'
                    }
                    tabIndex="-1"
                  >
                    <div className="message-header">
                      <strong>{msg.username}</strong>
                      <span className="timestamp">{formatTimestamp(msg.timestamp)}</span>
                    </div>
                    <div className="message-content">{msg.message}</div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleChatSubmit} className="chat-form" aria-label="Send a message">
            <textarea
              placeholder="Write a message... (Shift + Enter for newline)"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
              aria-label="Message input"
              rows={2}
              maxLength={1000}
              required
            />
            <button type="submit" disabled={sending || chatInput.trim() === ''}>
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatAndForum;
