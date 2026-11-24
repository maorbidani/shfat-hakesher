import React, { useEffect, useMemo, useState } from 'react';
import { Copy, Dice5, MessageCircle, Send, Sparkles, X as CloseIcon } from 'lucide-react';
import {
  ROMANCE_CATEGORIES,
  RomanceCategory,
  buildWhatsAppSendUrl,
  getRomancePool,
  getTotalRomanceCount,
} from '../data/romanceBank';
import { AppState, Lang } from '../types';
import { partnerName } from '../utils/storage';

interface ChatDrawerProps {
  open: boolean;
  lang: Lang;
  state: AppState;
  onClose: () => void;
  onCopyText: (text: string) => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  open,
  lang,
  state,
  onClose,
  onCopyText,
}) => {
  const X = (h: string, e: string) => (lang === 'he' ? h : e);
  const [category, setCategory] = useState<RomanceCategory>('all');
  const [drawnIndex, setDrawnIndex] = useState<number>(0);
  const [messageText, setMessageText] = useState<string>('');

  const pool = useMemo(() => getRomancePool(lang, category), [lang, category]);
  const totalCount = useMemo(() => getTotalRomanceCount(lang), [lang]);

  // Pick an initial random sentence when opening or changing category/language
  useEffect(() => {
    if (pool.length === 0) return;
    const randomIdx = Math.floor(Math.random() * pool.length);
    setDrawnIndex(randomIdx);
    setMessageText(pool[randomIdx]);
  }, [pool]);

  if (!open) return null;

  const drawNewSentence = () => {
    if (pool.length === 0) return;
    let nextIdx = Math.floor(Math.random() * pool.length);
    if (pool.length > 1 && nextIdx === drawnIndex) {
      nextIdx = (nextIdx + 1) % pool.length;
    }
    setDrawnIndex(nextIdx);
    setMessageText(pool[nextIdx]);
  };

  const partnerTargetName = partnerName(state, state.me === 0 ? 1 : 0);
  const partnerPhone = state.partner?.phone || '';
  const waHref = buildWhatsAppSendUrl(messageText.trim(), partnerPhone);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={X('שיח זוגי – שליחה מהירה לוואטסאפ', 'Couple Dialogue – Quick WhatsApp Hub')}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-3xl border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] shadow-2xl flex flex-col p-5 overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-[var(--line)]">
          <div>
            <div className="flex items-center gap-2 font-extrabold text-lg text-[var(--rose)]">
              <MessageCircle className="w-5 h-5" />
              <span>{X('שיח זוגי בוואטסאפ', 'Couple WhatsApp Hub')}</span>
            </div>
            <p className="text-xs text-[var(--mut)] mt-0.5">
              {X(
                `מאגר של ${totalCount.toLocaleString()} משפטי קרבה, אהבה ורומנטיקה לשליחה ישירה אל ${partnerTargetName}`,
                `Bank of ${totalCount.toLocaleString()} closeness & romance messages ready to send to ${partnerTargetName}`,
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={X('סגירה', 'Close')}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[var(--soft)] text-[var(--rose)] shrink-0 cursor-pointer"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Categories */}
        <div className="py-3">
          <div className="flex flex-wrap gap-1.5">
            {ROMANCE_CATEGORIES.map((cat) => {
              const active = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`min-h-[36px] px-3 py-1 rounded-full border text-xs font-bold transition-colors cursor-pointer ${
                    active
                      ? 'border-[var(--rose)] bg-[var(--rose)] text-white'
                      : 'border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--rose)]'
                  }`}
                >
                  {cat.emoji} {lang === 'he' ? cat.he : cat.en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message Preview / Editor */}
        <div className="rounded-2xl border-2 border-[var(--rose2)] bg-gradient-to-br from-[var(--soft)] to-[var(--card)] p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 text-xs font-bold text-[var(--rose)]">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              {X('המשפט שנבחר עבורכם (אפשר גם לערוך):', 'Selected message (editable):')}
            </span>
            <span className="text-[var(--mut)] tabular-nums">
              {pool.length.toLocaleString()} {X('משפטים', 'options')}
            </span>
          </div>

          <textarea
            rows={4}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={X('כתבו או הגרילו משפט חם…', 'Write or draw a warm sentence…')}
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-3.5 py-2.5 text-base font-medium text-[var(--ink)] leading-relaxed focus:outline-none focus:border-[var(--rose)]"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={drawNewSentence}
              className="inline-flex items-center gap-2 min-h-[42px] px-4 py-2 rounded-full border-2 border-[var(--rose)] bg-[var(--card)] text-[var(--rose)] font-bold text-sm hover:bg-[var(--soft)] transition-colors cursor-pointer"
            >
              <Dice5 className="w-4 h-4" />
              <span>{X('הגרל משפט חדש', 'Draw new sentence')}</span>
            </button>

            <button
              type="button"
              disabled={!messageText.trim()}
              onClick={() => onCopyText(messageText.trim())}
              className="inline-flex items-center gap-1.5 min-h-[42px] px-4 py-2 rounded-full bg-[var(--soft)] text-[var(--rose)] font-bold text-sm hover:opacity-90 disabled:opacity-40 cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>{X('העתקה', 'Copy')}</span>
            </button>
          </div>
        </div>

        {/* Direct WhatsApp CTA */}
        <div className="pt-4 space-y-2.5">
          <a
            href={messageText.trim() ? waHref : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!messageText.trim()}
            onClick={(e) => {
              if (!messageText.trim()) e.preventDefault();
            }}
            className={`w-full inline-flex items-center justify-center gap-2 min-h-[50px] px-6 py-3 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-extrabold text-base shadow-md hover:opacity-95 transition-opacity ${
              !messageText.trim() ? 'opacity-45 pointer-events-none' : ''
            }`}
          >
            <Send className="w-5 h-5" />
            <span>{X('שלח לוואטסאפ בלחיצה', 'Send to WhatsApp in 1 tap')}</span>
          </a>

          {!partnerPhone && (
            <p className="text-[11px] text-center text-[var(--mut)]">
              {X(
                'ללא מספר טלפון שמור – וואטסאפ ייפתח עם הטקסט מוכן לבחירת איש הקשר.',
                'No partner phone saved — WhatsApp will open with your text ready to pick your contact.',
              )}
            </p>
          )}
        </div>

        {/* Prominent Bottom Close Button */}
        <div className="pt-4 mt-2 border-t border-[var(--line)]">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[44px] rounded-full border-2 border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] font-bold text-sm hover:border-[var(--rose)] transition-colors cursor-pointer"
          >
            {X('סגור', 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
};
