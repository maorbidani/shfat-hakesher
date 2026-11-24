import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Copy, RefreshCw, Send, Sparkles } from 'lucide-react';
import { COLORS } from '../data/content';
import { buildWhatsAppSendUrl } from '../data/romanceBank';
import { AppState, Lang, LangContent } from '../types';
import { partnerName } from '../utils/storage';

interface ModuleToolsProps {
  lang: Lang;
  modIndex: number;
  content: LangContent;
  state: AppState;
  onMarkToolDone: (modIndex: number) => void;
  onSaveQuizResult: (resultIdx: number) => void;
  onGoToLesson: () => void;
  onGoToPractice: () => void;
  onSendToChat: (text: string) => void;
  onCopyText: (text: string) => void;
  onRoleColorChange: (role: 'ask' | 'ans' | null) => void;
}

export const ModuleTools: React.FC<ModuleToolsProps> = ({
  lang,
  modIndex,
  content,
  state,
  onMarkToolDone,
  onSaveQuizResult,
  onGoToLesson,
  onGoToPractice,
  onSendToChat,
  onCopyText,
  onRoleColorChange,
}) => {
  const X = (h: string, e: string) => (lang === 'he' ? h : e);
  const PrevIcon = lang === 'he' ? ArrowRight : ArrowLeft;
  const NextIcon = lang === 'he' ? ArrowLeft : ArrowRight;

  // Quiz state (Module 1)
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);

  // Pattern Match state (Module 2)
  const [matchIdx, setMatchIdx] = useState(0);
  const [matchSelections, setMatchSelections] = useState<Record<number, number>>({});

  // Sentence Builder state (Modules 3 & 4)
  const builderKey = modIndex === 3 ? 'build4' : 'build3';
  const [builderVals, setBuilderVals] = useState<Record<string, [string, string, string, string]>>({
    build3: ['', '', '', ''],
    build4: ['', '', '', ''],
  });

  // 5+5 Closeness Cards state (Module 5)
  const [cardPos, setCardPos] = useState(0);
  const [singleRoleOverride, setSingleRoleOverride] = useState<'ask' | 'ans' | null>(null);

  // Sync Module 5 active screen background color (Asker vs Answerer)
  useEffect(() => {
    if (modIndex === 4 && cardPos < 10) {
      const askerIdx = cardPos < 5 ? 0 : 1;
      const viewerIdx = state.mode === 'remote' ? state.me : 0;
      const computed: 'ask' | 'ans' =
        state.mode === 'remote'
          ? askerIdx === viewerIdx
            ? 'ask'
            : 'ans'
          : singleRoleOverride ?? (askerIdx === 0 ? 'ask' : 'ans');
      onRoleColorChange(computed);
    } else {
      onRoleColorChange(null);
    }
    return () => onRoleColorChange(null);
  }, [modIndex, cardPos, state.mode, state.me, singleRoleOverride, onRoleColorChange]);

  const toolKind = content.M[modIndex]?.tool;

  // ---------------- 1. QUIZ ----------------
  if (toolKind === 'quiz') {
    const questions = content.QZ;
    if (quizIdx >= questions.length) {
      const scores = [0, 0, 0];
      quizAnswers.forEach((ans) => {
        if (ans >= 0 && ans < 3) scores[ans]++;
      });
      const topIdx = scores.indexOf(Math.max(...scores));
      const res = content.QR[topIdx];

      return (
        <div className="space-y-4">
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 text-center shadow-sm space-y-3">
            <p className="text-sm text-[var(--mut)]">
              {X('השפה שפועלת בך עכשיו', 'The language working in you now')}
            </p>
            <h3 className="font-editorial text-3xl font-extrabold text-[var(--rose)]">
              {res[0]}
            </h3>
            <p className="text-base leading-relaxed">{res[1]}</p>
            <p className="text-sm text-[var(--mut)]">
              {X(
                'זו תמונת מצב, לא שיפוט: אי אפשר לשנות שפה שלא מזהים. מודעות היא תחילתה של בחירה.',
                'This is a snapshot, not a judgment: you can’t change a language you don’t recognize. Awareness is the beginning of choice.',
              )}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setQuizIdx(0);
                  setQuizAnswers([]);
                }}
                className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 rounded-full border-2 border-[var(--rose)] text-[var(--rose)] font-bold text-sm hover:bg-[var(--soft)] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{X('מענה מחדש', 'Retake quiz')}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setQuizIdx(questions.length - 1)}
              className="inline-flex items-center gap-2 min-h-[46px] px-5 py-2.5 rounded-full border-2 border-[var(--rose)] text-[var(--rose)] font-bold cursor-pointer"
            >
              <PrevIcon className="w-4 h-4" />
              <span>{X('הקודם', 'Previous')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onSaveQuizResult(topIdx);
                onMarkToolDone(0);
                onGoToPractice();
              }}
              className="inline-flex items-center gap-2 min-h-[46px] px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white font-bold shadow-md cursor-pointer"
            >
              <span>{X('לתרגול הזוגי', 'To the couple practice')}</span>
              <NextIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }

    const currentQ = questions[quizIdx];
    return (
      <div className="space-y-4">
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-sm space-y-4">
          <p className="text-xs font-semibold text-[var(--mut)]">
            {X('איזו שפה פועלת בי?', 'Which language is working in me?')} ·{' '}
            {X(`שאלה ${quizIdx + 1} מתוך ${questions.length}`, `Question ${quizIdx + 1} of ${questions.length}`)}
          </p>
          <h3 className="text-xl font-bold leading-snug">{currentQ.q}</h3>
          <div className="space-y-2.5">
            {currentQ.o.map((optionText, optIdx) => {
              const selected = quizAnswers[quizIdx] === optIdx;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => {
                    const next = [...quizAnswers];
                    next[quizIdx] = optIdx;
                    setQuizAnswers(next);
                    if (quizIdx + 1 >= questions.length) {
                      const scores = [0, 0, 0];
                      next.forEach((a) => {
                        if (a >= 0 && a < 3) scores[a]++;
                      });
                      onSaveQuizResult(scores.indexOf(Math.max(...scores)));
                      onMarkToolDone(0);
                    }
                    setQuizIdx(quizIdx + 1);
                  }}
                  className={`w-full text-start rounded-2xl border-2 p-4 transition-colors cursor-pointer ${
                    selected
                      ? 'border-[var(--rose)] bg-[var(--soft)] font-semibold'
                      : 'border-[var(--line)] bg-[var(--card)] hover:border-[var(--rose)]'
                  }`}
                >
                  {optionText}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-[var(--mut)]">
            {X('עונים בכנות, בלי שיפוט – וכל אחד בנפרד.', 'Answer honestly, without judgment – each of you separately.')}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              if (quizIdx > 0) setQuizIdx(quizIdx - 1);
              else onGoToLesson();
            }}
            className="inline-flex items-center gap-2 min-h-[46px] px-5 py-2.5 rounded-full border-2 border-[var(--rose)] text-[var(--rose)] font-bold cursor-pointer"
          >
            <PrevIcon className="w-4 h-4" />
            <span>{X('הקודם', 'Previous')}</span>
          </button>
          <div />
        </div>
      </div>
    );
  }

  // ---------------- 2. PATTERN MATCH ----------------
  if (toolKind === 'match') {
    const items = content.MQ;
    if (matchIdx >= items.length) {
      const okCount = items.reduce(
        (acc, [, ans], i) => acc + (matchSelections[i] === ans ? 1 : 0),
        0,
      );
      return (
        <div className="space-y-4">
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 text-center shadow-sm space-y-3">
            <h3 className="font-editorial text-3xl font-extrabold text-[var(--rose)]">
              {X(`זיהיתם ${okCount} מתוך ${items.length} 🎯`, `You spotted ${okCount} of ${items.length} 🎯`)}
            </h3>
            <p className="text-base leading-relaxed">
              {X(
                'הדפוס הוא לא “מי אתה” – אלא “מה קורה לנו”. זכרו את המעגל: האשמה → הגנה → הסלמה → נסיגה → האשמה.',
                'A pattern isn’t “who you are” – it’s “what happens to us”. Remember the cycle: blame → defense → escalation → withdrawal → blame.',
              )}
            </p>
            <button
              type="button"
              onClick={() => {
                setMatchIdx(0);
                setMatchSelections({});
              }}
              className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 rounded-full border-2 border-[var(--rose)] text-[var(--rose)] font-bold text-sm hover:bg-[var(--soft)] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{X('תרגול מחדש', 'Try again')}</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setMatchIdx(items.length - 1)}
              className="inline-flex items-center gap-2 min-h-[46px] px-5 py-2.5 rounded-full border-2 border-[var(--rose)] text-[var(--rose)] font-bold cursor-pointer"
            >
              <PrevIcon className="w-4 h-4" />
              <span>{X('הקודם', 'Previous')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onMarkToolDone(1);
                onGoToPractice();
              }}
              className="inline-flex items-center gap-2 min-h-[46px] px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white font-bold shadow-md cursor-pointer"
            >
              <span>{X('לתרגול הזוגי', 'To the couple practice')}</span>
              <NextIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }

    const [prompt, correctIdx] = items[matchIdx];
    const selected = matchSelections[matchIdx];
    const hasAnswered = selected !== undefined;

    return (
      <div className="space-y-4">
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-sm space-y-4">
          <p className="text-xs font-semibold text-[var(--mut)]">
            {X('איזה דפוס זה?', 'Which pattern is this?')} ·{' '}
            {X(`${matchIdx + 1} מתוך ${items.length}`, `${matchIdx + 1} of ${items.length}`)}
          </p>
          <h3 className="text-xl font-bold leading-snug">{prompt}</h3>

          <div className="space-y-2.5">
            {content.PT.map((patternName, pIdx) => {
              let stateCls = 'border-[var(--line)] bg-[var(--card)] hover:border-[var(--rose)]';
              if (hasAnswered) {
                if (pIdx === correctIdx) {
                  stateCls = 'border-[var(--sage)] bg-emerald-500/15 font-bold';
                } else if (pIdx === selected) {
                  stateCls = 'border-rose-500 bg-rose-500/10 opacity-75';
                } else {
                  stateCls = 'border-[var(--line)] opacity-60';
                }
              }
              return (
                <button
                  key={pIdx}
                  type="button"
                  disabled={hasAnswered}
                  onClick={() =>
                    setMatchSelections((prev) => ({
                      ...prev,
                      [matchIdx]: pIdx,
                    }))
                  }
                  className={`w-full text-start rounded-2xl border-2 p-4 transition-colors cursor-pointer disabled:cursor-default ${stateCls}`}
                >
                  {patternName}
                </button>
              );
            })}
          </div>

          {hasAnswered && (
            <div className="rounded-2xl bg-[var(--soft)] p-4 text-sm leading-relaxed">
              <b>{X('מה באמת קורה:', 'What’s really happening:')}</b> {content.PTX[correctIdx]}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              if (matchIdx > 0) setMatchIdx(matchIdx - 1);
              else onGoToLesson();
            }}
            className="inline-flex items-center gap-2 min-h-[46px] px-5 py-2.5 rounded-full border-2 border-[var(--rose)] text-[var(--rose)] font-bold cursor-pointer"
          >
            <PrevIcon className="w-4 h-4" />
            <span>{X('הקודם', 'Previous')}</span>
          </button>

          {hasAnswered ? (
            <button
              type="button"
              onClick={() => {
                if (matchIdx + 1 >= items.length) {
                  onMarkToolDone(1);
                }
                setMatchIdx(matchIdx + 1);
              }}
              className="inline-flex items-center gap-2 min-h-[46px] px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white font-bold shadow-md cursor-pointer"
            >
              <span>{matchIdx + 1 >= items.length ? X('סיום הכלי', 'Finish tool') : X('הבא', 'Next')}</span>
              <NextIcon className="w-4 h-4" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }

  // ---------------- 3. SENTENCE BUILDERS (Modules 3 & 4) ----------------
  if (toolKind === 'build3' || toolKind === 'build4') {
    const cfg = content.BD[builderKey];
    const vals = builderVals[builderKey];
    const cleanTail = (s: string) => s.trim().replace(/[\s.,!?]+$/, '');
    const allFilled = vals.every((v) => v.trim().length > 2);
    const anyFilled = vals.some((v) => v.trim().length > 0);
    const separators = [', ', ', ', '. ', ''];

    const builtSentence = (() => {
      const trimmed = vals.map((v) => v.trim());
      const req = trimmed[3]
        ? /[.!?]$/.test(trimmed[3])
          ? trimmed[3]
          : `${trimmed[3]}.`
        : '';
      return trimmed.slice(0, 3).filter(Boolean).map(cleanTail).join(', ') + (req ? `. ${req}` : '.');
    })();

    return (
      <div className="space-y-5">
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-sm space-y-4">
          <p className="text-base font-medium">{cfg.h}</p>
          {cfg.f.map(([label, example], i) => (
            <div key={label} className="space-y-1.5">
              <label
                className="block text-sm font-extrabold"
                style={{ color: COLORS[i % COLORS.length] }}
              >
                {i + 1}. {label}
              </label>
              <textarea
                rows={2}
                value={vals[i]}
                placeholder={`${X('לדוגמה: ', 'e.g. ')}${example}`}
                onChange={(e) => {
                  const next = [...vals] as [string, string, string, string];
                  next[i] = e.target.value;
                  setBuilderVals((prev) => ({ ...prev, [builderKey]: next }));
                }}
                className="w-full rounded-xl border-2 border-[var(--line)] bg-[var(--card)] px-4 py-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--rose)]"
              />
            </div>
          ))}
        </div>

        {/* Prominent Result Sentence Box */}
        <div
          className={`rounded-3xl border-2 p-6 transition-all ${
            allFilled
              ? 'border-[var(--rose)] bg-gradient-to-br from-[var(--soft)] to-[var(--card)] shadow-lg'
              : 'border-[var(--rose2)]/60 bg-gradient-to-br from-[var(--soft)]/70 to-[var(--card)]'
          }`}
        >
          <div className="flex items-center gap-2 text-[var(--rose)] font-extrabold text-lg mb-3">
            <Sparkles className="w-5 h-5" />
            <span>{X('משפט התוצאה שלכם', 'Your result sentence')}</span>
          </div>

          <div className="min-h-[72px] text-xl sm:text-2xl font-semibold leading-loose">
            {anyFilled ? (
              <span>
                {vals.map((val, i) => {
                  const trimmed = val.trim();
                  return (
                    <React.Fragment key={i}>
                      {trimmed ? (
                        <span
                          className="border-b-[3px] px-0.5"
                          style={{ borderColor: COLORS[i] }}
                        >
                          {i < 3 ? cleanTail(trimmed) : trimmed}
                        </span>
                      ) : (
                        <span className="text-[var(--mut)] text-base">[{cfg.f[i][0]}]</span>
                      )}
                      {separators[i]}
                    </React.Fragment>
                  );
                })}
                {vals[3].trim() && !/[.!?]$/.test(vals[3].trim()) ? '.' : ''}
              </span>
            ) : (
              <span className="text-[var(--mut)] text-base font-normal">
                {X('המשפט המלא שלכם ייבנה כאן אוטומטית כשתמלאו את השדות…', 'Your full sentence will appear here as you fill in the fields…')}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              type="button"
              disabled={!allFilled}
              onClick={() => onCopyText(builtSentence)}
              className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white font-bold shadow-sm disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <Copy className="w-4 h-4" />
              <span>{X('העתקת המשפט', 'Copy sentence')}</span>
            </button>

            <a
              href={allFilled ? buildWhatsAppSendUrl(builtSentence, state.partner?.phone) : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!allFilled}
              onClick={(e) => {
                if (!allFilled) e.preventDefault();
              }}
              className={`inline-flex items-center gap-2 min-h-[44px] px-5 py-2 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold shadow-sm hover:opacity-95 transition-opacity ${
                !allFilled ? 'opacity-40 pointer-events-none' : ''
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{X('שלח לוואטסאפ בלחיצה', 'Send to WhatsApp')}</span>
            </a>
          </div>
        </div>

        {toolKind === 'build3' && (
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-sm space-y-3">
            <h3 className="text-lg font-bold">
              {X('משפטים שמפסיקים להזיק', 'Sentences that stop causing harm')}
            </h3>
            <p className="text-sm text-[var(--mut)]">
              {X('המרה משפת הישרדות לשפת בנייה', 'Converting survival language into building language')}
            </p>
            <div className="space-y-2.5">
              {content.CV.map(([bad, good], idx) => (
                <div key={idx} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
                  <div className="rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-300 line-through p-3">
                    {bad}
                  </div>
                  <span className="font-bold text-[var(--rose)]">{lang === 'he' ? '←' : '→'}</span>
                  <div className="rounded-xl bg-emerald-500/15 font-semibold p-3">
                    {good}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onGoToLesson}
            className="inline-flex items-center gap-2 min-h-[46px] px-5 py-2.5 rounded-full border-2 border-[var(--rose)] text-[var(--rose)] font-bold cursor-pointer"
          >
            <PrevIcon className="w-4 h-4" />
            <span>{X('הקודם', 'Previous')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onMarkToolDone(modIndex);
              onGoToPractice();
            }}
            className="inline-flex items-center gap-2 min-h-[46px] px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white font-bold shadow-md cursor-pointer"
          >
            <span>{X('סיימנו – לתרגול הזוגי', 'Done – to the couple practice')}</span>
            <NextIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ---------------- 4. MODULE 5 CLOSENESS CARDS (5 + 5 distinct pools + color swap) ----------------
  const nameA = partnerName(state, 0);
  const nameB = partnerName(state, 1);

  if (cardPos >= 10) {
    return (
      <div className="space-y-5">
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-8 text-center shadow-sm space-y-3">
          <h3 className="font-editorial text-3xl font-extrabold text-[var(--rose)]">
            🎉 {X('סיימתם! 5 קלפים ייחודיים לכל אחד', 'You did it! 5 unique cards each')}
          </h3>
          <p className="text-base">
            {X(
              `${nameA} שאל/ה 5 שאלות ייחודיות, ו-${nameB} שאל/ה 5 שאלות שונות לחלוטין – כעת ממשיכים לתרגול הזוגי.`,
              `${nameA} asked 5 unique questions, and ${nameB} asked 5 completely different ones – now on to the couple practice.`,
            )}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setCardPos(0);
              setSingleRoleOverride(null);
            }}
            className="inline-flex items-center gap-2 min-h-[46px] px-5 py-2.5 rounded-full border-2 border-[var(--rose)] text-[var(--rose)] font-bold cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{X('להתחיל שוב', 'Start again')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onMarkToolDone(4);
              onGoToPractice();
            }}
            className="inline-flex items-center gap-2 min-h-[46px] px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white font-bold shadow-md cursor-pointer"
          >
            <span>{X('לתרגול הזוגי', 'To the couple practice')}</span>
            <NextIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const askerIdx = cardPos < 5 ? 0 : 1;
  const answererIdx = 1 - askerIdx;
  const askerName = partnerName(state, askerIdx);
  const answererName = partnerName(state, answererIdx);
  const cardText = cardPos < 5 ? content.CD_A[cardPos] : content.CD_B[cardPos - 5];
  const activeColorRole: 'ask' | 'ans' =
    state.mode === 'remote'
      ? askerIdx === state.me
        ? 'ask'
        : 'ans'
      : singleRoleOverride ?? (askerIdx === 0 ? 'ask' : 'ans');

  return (
    <div className="space-y-4">
      {cardPos === 5 && (
        <div className="rounded-2xl border-2 border-[var(--gold)] bg-[var(--card)] p-4 text-center font-bold shadow-sm">
          🔄{' '}
          {X(
            `הושלמו 5 קלפים! התור עובר אוטומטית – עכשיו ${askerName} השואל/ת ו-${answererName} העונה`,
            `5 cards complete! Turn switches automatically – now ${askerName} asks and ${answererName} answers`,
          )}
        </div>
      )}

      {/* Clear Role Banner + Background Color Indicator */}
      <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)]/90 backdrop-blur p-4 text-center space-y-2.5">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-extrabold text-white ${
              activeColorRole === 'ask' ? 'bg-[var(--rose)]' : 'bg-[var(--sage)]'
            }`}
          >
            {activeColorRole === 'ask'
              ? X(`🎤 תפקיד: השואל/ת (${askerName})`, `🎤 Role: Asker (${askerName})`)
              : X(`💚 תפקיד: העונה (${answererName})`, `💚 Role: Answerer (${answererName})`)}
          </span>
        </div>

        <p className="text-sm font-semibold">
          {X(`${askerName} שואל/ת · ${answererName} עונה`, `${askerName} asks · ${answererName} answers`)}
        </p>

        {state.mode !== 'remote' && (
          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={() =>
                setSingleRoleOverride(activeColorRole === 'ask' ? 'ans' : 'ask')
              }
              className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-[var(--soft)] text-[var(--rose)] hover:opacity-90 transition-opacity cursor-pointer"
            >
              {X(
                'העבירו תפקיד בתצוגה (צבע שואל/ת ↔ צבע עונה)',
                'Switch role view color (Asker ↔ Answerer)',
              )}
            </button>
          </div>
        )}
      </div>

      {/* Closeness Question Card */}
      <div className="rounded-3xl border-2 border-[var(--rose2)] bg-gradient-to-br from-[var(--soft)] to-[var(--card)] p-8 min-h-[190px] flex flex-col items-center justify-center text-center shadow-md">
        <span className="text-xs font-bold text-[var(--mut)] mb-3">
          {X(
            `מאגר ייחודי של ${askerName} · קלף ${(cardPos % 5) + 1} מתוך 5 (סה״כ ${cardPos + 1} מתוך 10)`,
            `${askerName}’s unique deck · Card ${(cardPos % 5) + 1} of 5 (Total ${cardPos + 1} of 10)`,
          )}
        </span>
        <p className="font-editorial text-2xl sm:text-3xl font-bold leading-snug">{cardText}</p>
      </div>

      <p className="text-center text-xs text-[var(--mut)]">
        {X(
          'השואל/ת מקריא/ה, והעונה עונה בכנות. המקשיב/ה עונה רק: “שמעתי אותך” · “זה מובן לי” · “אני כאן איתך”.',
          'The asker reads aloud, and the answerer replies honestly. The listener responds only: “I hear you” · “I understand” · “I’m here with you”.',
        )}
      </p>

      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            if (cardPos === 0) {
              onGoToLesson();
            } else {
              setSingleRoleOverride(null);
              setCardPos(cardPos - 1);
            }
          }}
          className="inline-flex items-center gap-2 min-h-[46px] px-5 py-2.5 rounded-full border-2 border-[var(--rose)] text-[var(--rose)] font-bold cursor-pointer"
        >
          <PrevIcon className="w-4 h-4" />
          <span>{X('הקודם', 'Previous')}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const next = cardPos + 1;
            setSingleRoleOverride(null);
            if (next >= 10) {
              onMarkToolDone(4);
            }
            setCardPos(next);
          }}
          className="inline-flex items-center gap-2 min-h-[46px] px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white font-bold shadow-md cursor-pointer"
        >
          {cardPos === 9 ? (
            <>
              <Check className="w-4 h-4" />
              <span>{X('סיימנו', 'We’re done')}</span>
            </>
          ) : (
            <>
              <span>{X('הקלף הבא', 'Next card')}</span>
              <NextIcon className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
