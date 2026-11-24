import React, { useState } from 'react';
import {
  Award,
  CalendarHeart,
  Check,
  Copy,
  Diamond,
  Gift,
  Lock,
  RotateCcw,
  Sparkles,
  Sun,
  Users,
} from 'lucide-react';
import { AppState, Lang, ModuleDef } from '../types';
import {
  TOTAL_TASKS,
  buildInviteUrl,
  computeAnniversaryInfo,
  isModuleFinished,
  isModuleUnlocked,
  isTaskDone,
  partnerName,
  taskKeys,
  totalCompletedTasks,
} from '../utils/storage';

interface MapViewProps {
  lang: Lang;
  modules: ModuleDef[];
  state: AppState;
  onSelectStation: (idx: number) => void;
  onOpenPay: () => void;
  onOpenReset: () => void;
  onOpenAnniversary: () => void;
  onOpenDailyCard: () => void;
  onOpenFinaleHub: () => void;
  onSetupSingle: (partnerNameStr: string) => void;
  onCreateInvite: (partnerNameStr: string, partnerPhoneStr: string) => void;
  onChangeMode: () => void;
  onCopyText: (text: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  lang,
  modules,
  state,
  onSelectStation,
  onOpenPay,
  onOpenReset,
  onOpenAnniversary,
  onOpenDailyCard,
  onOpenFinaleHub,
  onSetupSingle,
  onCreateInvite,
  onChangeMode,
  onCopyText,
}) => {
  const X = (h: string, e: string) => (lang === 'he' ? h : e);
  const [pickMode, setPickMode] = useState<'single' | 'remote' | null>(null);
  const [pName, setPName] = useState(state.names[1] || '');
  const [pPhone, setPPhone] = useState(state.partner?.phone || '');
  const [modeErr, setModeErr] = useState('');

  const completedCount = totalCompletedTasks(state, modules);
  const allCompleted = completedCount === TOTAL_TASKS;
  const nextStationIdx = modules.findIndex(
    (_, i) => !isModuleFinished(state, i) && (i === 0 || isModuleFinished(state, i - 1)),
  );

  const nameA = partnerName(state, 0);
  const nameB = partnerName(state, 1);
  const annivInfo = computeAnniversaryInfo(state.anniversary);

  const inviteUrl = state.room ? buildInviteUrl(state.room) : '';
  const waHref = (() => {
    let digits = (state.partner?.phone || '').replace(/\D/g, '');
    if (digits.startsWith('0')) digits = `972${digits.slice(1)}`;
    const msg = X(
      `היי ${state.partner?.name || ''}, ${state.user?.name || ''} מזמין/ה אותך לשחק איתי בשפת הקשר 💞 ${inviteUrl}`,
      `Hi ${state.partner?.name || ''}, ${state.user?.name || ''} invites you to play The Language of Connection together 💞 ${inviteUrl}`,
    );
    return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
  })();

  const renderCoupleCard = () => {
    if (!state.mode) {
      if (pickMode === 'single') {
        return (
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-sm space-y-3">
            <h3 className="text-lg font-bold">
              👫 {X('משחקים יחד במכשיר אחד', 'Playing together on one device')}
            </h3>
            <label className="block text-sm font-bold text-[var(--rose)]">
              {X('שם בן/בת הזוג', 'Partner’s name')}
            </label>
            <input
              type="text"
              maxLength={24}
              value={pName}
              onChange={(e) => setPName(e.target.value)}
              placeholder={X('השם של בן/בת הזוג…', 'Your partner’s name…')}
              className="w-full rounded-xl border-2 border-[var(--line)] bg-[var(--card)] px-4 py-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--rose)]"
            />
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setPickMode(null);
                  setModeErr('');
                }}
                className="min-h-[42px] px-5 rounded-full border-2 border-[var(--rose)] text-[var(--rose)] font-bold text-sm cursor-pointer"
              >
                {X('חזרה', 'Back')}
              </button>
              <button
                type="button"
                onClick={() => {
                  onSetupSingle(pName.trim());
                  setPickMode(null);
                }}
                className="min-h-[42px] px-6 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white font-bold text-sm shadow-sm cursor-pointer"
              >
                {X('המשך', 'Continue')}
              </button>
            </div>
          </div>
        );
      }

      if (pickMode === 'remote') {
        return (
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-sm space-y-3">
            <h3 className="text-lg font-bold">
              📱 {X('הזמנת בן/בת זוג למכשיר נפרד', 'Invite your partner on a separate device')}
            </h3>
            <label className="block text-sm font-bold text-[var(--rose)]">
              {X('שם בן/בת הזוג', 'Partner’s name')}
            </label>
            <input
              type="text"
              maxLength={24}
              value={pName}
              onChange={(e) => setPName(e.target.value)}
              className="w-full rounded-xl border-2 border-[var(--line)] bg-[var(--card)] px-4 py-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--rose)]"
            />
            <label className="block text-sm font-bold text-[var(--rose)]">
              {X('טלפון בן/בת הזוג', 'Partner’s phone')}
            </label>
            <input
              type="tel"
              dir="ltr"
              inputMode="tel"
              placeholder="050-0000000"
              value={pPhone}
              onChange={(e) => setPPhone(e.target.value)}
              className="w-full rounded-xl border-2 border-[var(--line)] bg-[var(--card)] px-4 py-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--rose)]"
            />
            {modeErr && <p className="text-sm font-semibold text-rose-600">{modeErr}</p>}
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setPickMode(null);
                  setModeErr('');
                }}
                className="min-h-[42px] px-5 rounded-full border-2 border-[var(--rose)] text-[var(--rose)] font-bold text-sm cursor-pointer"
              >
                {X('חזרה', 'Back')}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (pName.trim().length < 2 || pPhone.replace(/\D/g, '').length < 8) {
                    setModeErr(
                      X(
                        'נא להזין שם וטלפון תקינים של בן/בת הזוג',
                        'Please enter your partner’s name and a valid phone number',
                      ),
                    );
                    return;
                  }
                  setModeErr('');
                  onCreateInvite(pName.trim(), pPhone.trim());
                  setPickMode(null);
                }}
                className="min-h-[42px] px-6 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white font-bold text-sm shadow-sm cursor-pointer"
              >
                {X('צרו לינק הזמנה', 'Create invite link')}
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-sm space-y-3">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--rose)]" />
            <span>{X('איך משחקים היום?', 'How are you playing today?')}</span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPickMode('single')}
              className="text-start rounded-2xl border-2 border-[var(--line)] bg-[var(--card)] p-4 hover:border-[var(--rose)] transition-colors cursor-pointer"
            >
              <div className="font-bold">
                👫 {X('משחקים יחד במכשיר אחד', 'Playing together on one device')}
              </div>
              <div className="text-xs text-[var(--mut)] mt-1">
                {X('מעבירים את הטלפון ביניכם', 'Pass the phone between you')}
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPickMode('remote')}
              className="text-start rounded-2xl border-2 border-[var(--line)] bg-[var(--card)] p-4 hover:border-[var(--rose)] transition-colors cursor-pointer"
            >
              <div className="font-bold">
                📱 {X('הזמנת בן/בת זוג למכשיר נפרד', 'Invite partner on a separate device')}
              </div>
              <div className="text-xs text-[var(--mut)] mt-1">
                {X('יוצרים קישור הזמנה (?invite=...)', 'Create an invite link (?invite=...)')}
              </div>
            </button>
          </div>
        </div>
      );
    }

    if (state.mode === 'single') {
      return (
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-sm sm:text-base">
              👫 {X(`משחקים יחד במכשיר אחד: ${nameA} ♥ ${nameB}`, `Together on one device: ${nameA} ♥ ${nameB}`)}
            </p>
            {Boolean(state.full) && (
              <p className="text-xs text-[var(--sage)] font-semibold mt-0.5">
                💎 {X('גישה מלאה פתוחה לזוג', 'Full access unlocked for the couple')}
                {state.paidBy ? ` (${X('שולם ע״י', 'paid by')} ${state.paidBy})` : ''}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onChangeMode}
            className="min-h-[36px] px-4 rounded-full bg-[var(--soft)] text-[var(--rose)] text-xs font-bold cursor-pointer"
          >
            {X('שינוי', 'Change')}
          </button>
        </div>
      );
    }

    const isConnected = state.status === 'connected';
    return (
      <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`text-sm font-extrabold ${
              isConnected ? 'text-[var(--sage)]' : 'text-[var(--gold)]'
            }`}
          >
            {isConnected
              ? X('✅ מחוברים יחד', '✅ Connected together')
              : X(`⏳ ממתינים לכניסת ${nameB}`, `⏳ Waiting for ${nameB}`)}
          </span>
          <button
            type="button"
            onClick={onChangeMode}
            className="min-h-[34px] px-3.5 rounded-full bg-[var(--soft)] text-[var(--rose)] text-xs font-bold cursor-pointer"
          >
            {X('שינוי מצב משחק', 'Change play mode')}
          </button>
        </div>

        <p className="font-semibold text-sm">
          {nameA} ♥ {nameB}
        </p>

        {state.me === 0 && !isConnected && inviteUrl && (
          <div className="space-y-2.5 pt-1">
            <p className="text-xs text-[var(--mut)]">
              {X('שלחו את לינק ההזמנה לבן/בת הזוג (אימות עם קוד 1234):', 'Send this invite link to your partner (verify with 1234):')}
            </p>
            <div
              dir="ltr"
              className="rounded-xl bg-[var(--soft)] p-2.5 text-xs font-mono break-all select-all text-left"
            >
              {inviteUrl}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onCopyText(inviteUrl)}
                className="inline-flex items-center gap-1.5 min-h-[40px] px-4 rounded-full border-2 border-[var(--rose)] text-[var(--rose)] text-xs font-bold cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{X('העתקת לינק', 'Copy link')}</span>
              </button>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-h-[40px] px-4 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white text-xs font-bold"
              >
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        {Boolean(state.full) && (
          <p className="text-xs text-[var(--sage)] font-semibold">
            💎 {X('גישה מלאה פתוחה לשני בני הזוג', 'Full access unlocked for both partners')}
            {state.paidBy ? ` (${state.paidBy})` : ''}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-editorial text-2xl sm:text-3xl font-extrabold">
          {X(`המסע של ${nameA} ♥ ${nameB}`, `${nameA} ♥ ${nameB}’s journey`)}{' '}
          {allCompleted ? '🎉' : '💗'}
        </h2>
      </div>

      {renderCoupleCard()}

      {/* Anniversary Countdown + Daily Closeness Card Strip */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[var(--soft)]/80 to-[var(--card)] p-4 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--gold)]">
              <CalendarHeart className="w-4 h-4" />
              <span>{X('יום הנישואין שלכם', 'Your Anniversary')}</span>
            </div>
            {annivInfo ? (
              annivInfo.isToday ? (
                <p className="font-extrabold text-base text-[var(--rose)]">
                  🥂 {X('יום נישואין שמח היום!', 'Happy Anniversary Today!')}
                </p>
              ) : (
                <p className="font-bold text-sm">
                  {X(
                    `עוד ${annivInfo.daysLeft} ימים לחגיגה (שנה ${annivInfo.yearsTogether})`,
                    `${annivInfo.daysLeft} days until year ${annivInfo.yearsTogether}`,
                  )}
                </p>
              )
            ) : (
              <p className="text-xs text-[var(--mut)]">
                {X('הגדירו תאריך לספירה לאחור חגיגית', 'Set your date for a festive countdown')}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onOpenAnniversary}
            className="min-h-[38px] px-3.5 rounded-full bg-[var(--card)] border border-[var(--line)] text-xs font-bold text-[var(--rose)] hover:border-[var(--rose)] shrink-0 cursor-pointer"
          >
            {annivInfo ? X('עריכה', 'Edit') : X('הגדרה', 'Set date')}
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenDailyCard}
          className="text-start rounded-3xl border-2 border-[var(--rose2)]/70 bg-gradient-to-br from-[var(--card)] to-[var(--soft)] p-4 flex items-center justify-between gap-3 hover:border-[var(--rose)] transition-colors cursor-pointer shadow-sm"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--rose)]">
              <Sun className="w-4 h-4" />
              <span>{X('450+ משימות מתחלפות · שליחה לוואטסאפ', '450+ rotating missions · WhatsApp')}</span>
            </div>
            <p className="font-extrabold text-base mt-0.5">
              ✨ {X('משימת הקרבה היומית', 'Daily Closeness Mission')}
            </p>
          </div>
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--rose)] text-white shrink-0">
            <Sparkles className="w-5 h-5" />
          </span>
        </button>
      </div>

      {/* End of Journey / Gift / Album / Competition / Certificate Hub Banner */}
      {allCompleted ? (
        <div className="rounded-3xl border-2 border-[var(--gold)] bg-gradient-to-br from-[var(--soft)] via-[var(--card)] to-[var(--soft)] p-6 text-center space-y-4 shadow-md">
          <div className="text-3xl">🥂🏆💞</div>
          <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[var(--rose)]">
            {X('הגעתם ליעד! המסע הושלם באהבה', 'You made it! The journey is complete')}
          </h3>
          <p className="text-sm sm:text-base max-w-lg mx-auto">
            {X(
              'אהבה ללא שפה – מתבלבלת. שפה בלי קרבה – ריקה. עכשיו מחכה לכם המשימה היצירתית “המתנה שלנו”, האלבום הזוגי, התחרות השנתית ותעודת ההוקרה המעוצבת שלכם.',
              'Love without language gets confused. Language without closeness is empty. Now open your creative mission “Our Gift”, the Couple’s Album, the annual competition, and your designed Certificate of Appreciation.',
            )}
          </p>
          <button
            type="button"
            onClick={onOpenFinaleHub}
            className="inline-flex items-center gap-2 min-h-[48px] px-7 py-3 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--gold)] text-white font-extrabold shadow-lg hover:-translate-y-0.5 transition-transform cursor-pointer"
          >
            <Award className="w-5 h-5" />
            <span>{X('למתנה שלנו, האלבום ותעודת ההוקרה', 'Open Our Gift, Album & Certificate')}</span>
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)]/85 p-3.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <Gift className="w-4 h-4 text-[var(--gold)] shrink-0" />
            <span>
              {X(
                'המתנה שלנו · האלבום הזוגי · תעודת סיום',
                'Our Gift · Couple’s Album · Certificate',
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenFinaleHub}
            className="min-h-[36px] px-4 rounded-full bg-[var(--soft)] text-[var(--rose)] text-xs font-bold hover:opacity-90 cursor-pointer"
          >
            {X('פתיחה', 'Open')}
          </button>
        </div>
      )}

      {!state.full && (
        <div className="text-center">
          <button
            type="button"
            onClick={onOpenPay}
            className="inline-flex items-center gap-2 min-h-[44px] px-6 py-2 rounded-full border-2 border-[var(--rose)] text-[var(--rose)] font-bold hover:bg-[var(--soft)] transition-colors cursor-pointer"
          >
            <Diamond className="w-4 h-4" />
            <span>{X('פתיחת הגרסה המלאה לזוג (20 ₪)', 'Unlock full version for the couple ($6)')}</span>
          </button>
        </div>
      )}

      {/* 6 Stations Map */}
      <div className="relative space-y-6 pt-2">
        {modules.map((mod, idx) => {
          const priorDone = idx === 0 || isModuleFinished(state, idx - 1);
          const unlocked = isModuleUnlocked(state, idx);
          const finished = isModuleFinished(state, idx);
          const needsPay = priorDone && !unlocked;
          const isNext = idx === nextStationIdx && !allCompleted;
          const keys = taskKeys(idx);
          const offsetCls =
            idx % 2 === 1 ? 'ms-5 sm:ms-8' : 'me-5 sm:me-8';

          return (
            <div
              key={idx}
              data-next-station={isNext ? 'true' : undefined}
              className={`relative ${offsetCls}`}
            >
              <button
                type="button"
                disabled={!unlocked && !needsPay}
                onClick={() => {
                  if (unlocked) onSelectStation(idx);
                  else if (needsPay) onOpenPay();
                }}
                className={`w-full text-start flex items-center gap-4 rounded-3xl border-2 bg-[var(--card)] p-4 sm:p-5 transition-all cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed ${
                  finished
                    ? 'border-[var(--sage)]'
                    : isNext
                      ? 'border-[var(--rose)] station-next-glow'
                      : unlocked
                        ? 'border-[var(--rose2)] shadow-sm'
                        : needsPay
                          ? 'border-[var(--gold)]'
                          : 'border-[var(--line)]'
                } ${idx === 5 ? 'border-dashed' : ''}`}
              >
                <div className="w-14 h-14 rounded-full bg-[var(--soft)] flex items-center justify-center text-2xl shrink-0">
                  {unlocked ? mod.ic : needsPay ? '💎' : <Lock className="w-5 h-5 text-[var(--mut)]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-[var(--mut)]">
                    {idx === 5
                      ? X('תחנה 6 · פרמיום (100 קלפים)', 'Station 6 · Premium (100 cards)')
                      : `${X('תחנה', 'Station')} ${idx + 1}`}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold truncate">{mod.t}</h3>
                  <p className="text-xs sm:text-sm text-[var(--mut)]">
                    {needsPay
                      ? X('לחצו לפתיחה בגרסה המלאה לזוג', 'Tap to unlock the full version')
                      : mod.s}
                  </p>
                  {isNext && (
                    <p className="text-xs font-extrabold text-[var(--rose)] mt-1">
                      👉 {X('כאן ממשיכים', 'Continue here')}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 mt-2">
                    {keys.map((k) => {
                      const done = isTaskDone(state, idx, k);
                      return (
                        <span
                          key={k}
                          className={`h-1.5 w-6 rounded-full ${
                            done ? 'bg-[var(--sage)]' : 'bg-[var(--line)]'
                          }`}
                        />
                      );
                    })}
                    {finished && <Check className="w-3.5 h-3.5 text-[var(--sage)] ms-1" />}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-[var(--mut)]">
        {X(
          'כל תחנה נפתחת אחרי שמשלימים את הקודמת: לימוד, כלי ותרגול.',
          'Each station opens after completing the previous one: lesson, tool, and practice.',
        )}
      </p>

      <div className="text-center pt-3">
        <button
          type="button"
          onClick={onOpenReset}
          className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-2.5 rounded-full border-2 border-rose-600 dark:border-rose-400 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-200 text-sm font-extrabold shadow-sm hover:bg-rose-100 dark:hover:bg-rose-900/70 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{X('איפוס התקדמות מלא', 'Full progress reset')}</span>
        </button>
      </div>
    </div>
  );
};
