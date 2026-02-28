import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";

// Backend returns: happy | sad | anxious | stressed | angry | neutral
const EMOTION_MAP = {
  happy: { label: "Happy", color: "#7EB77F", bg: "rgba(126,183,127,0.2)" },
  sad: { label: "Sad", color: "#7A9EBF", bg: "rgba(122,158,191,0.2)" },
  anxious: { label: "Anxious", color: "#C9A96E", bg: "rgba(201,169,110,0.2)" },
  stressed: { label: "Stressed", color: "#C9A96E", bg: "rgba(201,169,110,0.2)" },
  angry: { label: "Angry", color: "#C97A7A", bg: "rgba(201,122,122,0.2)" },
  neutral: { label: "Calm", color: "#90AB8B", bg: "rgba(144,171,139,0.2)" },
};

const getEmotionStyle = (emotion) =>
  EMOTION_MAP[emotion] || EMOTION_MAP.neutral;

// Render backend — set REACT_APP_API_URL in .env (e.g. https://serelyn-backend.onrender.com)
// API: POST {API_BASE}/analyze  body: { user_id: number, text: string }
//      → { emotion: "happy"|"sad"|"anxious"|"stressed"|"angry"|"neutral", response: string }
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function Chat({ user, onLogout, onNavigateHome }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getUserId = () => {
    const raw = localStorage.getItem("user_id");
    if (!raw) return 0;
    const num = parseInt(raw, 10);
    return Number.isNaN(num) ? 0 : num;
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const userMsg = {
      id: "u-" + Date.now(),
      role: "user",
      text,
      timestamp: new Date(),
    };
    const placeholderId = "ai-placeholder-" + Date.now();
    const placeholderMsg = {
      id: placeholderId,
      role: "assistant",
      text: "Serelyn is thinking...",
      isPlaceholder: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg, placeholderMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE.replace(/\/$/, "")}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: getUserId(),
          text,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      const emotion = (data.emotion || "neutral").toLowerCase();
      const aiMsg = {
        id: "ai-" + Date.now(),
        role: "assistant",
        text: data.response || "I'm here with you. How can I support you right now?",
        emotion,
        isPlaceholder: false,
        timestamp: new Date(),
      };

      setMessages((prev) =>
        prev.map((m) => (m.id === placeholderId ? aiMsg : m))
      );
    } catch (err) {
      const aiMsg = {
        id: "ai-" + Date.now(),
        role: "assistant",
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        emotion: "neutral",
        isPlaceholder: false,
        timestamp: new Date(),
      };
      setMessages((prev) =>
        prev.map((m) => (m.id === placeholderId ? aiMsg : m))
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    inputRef.current?.focus();
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    onLogout();
  };

  return (
    <div className="chat-page">
      <header className="chat-header">
        <div className="chat-header-left">
          <button
            type="button"
            className="chat-btn-icon"
            onClick={onNavigateHome}
            title="Home"
            aria-label="Home"
          >
            <HomeIcon />
          </button>
          <div className="chat-logo">
            <span className="chat-logo-dot" />
            Serelyn
          </div>
        </div>
        <div className="chat-header-right">
          <span className="chat-user">Hello, {user}</span>
          <button
            type="button"
            className="chat-btn chat-btn-ghost"
            onClick={handleNewChat}
          >
            New Chat
          </button>
          <button
            type="button"
            className="chat-btn chat-btn-ghost"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="chat-main">
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-welcome">
              <p className="chat-welcome-title">How are you feeling today?</p>
              <p className="chat-welcome-sub">
                Share what's on your mind. Serelyn is here to listen.
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-bubble-wrap chat-bubble-wrap--${msg.role}`}
            >
              <div
                className={`chat-bubble chat-bubble--${msg.role} ${
                  msg.isPlaceholder ? "chat-bubble--thinking" : ""
                }`}
              >
                {msg.isPlaceholder ? (
                  <span className="chat-thinking-dots">
                    <span />
                    <span />
                    <span />
                  </span>
                ) : (
                  msg.text
                )}
              </div>
              {msg.role === "assistant" && !msg.isPlaceholder && msg.emotion && (
                <span
                  className="chat-emotion-tag"
                  style={{
                    background: getEmotionStyle(msg.emotion).bg,
                    color: getEmotionStyle(msg.emotion).color,
                  }}
                >
                  {getEmotionStyle(msg.emotion).label}
                </span>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} className="chat-scroll-anchor" />
        </div>

        <div className="chat-input-area">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            rows={1}
            maxLength={800}
            disabled={loading}
          />
          <button
            type="button"
            className="chat-send"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            aria-label="Send"
          >
            <SendIcon />
          </button>
        </div>
      </main>
    </div>
  );
}

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
