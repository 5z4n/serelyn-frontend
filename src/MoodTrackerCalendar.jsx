import React, { useState, useEffect } from "react";

const EMOTION_COLORS = {
  happy: "#7EB77F",
  sad: "#7A9EBF",
  anxious: "#C9A96E",
  stressed: "#C9A96E",
  angry: "#C97A7A",
  neutral: "#90AB8B",
};

const MONTHS = "January,February,March,April,May,June,July,August,September,October,November,December".split(",");
const DAYS_SHORT = "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",");

export function getMoodStorageKey() {
  try {
    if (typeof window === "undefined") return "serelyn_mood_anon";
    return `serelyn_mood_${localStorage.getItem("user_id") || "anon"}`;
  } catch (_) {
    return "serelyn_mood_anon";
  }
}

export function saveMoodForDate(dateKey, emotion) {
  try {
    if (typeof window === "undefined") return;
    const key = getMoodStorageKey();
    const data = JSON.parse(localStorage.getItem(key) || "{}");
    data[dateKey] = (emotion || "neutral").toLowerCase();
    localStorage.setItem(key, JSON.stringify(data));
  } catch (_) { }
}

export function getMoodData() {
  try {
    if (typeof window === "undefined") return {};
    const key = getMoodStorageKey();
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch (_) {
    return {};
  }
}

function getDateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getLast7Days() {
  const out = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push({
      date: d,
      dateKey: getDateKey(d),
      dayName: DAYS_SHORT[d.getDay()],
      label: i === 0 ? "Today" : i === 1 ? "Yesterday" : DAYS_SHORT[d.getDay()],
    });
  }
  return out.reverse();
}

export default function MoodTrackerCalendar({ onBack, initialTab = "calendar" }) {
  const [viewDate, setViewDate] = useState(() => new Date());
  const [tab, setTab] = useState(initialTab);
  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const moodData = getMoodData();

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);
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
    const t = new Date();
    const isToday = t.getFullYear() === year && t.getMonth() === month && t.getDate() === d;
    cells.push({ day: d, dateKey, color, isToday });
  }

  const last7 = getLast7Days();
  const weekEmotions = last7.map(({ dateKey }) => moodData[dateKey] || null);
  const emotionCounts = weekEmotions.reduce((acc, e) => {
    const key = e || "none";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mood-calendar-page">
      <div className="mood-calendar-header">
        <button type="button" className="mood-calendar-back" onClick={onBack}>
          ← Back to chat
        </button>
        <h2 className="mood-calendar-title">Mood & report</h2>
      </div>

      <div className="mood-calendar-tabs">
        <button
          type="button"
          className={`mood-calendar-tab ${tab === "calendar" ? "mood-calendar-tab--active" : ""}`}
          onClick={() => setTab("calendar")}
        >
          Calendar
        </button>
        <button
          type="button"
          className={`mood-calendar-tab ${tab === "report" ? "mood-calendar-tab--active" : ""}`}
          onClick={() => setTab("report")}
        >
          Weekly report
        </button>
      </div>

      {tab === "report" && (
        <div className="mood-report">
          <h3 className="mood-report-heading">Last 7 days</h3>
          <div className="mood-report-days">
            {last7.map(({ date, dateKey, label }) => {
              const emotion = moodData[dateKey];
              const color = emotion ? (EMOTION_COLORS[emotion] || EMOTION_COLORS.neutral) : "rgba(59,73,83,0.15)";
              return (
                <div key={dateKey} className="mood-report-day">
                  <div className="mood-report-day-label">
                    <span className="mood-report-day-name">{label}</span>
                    <span className="mood-report-day-date">
                      {date.getDate()} {MONTHS[date.getMonth()].slice(0, 3)}
                    </span>
                  </div>
                  <div
                    className="mood-report-day-bar"
                    style={{ background: color }}
                    title={emotion || "No data"}
                  />
                  <span className="mood-report-day-emotion">{emotion || "—"}</span>
                </div>
              );
            })}
          </div>
          <h3 className="mood-report-heading">Emotion trend this week</h3>
          <div className="mood-report-trend">
            {Object.entries(EMOTION_COLORS).map(([emotion, color]) => {
              const count = emotionCounts[emotion] || 0;
              const total = 7;
              const pct = total ? (count / total) * 100 : 0;
              return (
                <div key={emotion} className="mood-report-trend-row">
                  <span className="mood-report-trend-label" style={{ color }}>{emotion}</span>
                  <div className="mood-report-trend-bar-wrap">
                    <div
                      className="mood-report-trend-bar"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                  <span className="mood-report-trend-count">{count} day{count !== 1 ? "s" : ""}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "calendar" && (
        <>
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
                <button
                  type="button"
                  key={c.dateKey}
                  className={`mood-calendar-cell ${c.isToday ? "mood-calendar-cell--today" : ""} ${selectedDateKey === c.dateKey ? "mood-calendar-cell--selected" : ""}`}
                  title={c.color ? `${c.dateKey}: ${moodData[c.dateKey]}` : c.dateKey}
                  style={c.color ? { background: c.color, color: "#fff" } : {}}
                  onClick={() => setSelectedDateKey(c.dateKey)}
                >
                  {c.day}
                </button>
              )
            )}
          </div>
          <div className="mood-calendar-legend">
            {Object.entries(EMOTION_COLORS).map(([emotion, color]) => (
              <span key={emotion} className="mood-calendar-legend-item" style={{ background: color }}>{emotion}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
