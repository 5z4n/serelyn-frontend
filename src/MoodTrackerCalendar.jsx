import React, { useState } from "react";

const EMOTION_COLORS = {
  happy: "#7EB77F",
  sad: "#7A9EBF",
  anxious: "#C9A96E",
  stressed: "#C9A96E",
  angry: "#C97A7A",
  neutral: "#90AB8B",
};

const MONTHS = "January,February,March,April,May,June,July,August,September,October,November,December".split(",");

export function getMoodStorageKey() {
  const uid = localStorage.getItem("user_id") || "anon";
  return `serelyn_mood_${uid}`;
}

export function saveMoodForDate(dateKey, emotion) {
  const key = getMoodStorageKey();
  try {
    const data = JSON.parse(localStorage.getItem(key) || "{}");
    data[dateKey] = (emotion || "neutral").toLowerCase();
    localStorage.setItem(key, JSON.stringify(data));
  } catch (_) {}
}

export function getMoodData() {
  const key = getMoodStorageKey();
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch (_) {
    return {};
  }
}

export default function MoodTrackerCalendar({ onBack }) {
  const [viewDate, setViewDate] = useState(() => new Date());
  const moodData = getMoodData();
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1));

  const cells = [];
  for (let i = 0; i < startPad; i++) cells.push({ empty: true });
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const emotion = moodData[dateKey];
    const color = emotion ? (EMOTION_COLORS[emotion] || EMOTION_COLORS.neutral) : null;
    const isToday = (() => {
      const t = new Date();
      return t.getFullYear() === year && t.getMonth() === month && t.getDate() === d;
    })();
    cells.push({ day: d, dateKey, color, isToday });
  }

  return (
    <div className="mood-calendar-page">
      <div className="mood-calendar-header">
        <button type="button" className="mood-calendar-back" onClick={onBack}>
          ← Back to chat
        </button>
        <h2 className="mood-calendar-title">Mood calendar</h2>
      </div>
      <div className="mood-calendar-nav">
        <button type="button" className="mood-calendar-nav-btn" onClick={prevMonth} aria-label="Previous month">
          ‹
        </button>
        <span className="mood-calendar-month">{MONTHS[month]} {year}</span>
        <button type="button" className="mood-calendar-nav-btn" onClick={nextMonth} aria-label="Next month">
          ›
        </button>
      </div>
      <div className="mood-calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => (
          <div key={w} className="mood-calendar-weekday">{w}</div>
        ))}
        {cells.map((c, i) =>
          c.empty ? (
            <div key={`e-${i}`} className="mood-calendar-cell mood-calendar-cell--empty" />
          ) : (
            <div
              key={c.dateKey}
              className={`mood-calendar-cell ${c.isToday ? "mood-calendar-cell--today" : ""}`}
              title={c.color ? `${c.dateKey}: ${moodData[c.dateKey]}` : c.dateKey}
              style={c.color ? { background: c.color, color: "#fff" } : {}}
            >
              {c.day}
            </div>
          )
        )}
      </div>
      <div className="mood-calendar-legend">
        {Object.entries(EMOTION_COLORS).map(([emotion, color]) => (
          <span key={emotion} className="mood-calendar-legend-item" style={{ background: color }}>{emotion}</span>
        ))}
      </div>
    </div>
  );
}
