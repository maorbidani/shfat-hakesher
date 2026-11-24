import React, { useState } from 'react';
import {
  Award,
  CalendarHeart,
  Camera,
  Check,
  Download,
  Gift,
  Lock,
  RefreshCw,
  RotateCcw,
  Send,
  Settings,
  Sparkles,
  Trash2,
  Trophy,
  X as CloseIcon,
} from 'lucide-react';
import { getDailyMissionsPool, getMissionForDate } from '../data/dailyMissions';
import { buildWhatsAppSendUrl } from '../data/romanceBank';
import { AlbumPhoto, AppState, Lang, LangContent } from '../types';
import {
  ACCESS_CODE,
  PAY_URL,
  TOTAL_TASKS,
  compressImageFile,
  downloadCertificatePng,
  partnerName,
  totalCompletedTasks,
  uid,
} from '../utils/storage';

export type ActiveModalType =
  | 'pay'
  | 'reset'
  | 'anniversary'
  | 'daily'
  | 'settings'
  | 'finale'
  | null;

interface ModalsProps {
  activeModal: ActiveModalType;
  lang: Lang;
  content: LangContent;
  state: AppState;
  onClose: () => void;
  onUnlockFull: (payerIdx: number) => void;
  onOpenResetFromSettings: () => void;
  onConfirmFullReset: () => void;
  onSaveAnniversary: (dateStr: string) => void;
  onSaveGift: (plan: string, done: boolean) => void;
  onAddPhoto: (photo: AlbumPhoto) => void;
  onDeletePhoto: (id: string) => void;
  onJoinCompetition: () => void;
  onOpenPayFromSettings?: () => void;
}

