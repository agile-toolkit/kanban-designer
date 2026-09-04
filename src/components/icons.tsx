/**
 * Copy this file into src/components/icons.tsx when adopting in an app.
 *
 * A shared set of SVG icons replacing the suite's decorative emoji
 * (✕ ✓ → ← ↩ 💡 ⚠️ 📊 🔄 🔗 📅 👤 ✏️ 🖨️ 📋 🤝 🎯 🏁 📁 📄 🖼️ 🔔 🔇 🔍 👁 ☀️ ❓
 * 📤 ⬇️ 📥 👍 ☑ ☐ 🔀 💬 🚧 🎬 🕐 ⏱ ⏳ 🚦 🌊 📈 📉 ⚖️ 🌍 🧭 ⚡ 🧪 🏷️ 🧩 ⚙ 🃏 🗂 ✦,
 * plus a few semantic-colored ones: warning, celebrate, trophy, fire, star.
 * Emoji that are FUNCTIONAL CONTENT rather than decoration —
 * Team Identity's Identity Symbols picker, Moving Motivators' motivator
 * cards, Sprint Metrics' 1–5 mood scale, Planning Poker's ☕ card value,
 * the Dashboard's live pass-through of a team's chosen symbol — are not
 * covered here and should stay as real emoji; only decorative UI chrome
 * (buttons, badges, section headers, empty-state art) is in scope.
 *
 * Most icons use `fill="currentColor"` / `stroke="currentColor"` so they
 * inherit whatever Tailwind text-color class already sits on the
 * surrounding button or span (e.g. a delete button's `text-red-400`
 * colors its icon automatically) — matching the existing convention used
 * by AppHeader's GridIcon, ThemeToggle's sun/moon, and FacilitatorToggle's
 * ProjectorIcon. A few icons (Warning, Celebrate, Trophy, Fire, StarFilled)
 * carry a fixed semantic color instead, since the color IS the meaning
 * (amber warning, gold trophy, etc.) regardless of surrounding context.
 *
 * Usage:
 *   import { CloseIcon, WarningIcon } from './icons'
 *   <button className="text-red-500 hover:text-red-700"><CloseIcon className="w-4 h-4" /></button>
 *   <WarningIcon className="w-4 h-4" />
 */

interface IconProps {
  className?: string
}

// ── Neutral (currentColor) — UI chrome ──────────────────────────────────

export function CloseIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  )
}

export function CheckIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8.5l3.2 3.2L13 4.5" />
    </svg>
  )
}

export function ArrowLeftIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 3L5 8l5 5" />
    </svg>
  )
}

export function ArrowRightIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3l5 5-5 5" />
    </svg>
  )
}

export function TipIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M8 1.5a4.5 4.5 0 00-2.5 8.25c.35.25.5.6.5 1v.25h4v-.25c0-.4.15-.75.5-1A4.5 4.5 0 008 1.5z" />
      <path d="M6.25 13.5h3.5M6.75 15h2.5" strokeLinecap="round" />
    </svg>
  )
}

export function ChartIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <rect x="1.5" y="9" width="3" height="5.5" rx="0.5" />
      <rect x="6.5" y="5.5" width="3" height="9" rx="0.5" />
      <rect x="11.5" y="2" width="3" height="12.5" rx="0.5" />
    </svg>
  )
}

export function RefreshIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M13.5 8A5.5 5.5 0 013 10.2M2.5 8A5.5 5.5 0 0113 5.8" />
      <path d="M13.5 3v3h-3M2.5 13v-3h3" strokeLinejoin="round" />
    </svg>
  )
}

export function LinkIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M6.5 9.5l3-3" />
      <path d="M7 4.5l.7-.7a2.5 2.5 0 013.5 3.5l-.7.7M9 11.5l-.7.7a2.5 2.5 0 01-3.5-3.5l.7-.7" />
    </svg>
  )
}

