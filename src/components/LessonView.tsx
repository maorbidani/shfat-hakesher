import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { COLORS } from '../data/content';
import { Lang, LessonData } from '../types';

interface LessonViewProps {
  lang: Lang;
  lesson: LessonData;
  onContinueToTool: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lang,
  lesson,
  onContinueToTool,
}) => {
  const X = (h: string, e: string) => (lang === 'he' ? h : e);
  const NextIcon = lang === 'he' ? ArrowLeft : ArrowRight;
  const flowArrow = lang === 'he' ? '←' : '→';

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-[var(--rose2)] bg-gradient-to-br from-[var(--soft)] to-[var(--card)] p-6 text-center text-lg sm:text-xl font-semibold shadow-sm">
        {lesson.idea}
      </div>

      {lesson.flow && (
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-sm text-center space-y-3">
          <h3 className="text-lg font-bold">{lesson.flow.h}</h3>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {lesson.flow.st.map((stepName, i) => (
              <React.Fragment key={stepName}>
                {i > 0 && (
                  <span className="text-[var(--rose)] font-extrabold">{flowArrow}</span>
                )}
                <span className="rounded-full border-2 border-[var(--rose2)] bg-[var(--soft)] px-4 py-1.5 text-sm font-bold">
                  {stepName}
                </span>
              </React.Fragment>
            ))}
            {lesson.flow.loop ? (
              <span className="text-[var(--rose)] font-extrabold text-lg">↺</span>
            ) : null}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {lesson.cards.map((card, i) => (
          <div
            key={i}
            className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-sm"
            style={{ borderTopWidth: '6px', borderTopColor: COLORS[i % COLORS.length] }}
          >
            <h3 className="text-lg font-bold">{card.h}</h3>
            {card.g && (
              <p
                className="text-sm font-bold mt-0.5 mb-2"
                style={{ color: COLORS[i % COLORS.length] }}
              >
                {card.g}
              </p>
            )}
            <ul className="list-disc ps-5 space-y-1 text-sm sm:text-base mt-2">
              {card.p.map((pt, j) => (
                <li key={j}>{pt}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 text-sm sm:text-base leading-relaxed shadow-sm">
        {lesson.note}
      </div>

      {/* Next placed on LEFT in Hebrew (RTL) and RIGHT in English (LTR) */}
      <div className="flex items-center justify-between pt-2">
        <div />
        <button
          type="button"
          onClick={onContinueToTool}
          className="inline-flex items-center gap-2 min-h-[48px] px-7 py-2.5 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white font-bold shadow-md hover:-translate-y-0.5 transition-transform cursor-pointer"
        >
          <span>{X('הבנו – ממשיכים לכלי', 'Got it – on to the tool')}</span>
          <NextIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