export const Modals: React.FC<ModalsProps> = ({
  activeModal,
  lang,
  content,
  state,
  onClose,
  onUnlockFull,
  onOpenResetFromSettings,
  onConfirmFullReset,
  onSaveAnniversary,
  onSaveGift,
  onAddPhoto,
  onDeletePhoto,
  onJoinCompetition,
  onOpenPayFromSettings,
}) => {
  const X = (h: string, e: string) => (lang === 'he' ? h : e);

  // Payment modal local state
  const [payer, setPayer] = useState<number>(state.me || 0);
  const [payCode, setPayCode] = useState('');
  const [payMsg, setPayMsg] = useState('');

  // Anniversary local state
  const [annivInput, setAnnivInput] = useState(state.anniversary || '');

  // Daily mission offset
  const [missionOffset, setMissionOffset] = useState(0);

  // Finale hub local state
  const [finaleTab, setFinaleTab] = useState<'gift' | 'album' | 'cert' | 'comp'>('gift');
  const [giftInput, setGiftInput] = useState(state.giftPlan || '');
  const [photoCaption, setPhotoCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  if (!activeModal) return null;

  const nameA = partnerName(state, 0);
  const nameB = partnerName(state, 1);
  const partnerPhone = state.partner?.phone || '';

  const completedCount = totalCompletedTasks(state, content.M);
  const progressPct = Math.round((completedCount / TOTAL_TASKS) * 100);
  const isJourneyComplete = progressPct === 100;

  // Daily closeness mission (450+ rotating practical missions)
  const todayKey = new Date().toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US');
  const dailyMission = getMissionForDate(lang, missionOffset);
  const totalDailyPool = getDailyMissionsPool(lang).length;
  const dailyWhatsAppText = X(
    `✨ משימת הקרבה היומית שלנו (שפת הקשר) 💞\n${dailyMission.category}:\n${dailyMission.text}`,
    `✨ Our Daily Closeness Mission (The Language of Connection) 💞\n${dailyMission.category}:\n${dailyMission.text}`,
  );

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await compressImageFile(file);
      onAddPhoto({
        id: uid() + Date.now(),
        dataUrl,
        caption: photoCaption.trim() || X('רגע של חיבור ❤️', 'A moment of connection ❤️'),
        date: new Date().toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US'),
      });
      setPhotoCaption('');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const CloseFooterButton = () => (
    <div className="pt-4 mt-4 border-t border-[var(--line)]">
      <button
        type="button"
        onClick={onClose}
        className="w-full min-h-[46px] rounded-full border-2 border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] font-bold text-sm hover:border-[var(--rose)] transition-colors cursor-pointer"
      >
        {X('סגור', 'Close')}
      </button>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`w-full rounded-3xl border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${
          activeModal === 'finale' ? 'max-w-2xl' : 'max-w-md'
        }`}
      >
        {/* 1. RESET CONFIRMATION */}
        {activeModal === 'reset' && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-extrabold text-[var(--rose)]">
              {X('האם לאפס את כל ההתקדמות?', 'Reset all progress?')}
            </h2>
            <p className="text-sm text-[var(--mut)] leading-relaxed">
              {X(
                'הכול יימחק לחלוטין: השלבים שהושלמו, שמות בני הזוג, הטלפונים, החיבור הזוגי, האלבום, תאריך הנישואין והגישה המלאה. תחזרו למסך ההתחברות ההתחלתי.',
                'Everything will be permanently erased: completed steps, partner names, phone numbers, couple link, album, anniversary date, and full access. You will return to the initial login screen.',
              )}
            </p>
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 min-h-[44px] rounded-full border-2 border-[var(--rose)] text-[var(--rose)] font-bold cursor-pointer"
              >
                {X('ביטול', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={onConfirmFullReset}
                className="flex-1 min-h-[44px] rounded-full bg-rose-600 text-white font-bold shadow-md hover:bg-rose-700 cursor-pointer"
              >
                {X('כן, לאפס הכול', 'Yes, reset everything')}
              </button>
            </div>
          </div>
        )}

        {/* 2. CLEAN SETTINGS MODAL (No anniversary duplicate + Prominent Reset + Close) */}
        {activeModal === 'settings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-extrabold text-xl">
                <Settings className="w-5 h-5 text-[var(--rose)]" />
                <span>{X('הגדרות', 'Settings')}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={X('סגירה', 'Close')}
                className="w-9 h-9 rounded-full bg-[var(--soft)] text-[var(--rose)] flex items-center justify-center cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--soft)]/60 p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[var(--mut)]">{X('בני הזוג:', 'Couple:')}</span>
                <span className="font-bold">
                  {nameA} ♥ {nameB}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--mut)]">{X('התקדמות במסע:', 'Journey progress:')}</span>
                <span className="font-extrabold text-[var(--rose)] tabular-nums">
                  {progressPct}% ({completedCount}/{TOTAL_TASKS})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--mut)]">{X('סטטוס גישה:', 'Access status:')}</span>
                <span className="font-bold">
                  {state.full
                    ? X('💎 גרסה מלאה פתוחה', '💎 Full version unlocked')
                    : X('שלב 1 פתוח', 'Stage 1 open')}
                </span>
              </div>
            </div>

            {!state.full && onOpenPayFromSettings && (
              <button
                type="button"
                onClick={onOpenPayFromSettings}
                className="w-full min-h-[44px] rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white font-bold text-sm shadow-sm cursor-pointer"
              >
                💎 {X('פתיחת הגרסה המלאה לזוג', 'Unlock full version for the couple')}
              </button>
            )}

            <a
              href="/shfat-hakesher.html"
              download="shfat-hakesher.html"
              className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full border-2 border-[var(--rose)] bg-[var(--card)] text-[var(--rose)] text-sm font-bold hover:bg-[var(--soft)] transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{X('הורדת האפליקציה כקובץ HTML עצמאי', 'Download standalone HTML file')}</span>
            </a>

            <div className="rounded-2xl border-2 border-rose-500/40 bg-rose-50/70 dark:bg-rose-950/35 p-4 space-y-2.5">
              <p className="text-xs font-semibold text-rose-800 dark:text-rose-200">
                {X(
                  'רוצים להתחיל מחדש כזוג או להחליף פרטים? ניתן לאפס את כל ההתקדמות בלחיצה:',
                  'Want to start over or change user details? Reset all progress anytime:',
                )}
              </p>
              <button
                type="button"
                onClick={onOpenResetFromSettings}
                className="w-full inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 rounded-full border-2 border-rose-600 dark:border-rose-400 bg-white dark:bg-rose-950 text-rose-700 dark:text-rose-200 text-sm font-extrabold shadow-sm hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{X('איפוס התקדמות מלא', 'Full progress reset')}</span>
              </button>
            </div>

            <CloseFooterButton />
          </div>
        )}

        {/* 3. SHARED COUPLE PAYMENT MODAL */}
        {activeModal === 'pay' && (
          <div className="text-center space-y-4">
            <div className="text-4xl">💎</div>
            <h2 className="font-editorial text-2xl font-extrabold">
              {X('פותחים את הגרסה המלאה לזוג', 'Unlock the full couple’s version')}
            </h2>
            <div className="text-5xl font-extrabold text-[var(--rose)]">
              {X('20 ₪', '$6')}
            </div>
            <p className="text-sm leading-relaxed">
              {X(
                'מספיק שאחד מבני הזוג משלם פעם אחת – והגישה המלאה נפתחת לשניכם: שלבים 2 עד 5 + שלב 6 הפרמיום האינטימי (100 קלפים).',
                'Only one partner needs to pay once – unlocking full access for both of you: stages 2 through 5 + the Premium Intimate Space (100 cards).',
              )}
            </p>

            <div>
              <p className="text-xs font-bold text-[var(--mut)] mb-2">
                {X('מי משלם?', 'Who is paying?')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[0, 1].map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPayer(idx)}
                    className={`min-h-[42px] rounded-xl border-2 font-bold text-sm cursor-pointer ${
                      payer === idx
                        ? 'border-[var(--rose)] bg-[var(--soft)] text-[var(--rose)]'
                        : 'border-[var(--line)]'
                    }`}
                  >
                    {partnerName(state, idx)}
                  </button>
                ))}
              </div>
            </div>

            {PAY_URL ? (
              <a
                href={PAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center min-h-[48px] rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white text-base font-extrabold shadow-md"
              >
                {X('לרכישה ותשלום משותף', 'Unlock together now')}
              </a>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setPayMsg(
                    X(
                      'לתשלום לבדיקה כרגע: הזינו את קוד הגישה 2026 למטה (או ?unlock=LOVE2026).',
                      'For testing now: enter access code 2026 below (or use ?unlock=LOVE2026).',
                    ),
                  )
                }
                className="w-full min-h-[48px] rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white text-base font-extrabold shadow-md cursor-pointer"
              >
                {X('לרכישה ותשלום משותף', 'Unlock together now')}
              </button>
            )}

            <div className="border-t border-[var(--line)] pt-4 space-y-2.5">
              <input
                type="text"
                inputMode="numeric"
                value={payCode}
                onChange={(e) => setPayCode(e.target.value)}
                placeholder={X('קוד בדיקה / גישה (2026)', 'Access / test code (2026)')}
                className="w-full rounded-xl border-2 border-[var(--line)] bg-[var(--card)] px-4 py-2.5 text-center text-[var(--ink)] focus:outline-none focus:border-[var(--rose)]"
              />
              <button
                type="button"
                onClick={() => {
                  if (payCode.trim() === ACCESS_CODE) {
                    setPayMsg('');
                    onUnlockFull(payer);
                  } else {
                    setPayMsg(X('הקוד שגוי, נסו שוב (2026)', 'Incorrect code, try again (2026)'));
                  }
                }}
                className="w-full min-h-[42px] rounded-full border-2 border-[var(--rose)] text-[var(--rose)] font-bold text-sm cursor-pointer"
              >
                {X('הפעלת קוד גישה', 'Activate access code')}
              </button>
              {payMsg && <p className="text-xs font-semibold text-[var(--rose)]">{payMsg}</p>}
            </div>

            <CloseFooterButton />
          </div>
        )}

        {/* 4. ANNIVERSARY SETTINGS MODAL (Opened only from Map Anniversary Card) */}
        {activeModal === 'anniversary' && (
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--soft)] text-[var(--gold)] mx-auto">
              <CalendarHeart className="w-6 h-6" />
            </div>
            <h2 className="font-editorial text-2xl font-bold">
              {X('תאריך הנישואין / יום השנה שלכם', 'Your Wedding / Anniversary Date')}
            </h2>
            <p className="text-sm text-[var(--mut)]">
              {X(
                'הזינו את התאריך כדי לראות ספירה לאחור חגיגית במסך המפה ולקבל תזכורת לאהבה.',
                'Enter your date to display a festive countdown on the journey map.',
              )}
            </p>
            <input
              type="date"
              dir="ltr"
              value={annivInput}
              onChange={(e) => setAnnivInput(e.target.value)}
              className="w-full rounded-xl border-2 border-[var(--line)] bg-[var(--card)] px-4 py-3 text-center text-[var(--ink)] focus:outline-none focus:border-[var(--rose)]"
            />
            <button
              type="button"
              onClick={() => {
                onSaveAnniversary(annivInput);
                onClose();
              }}
              className="w-full min-h-[46px] rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white font-bold shadow-md cursor-pointer"
            >
              {X('שמירת תאריך', 'Save date')}
            </button>

            <CloseFooterButton />
          </div>
        )}

        {/* 5. DAILY CLOSENESS MISSION MODAL (450+ rotating missions + Swap + WhatsApp) */}
        {activeModal === 'daily' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[var(--rose)]">
                <Sparkles className="w-4 h-4" />
                {X('משימת הקרבה היומית', 'Daily Closeness Mission')}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label={X('סגירה', 'Close')}
                className="w-8 h-8 rounded-full bg-[var(--soft)] text-[var(--rose)] flex items-center justify-center cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-3xl border-2 border-[var(--rose2)] bg-gradient-to-br from-[var(--soft)] to-[var(--card)] p-6 text-center space-y-3">
              <p className="text-xs font-bold text-[var(--gold)]">
                {todayKey} · {dailyMission.category}
              </p>
              <p className="font-editorial text-xl sm:text-2xl font-bold leading-snug">
                {dailyMission.text}
              </p>
              <p className="text-[11px] text-[var(--mut)]">
                {X(
                  `מאגר של ${totalDailyPool} משימות קרבה מתחלפות ברוח שפת הקשר`,
                  `Pool of ${totalDailyPool} rotating closeness missions`,
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setMissionOffset((prev) => prev + 1)}
                className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border-2 border-[var(--rose)] text-[var(--rose)] font-bold text-sm hover:bg-[var(--soft)] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{X('החלף משימה', 'Swap mission')}</span>
              </button>
            </div>

            <a
              href={buildWhatsAppSendUrl(dailyWhatsAppText, partnerPhone)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 min-h-[50px] px-5 py-2.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-extrabold text-sm sm:text-base shadow-md hover:opacity-95 transition-opacity"
            >
              <Send className="w-4 h-4" />
              <span>{X('שלח משימה לבן/בת הזוג בוואטסאפ', 'Send mission to partner on WhatsApp')}</span>
            </a>

            <CloseFooterButton />
          </div>
        )}

        {/* 6. END-OF-JOURNEY FINALE HUB */}
        {activeModal === 'finale' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-editorial text-2xl font-extrabold text-[var(--rose)]">
                🥂 {X('המתנה שלנו, האלבום ותעודת ההוקרה', 'Our Gift, Album & Certificate')}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={X('סגירה', 'Close')}
                className="w-9 h-9 rounded-full bg-[var(--soft)] text-[var(--rose)] flex items-center justify-center shrink-0 cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Hub Navigation Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'gift', label: X('🎁 המתנה שלנו', '🎁 Our Gift') },
                { id: 'album', label: X('📸 האלבום הזוגי', '📸 Couple Album') },
                {
                  id: 'cert',
                  label: isJourneyComplete
                    ? X('📜 תעודת הוקרה', '📜 Certificate')
                    : X('🔒 תעודת הוקרה', '🔒 Certificate'),
                },
                { id: 'comp', label: X('🏆 תחרות השנה', '🏆 Competition') },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFinaleTab(t.id as typeof finaleTab)}
                  className={`min-h-[40px] px-3 py-2 rounded-2xl border-2 text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                    finaleTab === t.id
                      ? 'border-[var(--rose)] bg-[var(--soft)] text-[var(--rose)]'
                      : 'border-[var(--line)] text-[var(--mut)]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB 1: OUR GIFT */}
            {finaleTab === 'gift' && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-[var(--soft)] p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[var(--rose)]">
                    <Gift className="w-5 h-5" />
                    <span>
                      {X(
                        'משימת יצירה זוגית – “המתנה שלנו” (ללא כסף!)',
                        'Couple’s Creative Mission – “Our Gift” (No Money!)',
                      )}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">
                    {X(
                      'צרו יחד או אחד עבור השנייה מחווה רומנטית מקורית שמגיעה מהלב ואינה עולה כסף. הקשיבו לרעיונות או המציאו רעיון משלכם:',
                      'Create an original romantic gesture from the heart without spending money. Pick an idea or invent your own:',
                    )}
                  </p>
                  <ul className="space-y-1 text-xs sm:text-sm list-disc ps-5">
                    {content.GIFT_IDEAS.map((idea, idx) => (
                      <li key={idx}>
                        <button
                          type="button"
                          onClick={() => setGiftInput(idea)}
                          className="text-start hover:underline cursor-pointer"
                        >
                          {idea}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold">
                    {X('מהי “המתנה שלנו” שבחרתם ליצור?', 'What is “Our Gift” you chose to create?')}
                  </label>
                  <textarea
                    rows={3}
                    value={giftInput}
                    onChange={(e) => setGiftInput(e.target.value)}
                    placeholder={X(
                      'תארו את המחווה המקורית שלכם…',
                      'Describe your original no-money romantic gesture…',
                    )}
                    className="w-full rounded-2xl border-2 border-[var(--line)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--rose)]"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={!giftInput.trim()}
                      onClick={() => onSaveGift(giftInput.trim(), true)}
                      className="inline-flex items-center gap-2 min-h-[44px] px-6 py-2 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white font-bold text-sm shadow-sm disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Check className="w-4 h-4" />
                      <span>
                        {state.giftDone
                          ? X('המתנה נשמרה ✓ (עדכון)', 'Gift saved ✓ (Update)')
                          : X('שמירת המשימה כבוצעה ✓', 'Save & mark complete ✓')}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: COUPLE'S ALBUM */}
            {finaleTab === 'album' && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--soft)]/60 p-4 space-y-3">
                  <p className="text-sm font-semibold">
                    {X(
                      'העלו תמונה מרגשת של “המתנה שלנו” או של רגע זוגי – היא נשמרת בדפדפן באלבום הזוגי שלכם.',
                      'Upload a photo of “Our Gift” or a special moment – saved locally in your Couple’s Album.',
                    )}
                  </p>
                  <input
                    type="text"
                    maxLength={80}
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    placeholder={X('כיתוב קצר לתמונה…', 'Short photo caption…')}
                    className="w-full rounded-xl border-2 border-[var(--line)] bg-[var(--card)] px-3.5 py-2 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--rose)]"
                  />
                  <label className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white font-bold text-sm shadow-sm cursor-pointer">
                    <Camera className="w-4 h-4" />
                    <span>
                      {uploading
                        ? X('מעלה ושומר…', 'Saving photo…')
                        : X('בחירת תמונה והעלאה לאלבום', 'Choose & upload photo')}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {state.album.length === 0 ? (
                  <p className="text-center text-sm text-[var(--mut)] py-6">
                    {X('האלבום הזוגי עדיין ריק. העלו את התמונה הראשונה שלכם 📷', 'Your Couple’s Album is empty. Upload your first memory 📷')}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {state.album.map((photo) => (
                      <div
                        key={photo.id}
                        className="rounded-2xl border border-[var(--line)] bg-[var(--card)] overflow-hidden shadow-sm"
                      >
                        <img
                          src={photo.dataUrl}
                          alt={photo.caption}
                          className="w-full h-44 object-cover"
                        />
                        <div className="p-3 flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold">{photo.caption}</p>
                            <p className="text-xs text-[var(--mut)]">{photo.date}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onDeletePhoto(photo.id)}
                            aria-label={X('מחיקה', 'Delete')}
                            className="p-1.5 text-[var(--mut)] hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: CERTIFICATE (LOCKED UNTIL 100% COURSE COMPLETION) */}
            {finaleTab === 'cert' && (
              <div className="space-y-4">
                {!isJourneyComplete ? (
                  <div className="rounded-3xl border-2 border-dashed border-[var(--gold)] bg-gradient-to-br from-[var(--soft)] to-[var(--card)] p-7 text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--card)] border-2 border-[var(--gold)] text-[var(--gold)] mx-auto shadow-sm">
                      <Lock className="w-7 h-7" />
                    </div>
                    <h3 className="font-editorial text-2xl font-extrabold text-[var(--rose)]">
                      {X('תעודת ההוקרה נעולה עדיין', 'Your Certificate Is Locked')}
                    </h3>
                    <p className="text-base leading-relaxed max-w-md mx-auto">
                      {X(
                        'התעודה הזוגית שלכם מחכה לכם כאן! השלימו את כל שלבי המסע של שפת הקשר כדי לפתוח ולקבל את תעודת ההוקרה האישית שלכם.',
                        'Your couple’s certificate is waiting for you here! Complete all stages of The Language of Connection journey to unlock and receive your personal Certificate of Appreciation.',
                      )}
                    </p>
                    <div className="max-w-sm mx-auto space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs font-extrabold">
                        <span className="text-[var(--mut)]">
                          {X('התקדמות נוכחית במסע', 'Current journey progress')}
                        </span>
                        <span className="text-[var(--rose)] tabular-nums">
                          {progressPct}% ({completedCount}/{TOTAL_TASKS})
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-[var(--line)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--gold)] transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="rounded-3xl border-4 border-[var(--gold)] bg-gradient-to-br from-[#fffaf4] via-[#fdf1ea] to-[#f8e4e0] text-[#3b2230] p-6 sm:p-8 text-center shadow-inner space-y-3 relative">
                      <div className="border border-[#c9566b]/50 rounded-2xl p-5 space-y-3">
                        <p className="text-xs font-extrabold tracking-widest text-[#d49a3a]">
                          ✦ {X('תעודת הוקרה זוגית', 'COUPLE CERTIFICATE OF APPRECIATION')} ✦
                        </p>
                        <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold">
                          {X('שיטת שפת הקשר', 'The Language of Connection')}
                        </h3>
                        <p className="text-sm text-[#7d6672]">
                          {X('מוענקת באהבה ובהוקרה רבה לזוג', 'Presented with love and gratitude to')}
                        </p>
                        <p className="font-editorial text-3xl sm:text-4xl font-black text-[#c9566b]">
                          {nameA} ♥ {nameB}
                        </p>
                        <p className="text-sm leading-relaxed max-w-md mx-auto">
                          {X(
                            'על הבחירה להקשיב בלי להאשים, לדבר מתוך אחריות, ולבנות יחד חיבור עמוק של קרבה, רוך ואהבה.',
                            'For choosing to listen without blame, speak with responsibility, and nurture closeness, tenderness, and enduring love.',
                          )}
                        </p>
                        {state.anniversary && (
                          <p className="text-xs font-bold text-[#d49a3a]">
                            {X('תאריך מיוחד:', 'Special Date:')} {state.anniversary}
                          </p>
                        )}
                        <div className="pt-2 flex flex-col items-center gap-1">
                          <span className="w-10 h-10 rounded-full bg-[#c9566b] text-white flex items-center justify-center border-2 border-[#d49a3a]">
                            ♥
                          </span>
                          <p className="text-xs font-bold pt-1">
                            {X('מאור בידאני – מייסד שיטת שפת הקשר', 'Maor Bidani – Founder of the Method')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => downloadCertificatePng(nameA, nameB, lang, state.anniversary)}
                        className="inline-flex items-center gap-2 min-h-[46px] px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--gold)] text-white font-bold shadow-md cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>{X('הורדת התעודה המעוצבת כתמונה', 'Download Certificate Image')}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB 4: OPTIONAL ROMANTIC COUPLE COMPETITION */}
            {finaleTab === 'comp' && (
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--soft)] text-[var(--gold)] mx-auto">
                  <Trophy className="w-7 h-7" />
                </div>
                <h3 className="font-editorial text-2xl font-bold">
                  {X('התחרות השנתית של הזוג הרומנטי', 'Annual Romantic Couple Competition')}
                </h3>
                <p className="text-sm text-[var(--mut)] leading-relaxed max-w-md mx-auto">
                  {X(
                    'רוצים להשתתף באופן אופציונלי בתחרות השנתית של קהילת שפת הקשר? תוכלו לשתף את סיפור “המתנה שלנו” והתמונה מהאלבום הזוגי.',
                    'Would you like to optionally enter the annual Language of Connection Romantic Couple Competition with your “Our Gift” gesture and Couple’s Album memory?',
                  )}
                </p>

                <div className="rounded-2xl bg-[var(--soft)] p-4 text-sm text-start space-y-1.5">
                  <div>
                    <b>{X('בני הזוג:', 'Couple:')}</b> {nameA} ♥ {nameB}
                  </div>
                  <div>
                    <b>{X('המתנה שלנו:', 'Our Gift:')}</b>{' '}
                    {state.giftPlan || X('עוד לא הוזנה (מומלץ להוסיף בלשונית המתנה)', 'Not added yet')}
                  </div>
                  <div>
                    <b>{X('תמונות באלבום:', 'Album photos:')}</b> {state.album.length}
                  </div>
                </div>

                {state.competitionJoined ? (
                  <div className="rounded-2xl border-2 border-[var(--sage)] bg-emerald-500/10 p-4 font-bold text-[var(--sage)]">
                    🎉{' '}
                    {X(
                      'נרשמתם בהצלחה לתחרות השנתית של הזוג הרומנטי! פרטיכם נשמרו.',
                      'You’re registered for the Annual Romantic Couple Competition! Entry saved.',
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={onJoinCompetition}
                    className="inline-flex items-center gap-2 min-h-[48px] px-7 py-2.5 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--gold)] text-white font-extrabold shadow-md cursor-pointer"
                  >
                    <Award className="w-5 h-5" />
                    <span>
                      {X(
                        'השתתפות בתחרות השנתית של הזוג הרומנטי',
                        'Join the Annual Romantic Couple Competition',
                      )}
                    </span>
                  </button>
                )}
              </div>
            )}

            <CloseFooterButton />
          </div>
        )}
      </div>
    </div>
  );
};