export function CalendarIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" rx="1.5" />
      <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" strokeLinecap="round" />
    </svg>
  )
}

export function PersonIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <circle cx="8" cy="5" r="2.75" />
      <path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" strokeLinecap="round" />
    </svg>
  )
}

export function EditIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 2.5l2.5 2.5-8 8L3 13.5l0-2.5z" />
    </svg>
  )
}

export function PrintIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5.5" width="10" height="6" rx="1" />
      <path d="M4.5 5.5V2.5h7v3M4.5 9.5h7v4h-7z" />
    </svg>
  )
}

export function ClipboardIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="2.5" width="10" height="12" rx="1.5" />
      <path d="M6 2.5V2a1 1 0 011-1h2a1 1 0 011 1v.5M5.5 7h5M5.5 9.5h5M5.5 12h3" strokeLinecap="round" />
    </svg>
  )
}

export function TargetIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="8" cy="8" r="6" />
      <circle cx="8" cy="8" r="3.2" />
      <circle cx="8" cy="8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FlagIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 1.5v13" strokeLinecap="round" />
      <path d="M3.5 2.5h9l-2 3 2 3h-9z" />
    </svg>
  )
}

export function FolderIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M1.5 4a1 1 0 011-1h3.5l1.5 1.5H13a1 1 0 011 1V12a1 1 0 01-1 1H2.5a1 1 0 01-1-1z" />
    </svg>
  )
}

export function BellIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6.5a4 4 0 018 0c0 3 1 4 1 4H3s1-1 1-4z" />
      <path d="M6.5 12.5a1.5 1.5 0 003 0" />
    </svg>
  )
}

export function BellOffIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6.5a4 4 0 018 0c0 3 1 4 1 4H3s1-1 1-4z" />
      <path d="M6.5 12.5a1.5 1.5 0 003 0" />
      <path d="M2 2l12 12" />
    </svg>
  )
}

export function SearchIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" />
      <path d="M13.5 13.5L10.5 10.5" />
    </svg>
  )
}

export function EyeIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M1 8s2.5-4.5 7-4.5S15 8 15 8s-2.5 4.5-7 4.5S1 8 1 8z" />
      <circle cx="8" cy="8" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function SunIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
    </svg>
  )
}

export function QuestionIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="8" cy="7" r="5.3" />
      <path d="M6 6a2 2 0 013.8.9c0 1.1-1.3 1.4-1.7 2.4" />
      <circle cx="8" cy="10.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function UploadIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 10V2M5 5l3-3 3 3" />
      <path d="M2.5 11v2a1 1 0 001 1h9a1 1 0 001-1v-2" />
    </svg>
  )
}

export function DownloadIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 2v8M5 7l3 3 3-3" />
      <path d="M2.5 11v2a1 1 0 001 1h9a1 1 0 001-1v-2" />
    </svg>
  )
}

export function ThumbsUpIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M2 7h2.2v7H2zM6 7.3l1-4.3a.9.9 0 011.7.4l-.5 3h4a1 1 0 01.98 1.2l-.9 4.5a1 1 0 01-1 .8H6z" />
    </svg>
  )
}

export function CheckboxEmptyIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" rx="2" />
    </svg>
  )
}

export function CheckboxCheckedIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" rx="2" />
      <path d="M5 8.2l2 2 4-4.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ShuffleIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 8.5l3 3M2.5 8.5l3-3M2.5 8.5h6.5" />
      <path d="M13.5 7.5l-3-3M13.5 7.5l-3 3M13.5 7.5H7" />
    </svg>
  )
}

/** Two overlapping people — team/group */
export function TeamIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <circle cx="7" cy="6" r="2.6" />
      <path d="M2 16c0-3 2.2-5 5-5s5 2 5 5z" />
      <circle cx="14.5" cy="7" r="2.1" opacity="0.55" />
      <path d="M10.8 16c.3-2.6 2-4.3 4.2-4.3s3.6 1.5 4 3.6z" opacity="0.55" />
    </svg>
  )
}

