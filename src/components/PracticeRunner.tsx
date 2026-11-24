import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from 'lucide-react';
import { AppState, Lang, PracticeDef, PracticeStep } from '../types';
import { partnerName, playGentleChime } from '../utils/storage';

interface PracticeRunnerProps {
  lang: Lang;
  modIndex: number;
  practices: PracticeDef[];
  state: AppState;
  onBackToTool: () => void;
  onFinishPractice: () => void;
}

function flattenPractice(p: PracticeDef): PracticeStep[] {
  const clone = (s: PracticeStep): PracticeStep => ({ ...s });
  const pre = (p.pre || []).map(clone);
  const r1 = p.round.map(clone);
  const r2 = p.swap ? p.round.map((s) => ({ ...s, f: 1, r2: 1 })) : [];
  const closing = (p.closing || []).map(clone);
  return [...pre, ...r1, ...r2, ...closing];
}

export const PracticeRunner: React.FC<PracticeRunnerProps> = ({
  lang,
  practices,
  state,
  onBackToTool,
  onFinishPractice,
}) => {
  const X = (h: string, e: string) => (lang === 'he' ? h : e);
  const PrevIcon = lang === 'he' ? ArrowRight : ArrowLeft;
  const NextIcon = lang === 'he' ? ArrowLeft : ArrowRight;

  const [selectedIdx, setSelectedIdx] = useState<number | null>(
    practices.length === 1 ? 0 : null,
  );
  const [phase, setPhase] = useState<'setup' | 'step' | 'done'>('setup');
  const [firstSpeaker, setFirstSpeaker] = useState<0 | 1>(0);
  const [agreed, setAgreed] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);

  // Timer state
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const activePractice = selectedIdx !== null ? practices[selectedIdx] : null;
  const steps = useMemo(
    () => (activePractice ? flattenPractice(activePractice) : []),
    [activePractice],
  );
  const currentStep = steps[stepIdx];

  const stopTimer = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
  };

  useEffect(() => {
    stopTimer();
    if (phase === 'step' && currentStep) {
      setSecondsLeft(currentStep.s || 0);
    }
    return () => stopTimer();
  }, [phase, stepIdx, currentStep]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          playGentleChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);

  // Multi-practice picker (Module 3)
  if (selectedIdx === null || !activePractice) {
    return (
      <div className="space-y-4">
        <p className="font-semibold text-base">{X('בחרו תרגול:', 'Choose a practice:')}</p>
        <div className="space-y-3">
          {practices.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedIdx(idx);
                setPhase('setup');
                setAgreed(false);
                setStepIdx(0);
              }}
              className="w-full text-start rounded-2xl border-2 border-[var(--line)] bg-[var(--card)] p-4 font-bold hover:border-[var(--rose)] transition-colors cursor-pointer"
            >
              {p.n}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onBackToTool}
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

  // Setup screen
  if (phase === 'setup') {
    return (
      <div className="space-y-5">
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-sm space-y-4">
          <h3 className="text-xl font-bold">{activePractice.n}</h3>

          <div>
            <p className="font-bold text-sm mb-2">
              {X('כללי הבסיס – לקרוא לפני שמתחילים:', 'Ground rules – read before you start:')}
            </p>
            <ul className="space-y-1.5 text-sm">
              {activePractice.rules.map((r, i) => (
                <li key={i}>🛑 {r}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-bold text-sm mb-2">{X('מי מדבר ראשון?', 'Who speaks first?')}</p>
            <div className="grid grid-cols-2 gap-2.5">
              {[0, 1].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFirstSpeaker(idx as 0 | 1)}
                  className={`min-h-[44px] rounded-xl border-2 font-bold px-3 py-2 transition-colors cursor-pointer ${
                    firstSpeaker === idx
                      ? 'border-[var(--rose)] bg-[var(--soft)] text-[var(--rose)]'
                      : 'border-[var(--line)] bg-[var(--card)] text-[var(--ink)]'
                  }`}
                >
                  {partnerName(state, idx)}
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--mut)] mt-2">
              {X('בהמשך מחליפים תפקידים.', 'You’ll switch roles later.')}
            </p>
          </div>

          <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 accent-[var(--rose)] cursor-pointer"
            />
            <span className="text-sm font-medium">
              {X('קראנו את הכללים ומסכימים להם', 'We’ve read the rules and agree to them')}
            </span>
          </label>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              if (practices.length > 1) {
                setSelectedIdx(null);
              } else {
                onBackToTool();
              }
            }}
            className="inline-flex items-center gap-2 min-h-[46px] px-5 py-2.5 rounded-full border-2 border-[var(--rose)] text-[var(--rose)] font-bold cursor-pointer"
          >
            <PrevIcon className="w-4 h-4" />
            <span>{X('הקודם', 'Previous')}</span>
          </button>

          <button
            type="button"
            disabled={!agreed}
            onClick={() => {
              setStepIdx(0);
              setPhase('step');
            }}
            className="inline-flex items-center gap-2 min-h-[50px] px-7 py-2.5 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white text-lg font-bold shadow-md disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <span>{X('מתחילים 💗', 'Let’s begin 💗')}</span>
          </button>
        </div>
      </div>
    );
  }

  // Practice Completion screen
  if (phase === 'done') {
    return (
      <div className="space-y-5">
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-8 text-center shadow-sm space-y-3">
          <h3 className="font-editorial text-3xl font-extrabold text-[var(--rose)]">
            {X('🥂 כל הכבוד!', '🥂 Well done!')}
          </h3>
          <p className="text-base leading-relaxed">
            {X(
              'סיימתם את התרגול. עשיתם משהו שרוב הזוגות לא עושים: עצרתם להקשיב.',
              'You finished the practice. You did something most couples don’t: you stopped to listen.',
            )}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setStepIdx(Math.max(0, steps.length - 1));
              setPhase('step');
            }}
            className="inline-flex items-center gap-2 min-h-[46px] px-5 py-2.5 rounded-full border-2 border-[var(--rose)] text-[var(--rose)] font-bold cursor-pointer"
          >
            <PrevIcon className="w-4 h-4" />
            <span>{X('הקודם', 'Previous')}</span>
          </button>

          <button
            type="button"
            onClick={onFinishPractice}
            className="inline-flex items-center gap-2 min-h-[46px] px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white font-bold shadow-md cursor-pointer"
          >
            <span>{X('חזרה למפה – התחנה הבאה נפתחת', 'Back to the map – next station opens')}</span>
            <NextIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Active step
  const speakerIdx = firstSpeaker ^ (currentStep.f || 0);
  const listenerIdx = 1 - speakerIdx;
  const swappedJustNow =
    Boolean(currentStep.r2) && stepIdx > 0 && !steps[stepIdx - 1]?.r2;

  const formattedTime = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(
    secondsLeft % 60,
  ).padStart(2, '0')}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {steps.map((_, i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i <= stepIdx ? 'bg-[var(--rose)]' : 'bg-[var(--line)]'
            }`}
          />
        ))}
      </div>

      {swappedJustNow && (
        <div className="rounded-2xl border border-[var(--gold)] bg-[var(--soft)] p-3 text-center font-bold">
          🔄 {X('החליפו תפקידים!', 'Switch roles!')}
        </div>
      )}

      <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-sm space-y-4">
        <p className="text-xs font-semibold text-[var(--mut)]">
          {X(`שלב ${stepIdx + 1} מתוך ${steps.length}`, `Step ${stepIdx + 1} of ${steps.length}`)}
        </p>

        <h3 className="text-2xl font-bold">{currentStep.t}</h3>

        <div>
          {currentStep.w === 'S' && (
            <span className="inline-block rounded-full bg-[var(--rose)] text-white px-4 py-1 text-sm font-bold">
              {X('מדבר/ת:', 'Speaker:')} {partnerName(state, speakerIdx)}
            </span>
          )}
          {currentStep.w === 'L' && (
            <span className="inline-block rounded-full bg-[var(--sage)] text-white px-4 py-1 text-sm font-bold">
              {X('מקשיב/ה:', 'Listener:')} {partnerName(state, listenerIdx)}
            </span>
          )}
          {currentStep.w === 'B' && (
            <span className="inline-block rounded-full bg-[var(--gold)] text-white px-4 py-1 text-sm font-bold">
              {X('שניכם יחד', 'Both together')}
            </span>
          )}
        </div>

        {currentStep.x && <p className="text-base">{currentStep.x}</p>}

        {currentStep.l.length > 0 && (
          <div className="space-y-2">
            {currentStep.l.map((line, i) => (
              <div
                key={i}
                className="rounded-2xl bg-[var(--soft)] px-4 py-3 text-lg font-medium"
              >
                {line}
              </div>
            ))}
          </div>
        )}

        {currentStep.s > 0 && (
          <div className="text-center pt-3 space-y-3">
            <div
              dir="ltr"
              className="text-5xl font-extrabold text-[var(--rose)] tabular-nums"
            >
              {formattedTime}
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (running) {
                    stopTimer();
                  } else {
                    if (secondsLeft <= 0) setSecondsLeft(currentStep.s);
                    setRunning(true);
                  }
                }}
                className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white font-bold shadow-sm cursor-pointer"
              >
                {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>
                  {running
                    ? X('השהיה', 'Pause')
                    : secondsLeft === 0
                      ? X('הסתיים ✓', 'Done ✓')
                      : X('התחלה', 'Start')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopTimer();
                  setSecondsLeft(currentStep.s);
                }}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-full bg-[var(--soft)] text-[var(--rose)] font-bold text-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{X('איפוס', 'Reset')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            stopTimer();
            if (stepIdx > 0) {
              setStepIdx(stepIdx - 1);
            } else {
              setPhase('setup');
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
            stopTimer();
            if (stepIdx >= steps.length - 1) {
              setPhase('done');
            } else {
              setStepIdx(stepIdx + 1);
            }
          }}
          className="inline-flex items-center gap-2 min-h-[46px] px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white font-bold shadow-md cursor-pointer"
        >
          <span>
            {stepIdx >= steps.length - 1 ? X('סיום', 'Finish') : X('הבא', 'Next')}
          </span>
          {stepIdx < steps.length - 1 && <NextIcon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
