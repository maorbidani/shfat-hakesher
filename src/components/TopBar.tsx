import React from 'react';
import { ArrowLeft, ArrowRight, MessageCircle, Moon, Settings, Sun } from 'lucide-react';
import { Lang, ThemeMode, ViewState } from '../types';

interface TopBarProps {
  lang: Lang;
  theme: ThemeMode;
  isDarkResolved: boolean;
  view: ViewState;
  progressPct: number;
  isLoggedIn: boolean;
  unreadCount: number;
  onSetLang: (l: Lang) => void;
  onToggleTheme: () => void;
  onBack: () => void;
  onOpenChat: () => void;
  onOpenSettings: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  lang,
  isDarkResolved,
  view,
  progressPct,
  isLoggedIn,
  unreadCount,
  onSetLang,
  onToggleTheme,
  onBack,
  onOpenChat,
  onOpenSettings,
}) => {
  const X = (h: string, e: string) => (lang === 'he' ? h : e);
  const showJourneyNav = isLoggedIn && (view === 'map' || view === 'mod');
  const BackArrow = lang === 'he' ? ArrowRight : ArrowLeft;

  return (
    <header className="w-full mb-4 space-y-2.5">
      {/* Fixed-layout top strip (dir="ltr" ensures language switcher NEVER flips or moves) */}
      <div
        dir="ltr"
        className="flex items-center justify-between gap-2 py-1"
      >
        {/* Physical Left side: contextual chat & settings */}
        <div className="flex items-center gap-2">
          {showJourneyNav ? (
            <>
              <button
                type="button"
                onClick={onOpenChat}
                className="relative inline-flex items-center gap-2 min-h-[40px] px-3.5 py-2 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white text-sm font-bold shadow-sm hover:opacity-95 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>{X('שיח זוגי', 'Couple chat')}</span>
              </button>
              <button
                type="button"
                onClick={onOpenSettings}
                aria-label={X('הגדרות', 'Settings')}
                title={X('הגדרות ואיפוס', 'Settings & Reset')}
                className="inline-flex items-center justify-center min-h-[40px] min-w-[40px] rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--rose)] transition-colors shrink-0 cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>
            </>
          ) : (
            <span className="text-xs font-semibold text-[var(--mut)] tracking-wide">
              שפת הקשר
            </span>
          )}
        </div>

        {/* Physical Right side: Theme toggle + Stable Language selector */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={X('החלפת מצב יום/לילה', 'Toggle day/night theme')}
            title={isDarkResolved ? X('מצב יום', 'Day mode') : X('מצב לילה', 'Night mode')}
            className="inline-flex items-center justify-center min-h-[40px] min-w-[40px] rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--rose)] transition-colors cursor-pointer"
          >
            {isDarkResolved ? <Sun className="w-4 h-4 text-[var(--gold)]" /> : <Moon className="w-4 h-4 text-[var(--rose)]" />}
          </button>

          <div
            role="group"
            aria-label="Language selector"
            className="inline-flex items-center rounded-full border-2 border-[var(--line)] bg-[var(--card)] overflow-hidden p-0.5 shrink-0"
          >
            <button
              type="button"
              onClick={() => onSetLang('he')}
              className={`min-h-[34px] px-3 text-xs sm:text-sm font-bold rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                lang === 'he'
                  ? 'bg-[var(--rose)] text-white'
                  : 'text-[var(--mut)] hover:text-[var(--ink)]'
              }`}
            >
              עברית
            </button>
            <button
              type="button"
              onClick={() => onSetLang('en')}
              className={`min-h-[34px] px-3 text-xs sm:text-sm font-bold rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                lang === 'en'
                  ? 'bg-[var(--rose)] text-white'
                  : 'text-[var(--mut)] hover:text-[var(--ink)]'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Journey Top Navigation + Progress Bar */}
      {showJourneyNav && (
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-1.5 rounded-full bg-[var(--soft)] text-[var(--rose)] text-sm font-bold hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BackArrow className="w-4 h-4 shrink-0" />
            <span>{view === 'map' ? X('מבוא', 'Intro') : X('למפה', 'Map')}</span>
          </button>

          <div className="flex-1 h-3 rounded-full bg-[var(--line)] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--gold)] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <span className="text-sm font-extrabold text-[var(--rose)] tabular-nums min-w-[42px] text-end">
            {progressPct}%
          </span>
        </div>
      )}
    </header>
  );
};
