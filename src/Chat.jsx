import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";
import MoodTrackerCalendar, { saveMoodForDate } from "./MoodTrackerCalendar";

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

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

function getStorageKey() {
  try {
    if (typeof window === "undefined") return "serelyn_conversations_anon";
    return `serelyn_conversations_${localStorage.getItem("user_id") || "anon"}`;
  } catch (_) {
    return "serelyn_conversations_anon";
  }
}

function loadConversations() {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(getStorageKey());
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveConversations(list) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(getStorageKey(), JSON.stringify(list));
  } catch (_) {}
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function Chat({ user, onLogout, onNavigateHome }) {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState(() => loadConversations());
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState("chat"); // "chat" | "mood"
  const [typingMessageId, setTypingMessageId] = useState(null);
  const [typingText, setTypingText] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText]);

  // Persist current conversation
  useEffect(() => {
    if (activeConversationId) {
      const list = loadConversations();
      const idx = list.findIndex((c) => c.id === activeConversationId);
      if (idx >= 0) {
        list[idx] = { ...list[idx], messages: [...messages], updatedAt: Date.now() };
        saveConversations(list);
        setConversations(list);
      }
    } else if (messages.length >= 1) {
      const id = "conv-" + Date.now();
      const firstUser = messages.find((m) => m.role === "user");
      const title = (firstUser?.text || "Chat").slice(0, 36);
      setActiveConversationId(id);
      const list = loadConversations();
      const next = [{ id, title, messages: [...messages], createdAt: Date.now(), updatedAt: Date.now() }, ...list.filter((c) => c.id !== id)];
      saveConversations(next);
      setConversations(next);
    }
  }, [messages, activeConversationId]);

  // Live typing effect: when we have a new full AI message, type it out
  useEffect(() => {
    if (!typingMessageId) return;
    const full = messages.find((m) => m.id === typingMessageId);
    if (!full || full.role !== "assistant" || full.isPlaceholder) return;
    const target = full.text;
    if (target.length <= typingText.length) {
      setTypingMessageId(null);
      setTypingText("");
      return;
    }
    const t = setTimeout(() => {
      setTypingText((prev) => target.slice(0, prev.length + 1));
    }, 20);
    return () => clearTimeout(t);
  }, [typingMessageId, typingText, messages]);

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
        body: JSON.stringify({ user_id: getUserId(), text }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      const emotion = (data.emotion || "neutral").toLowerCase();
      saveMoodForDate(todayKey(), emotion);

      const aiMsg = {
        id: "ai-" + Date.now(),
        role: "assistant",
        text: data.response || "I'm here with you. How can I support you right now?",
        emotion,
        isPlaceholder: false,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const next = prev.map((m) => (m.id === placeholderId ? aiMsg : m));
        return next;
      });
      setTypingMessageId(aiMsg.id);
      setTypingText("");
    } catch (_) {
      const aiMsg = {
        id: "ai-" + Date.now(),
        role: "assistant",
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        emotion: "neutral",
        isPlaceholder: false,
        timestamp: new Date(),
      };
      setMessages((prev) => prev.map((m) => (m.id === placeholderId ? aiMsg : m)));
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      const list = loadConversations();
      const existing = list.find((c) => c.id === activeConversationId);
      if (existing) {
        const idx = list.findIndex((c) => c.id === activeConversationId);
        list[idx] = { ...existing, messages: [...messages], updatedAt: Date.now() };
      } else {
        const id = "conv-" + Date.now();
        const firstUser = messages.find((m) => m.role === "user");
        list.unshift({ id, title: (firstUser?.text || "Chat").slice(0, 36), messages: [...messages], createdAt: Date.now(), updatedAt: Date.now() });
      }
      saveConversations(list);
      setConversations(list);
    }
    setMessages([]);
    setActiveConversationId(null);
    setTypingMessageId(null);
    setTypingText("");
    setInput("");
    setDrawerOpen(false);
    inputRef.current?.focus();
  };

  const loadChat = (conv) => {
    setMessages(conv.messages);
    setActiveConversationId(conv.id);
    setDrawerOpen(false);
    setTypingMessageId(null);
    setTypingText("");
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    onLogout();
  };

  const handleHome = () => {
    setDrawerOpen(false);
    onNavigateHome();
  };

  const handleShowMood = () => {
    setView("mood");
    setDrawerOpen(false);
  };

  const handleBackToChat = () => setView("chat");

  if (view === "mood") {
    return (
      <div className="chat-page">
        <header className="chat-header">
          <button type="button" className="chat-burger" onClick={() => setDrawerOpen(true)} aria-label="Menu">
            <BurgerIcon />
          </button>
          <div className="chat-logo"><span className="chat-logo-dot" /> Serelyn</div>
        </header>
        <MoodTrackerCalendar onBack={handleBackToChat} />
      </div>
    );
  }

  return (
    <div className="chat-page">
      {/* Drawer overlay */}
      {drawerOpen && (
        <div className="chat-drawer-backdrop" onClick={() => setDrawerOpen(false)} aria-hidden />
      )}
      <aside className={`chat-drawer ${drawerOpen ? "chat-drawer--open" : ""}`}>
        <div className="chat-drawer-header">
          <span className="chat-drawer-title">Menu</span>
          <button type="button" className="chat-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close">×</button>
        </div>
        <nav className="chat-drawer-nav">
          <button type="button" className="chat-drawer-item" onClick={handleHome}>
            <HomeIcon /> Home
          </button>
          <button type="button" className="chat-drawer-item" onClick={handleShowMood}>
            <CalendarIcon /> Mood calendar
          </button>
          <button type="button" className="chat-drawer-item" onClick={handleNewChat}>
            <NewChatIcon /> New chat
          </button>
          <div className="chat-drawer-section">Past chats</div>
          {conversations.length === 0 && (
            <div className="chat-drawer-empty">No past chats yet.</div>
          )}
          {conversations.slice(0, 15).map((conv) => (
            <button
              key={conv.id}
              type="button"
              className={`chat-drawer-item chat-drawer-chat ${activeConversationId === conv.id ? "chat-drawer-chat--active" : ""}`}
              onClick={() => loadChat(conv)}
            >
              {conv.title}
            </button>
          ))}
          <div className="chat-drawer-spacer" />
          <button type="button" className="chat-drawer-item chat-drawer-logout" onClick={handleLogout}>
            <LogoutIcon /> Logout
          </button>
        </nav>
      </aside>

      <header className="chat-header">
        <div className="chat-header-left">
          <button type="button" className="chat-burger" onClick={() => setDrawerOpen(true)} aria-label="Menu">
            <BurgerIcon />
          </button>
          <div className="chat-logo"><span className="chat-logo-dot" /> Serelyn</div>
        </div>
        <div className="chat-header-right">
          <span className="chat-user">Hello, {user}</span>
          <button type="button" className="chat-btn chat-btn-ghost" onClick={handleNewChat}>New chat</button>
          <button type="button" className="chat-btn chat-btn-ghost" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="chat-main">
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-welcome">
              <p className="chat-welcome-title">How are you feeling today?</p>
              <p className="chat-welcome-sub">Share what's on your mind. Serelyn is here to listen.</p>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble-wrap chat-bubble-wrap--${msg.role}`}>
              {msg.role === "assistant" && !msg.isPlaceholder && (
                <div className="chat-bubble-avatar" aria-hidden>S</div>
              )}
              <div className="chat-bubble-meta">
                <div
                  className={`chat-bubble chat-bubble--${msg.role} ${msg.isPlaceholder ? "chat-bubble--thinking" : ""}`}
                >
                  {msg.isPlaceholder ? (
                    <span className="chat-thinking-dots"><span /><span /><span /></span>
                  ) : msg.role === "assistant" && typingMessageId === msg.id && typingText !== msg.text ? (
                    typingText + (typingText.length < msg.text.length ? "▌" : "")
                  ) : (
                    msg.text
                  )}
                </div>
                {msg.role === "assistant" && !msg.isPlaceholder && msg.emotion && (
                  <span
                    className="chat-emotion-tag"
                    style={{ background: getEmotionStyle(msg.emotion).bg, color: getEmotionStyle(msg.emotion).color }}
                  >
                    {getEmotionStyle(msg.emotion).label}
                  </span>
                )}
                {msg.role === "user" && msg.timestamp && (
                  <span className="chat-bubble-time">{formatTime(msg.timestamp)}</span>
                )}
                {msg.role === "assistant" && !msg.isPlaceholder && msg.timestamp && (
                  <span className="chat-bubble-time">{formatTime(msg.timestamp)}</span>
                )}
              </div>
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
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
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

function formatTime(date) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function BurgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function NewChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
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