/** Speech bubble — comments, dialogue */
export function ChatIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 4.5a2 2 0 012-2h8a2 2 0 012 2v5a2 2 0 01-2 2H6.5L3.5 14v-2.5H4a2 2 0 01-2-2z" />
    </svg>
  )
}

/** Road barrier — impediments, blockers */
export function BarrierIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <rect x="2" y="4.5" width="12" height="4" rx="0.8" />
      <path d="M5 4.5L3 8.5M9 4.5L7 8.5M13 4.5l-2 4" strokeWidth="1.1" />
      <path d="M3.5 8.5v5M12.5 8.5v5" />
    </svg>
  )
}

/** Clapperboard — demo, review */
export function ClapperIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
      <rect x="1.5" y="6" width="13" height="8" rx="1.2" />
      <path d="M1.8 6l1.4-2.6 12.1-.9-.3 2.4-1.2 1.1" />
      <path d="M5.5 3.3L6.7 5.9M9.5 3L10.7 5.6" strokeWidth="1.1" />
    </svg>
  )
}

/** Clock face — time, timestamps */
export function ClockIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="8.5" r="5.8" />
      <path d="M8 5v3.5l2.4 1.5" />
    </svg>
  )
}

/** Stopwatch — timeboxes, elapsed time */
export function StopwatchIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="9" r="5.3" />
      <path d="M8 6.2V9l2 1.4M6.4 1.8h3.2M8 1.8v1.9M12.4 4.6l1-1" />
    </svg>
  )
}

/** Hourglass — waiting, in progress */
export function HourglassIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 2h8M4 14h8" />
      <path d="M4.8 2v2.4L8 8l3.2-3.6V2M4.8 14v-2.4L8 8l3.2 3.6V14" />
    </svg>
  )
}

/** Traffic light — WIP limits */
export function TrafficLightIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <rect x="4.5" y="1.5" width="7" height="13" rx="2" />
      <circle cx="8" cy="4.7" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="8" cy="8" r="1.15" />
      <circle cx="8" cy="11.3" r="1.15" />
    </svg>
  )
}

/** Wave — flow */
export function FlowIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <path d="M1.5 5.5c1.6-1.6 3.2-1.6 4.8 0s3.2 1.6 4.8 0 3.2-1.6 3.4 0" />
      <path d="M1.5 9c1.6-1.6 3.2-1.6 4.8 0s3.2 1.6 4.8 0 3.2-1.6 3.4 0" />
      <path d="M1.5 12.5c1.6-1.6 3.2-1.6 4.8 0s3.2 1.6 4.8 0 3.2-1.6 3.4 0" />
    </svg>
  )
}

/** Rising line — upward trend, progress */
export function TrendUpIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1.5 11.5l4-4 2.8 2.8L14 4.5" />
      <path d="M10.5 4.5H14V8" />
    </svg>
  )
}

/** Falling line — downward trend, alerts */
export function TrendDownIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1.5 4.5l4 4 2.8-2.8L14 11.5" />
      <path d="M10.5 11.5H14V8" />
    </svg>
  )
}

/** Inbox tray — import, incoming data */
export function InboxIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 9.5l1.8-6h8.4L14 9.5v3a1 1 0 01-1 1H3a1 1 0 01-1-1z" />
      <path d="M2 9.5h3.2l.9 1.7h3.8l.9-1.7H14" />
    </svg>
  )
}

/** Balance scales — fairness, equity */
export function ScalesIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 2.5v11M5 13.5h6M2.5 4.5h11" />
      <path d="M4.5 4.7L2.5 9h4zM11.5 4.7L9.5 9h4z" />
    </svg>
  )
}

/** Globe — language, worldwide */
export function GlobeIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.35" aria-hidden="true">
      <circle cx="8" cy="8" r="6" />
      <path d="M2.2 6.2h11.6M2.2 9.8h11.6" />
      <ellipse cx="8" cy="8" rx="2.7" ry="6" />
    </svg>
  )
}

/** Compass — orientation, guidance */
export function CompassIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="8" r="6" />
      <path d="M10.6 5.4L9.3 9.3 5.4 10.6 6.7 6.7z" />
    </svg>
  )
}

/** Document page — reports, exports */
export function DocumentIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 1.8h5L12.5 6v8.2H3.5z" />
      <path d="M8.5 1.8V6h4M5.8 8.8h4.4M5.8 11.3h3" />
    </svg>
  )
}

/** Picture frame — image export */
export function ImageIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
      <rect x="1.8" y="3" width="12.4" height="10" rx="1.4" />
      <circle cx="5.6" cy="6.4" r="1.1" />
      <path d="M2.2 11.2l3.3-3 2.6 2.4 2.2-2 3.5 3.4" />
    </svg>
  )
}

/** Lightning bolt — energy, quick actions */
export function BoltIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M9.2 1.2L3.4 9h3.6l-.6 5.8L12.6 7H9z" />
    </svg>
  )
}

/** Flask — experiments, hypotheses */
export function FlaskIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.3 1.8h3.4M6.8 1.8v4.1L3.2 12a1.2 1.2 0 001 1.9h7.6a1.2 1.2 0 001-1.9L9.2 5.9V1.8" />
      <path d="M5 9.6h6" />
    </svg>
  )
}

/** Tag — labels, saved names */
export function TagIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.2 7.4V2.6a.8.8 0 01.8-.8h4.8l6 6-5.6 5.6z" />
      <circle cx="5.2" cy="5" r="1.1" />
    </svg>
  )
}

/** Puzzle piece — integrations, hand-offs */
export function PuzzleIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.4 2.2a1.6 1.6 0 013.2 0v.9h2.6a.8.8 0 01.8.8v2.5h-.9a1.6 1.6 0 000 3.2h.9v2.5a.8.8 0 01-.8.8H9.6v-.9a1.6 1.6 0 00-3.2 0v.9H3.8a.8.8 0 01-.8-.8V9.6h.9a1.6 1.6 0 000-3.2H3V3.9a.8.8 0 01.8-.8h2.6z" />
    </svg>
  )
}

/** Gear — settings, workspace management */
export function GearIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.6 1.8h2.8l.35 1.7 1.3.75 1.65-.6 1.4 2.4-1.3 1.15v1.5l1.3 1.15-1.4 2.4-1.65-.6-1.3.75-.35 1.7H6.6l-.35-1.7-1.3-.75-1.65.6-1.4-2.4 1.3-1.15v-1.5L1.9 6.05l1.4-2.4 1.65.6 1.3-.75z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  )
}

/** Playing cards — estimation, card decks */
export function CardsIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" aria-hidden="true">
      <rect x="5.6" y="2.2" width="7.6" height="10.6" rx="1.3" />
      <path d="M4.4 4.2l-1.3.5a1.3 1.3 0 00-.75 1.7l2.5 6.7a1.3 1.3 0 001.7.75l1-.4" />
    </svg>
  )
}

/** Board columns — boards, kanban */
export function KanbanIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" aria-hidden="true">
      <rect x="1.5" y="2.5" width="3.6" height="11" rx="1" />
      <rect x="6.2" y="2.5" width="3.6" height="7.5" rx="1" />
      <rect x="10.9" y="2.5" width="3.6" height="9.5" rx="1" />
    </svg>
  )
}

/** Four-point spark — highlights, topics */
export function SparkIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1l1.5 5.5L15 8l-5.5 1.5L8 15l-1.5-5.5L1 8l5.5-1.5z" />
    </svg>
  )
}

/** Rocket — launches, new initiatives */
export function RocketIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 1.5c2.2 1.7 3.3 4 3.3 6.6L8 11.2 4.7 8.1C4.7 5.5 5.8 3.2 8 1.5z" />
      <circle cx="8" cy="6.3" r="1.2" />
      <path d="M4.9 9.6L3 11.1l.5 2.2 2.2-.7M11.1 9.6L13 11.1l-.5 2.2-2.2-.7M7 12.4l1 2 1-2" />
    </svg>
  )
}

/** Wrench — tooling, technical work */
export function WrenchIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.4 2.2a3.6 3.6 0 00-4.3 4.7l-4 4a1.4 1.4 0 002 2l4-4a3.6 3.6 0 004.7-4.3l-2 2-1.9-.5-.5-1.9z" />
    </svg>
  )
}

/** Robot — automation, AI */
export function RobotIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.6" y="5" width="10.8" height="8.2" rx="2" />
      <circle cx="6.1" cy="8.6" r="0.95" fill="currentColor" stroke="none" />
      <circle cx="9.9" cy="8.6" r="0.95" fill="currentColor" stroke="none" />
      <path d="M6.3 11.3h3.4M8 5V2.6M1.5 8.4v2.2M14.5 8.4v2.2" strokeLinecap="round" />
      <circle cx="8" cy="2" r="0.9" />
    </svg>
  )
}

/** Curved arrow back — undo, start over, return */
export function UndoIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 5.5h7.5a3.5 3.5 0 010 7H6" />
      <path d="M5 2.5L2 5.5l3 3" />
    </svg>
  )
}

// ── Semantic-colored — the color is part of the meaning ─────────────────

export function WarningIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.5l7 12.5H1z" fill="#F59E0B" />
      <path d="M8 6v3.5" stroke="#7C2D12" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="0.75" fill="#7C2D12" />
    </svg>
  )
}

export function CheckCircleIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" fill="#10B981" />
      <path d="M5 8.2l2 2 4-4.2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function XCircleIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" fill="#EF4444" />
      <path d="M5.7 5.7l4.6 4.6M10.3 5.7l-4.6 4.6" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function StarFilledIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="#F59E0B" aria-hidden="true">
      <path d="M8 1.2l2.06 4.18 4.6.67-3.33 3.25.79 4.58L8 11.7l-4.12 2.17.79-4.58L1.34 6.05l4.6-.67z" />
    </svg>
  )
}

export function TrophyIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M5 2.5h6v4a3 3 0 01-6 0z" fill="#F59E0B" />
      <path d="M5 3.5H2.5a2 2 0 002 2H5M11 3.5h2.5a2 2 0 01-2 2H11" stroke="#B45309" strokeWidth="1.1" />
      <path d="M7 9.3v2M6 13.5h4l-.5-2h-3z" fill="#B45309" />
    </svg>
  )
}

export function FireIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.5c1 2 3.5 3 3.5 6.5a3.5 3.5 0 01-7 0c0-1 .4-1.7.9-2.3-.1.9.2 1.5.7 1.8C6 6.5 6.5 4.5 8 1.5z" fill="#F97316" />
      <path d="M8 9.2a1.5 1.5 0 01-1.5-1.5c0-.5.2-.8.4-1.1.1.5.4.8.8.9.1-.5-.1-.9-.3-1.3.8.5 1.6 1.2 1.6 2A1.5 1.5 0 018 9.2z" fill="#FDE68A" />
    </svg>
  )
}

export function CelebrateIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 14l3.5-9.5L11.5 10z" fill="#60A5FA" />
      <rect x="9.5" y="1.5" width="2" height="2" rx="0.4" fill="#F59E0B" transform="rotate(20 10.5 2.5)" />
      <rect x="12.5" y="4.5" width="1.6" height="1.6" rx="0.4" fill="#F472B6" transform="rotate(-15 13.3 5.3)" />
      <circle cx="13" cy="2" r="0.9" fill="#34D399" />
      <circle cx="4" cy="2.5" r="0.8" fill="#F472B6" />
    </svg>
  )
}
