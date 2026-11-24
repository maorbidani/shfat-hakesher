import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Flame, RotateCcw } from 'lucide-react';
import { AppState, Lang, PremiumDeckData } from '../types';
import { partnerName, shuffleIndices } from '../utils/storage';

interface PremiumDeckProps {
  lang: Lang;
  data: PremiumDeckData;
  state: AppState;
  onUpdateDeck: (order: number[], pos: number) => void;
  onFinish: () => void;
}

export const PremiumDeck: React.FC<PremiumDeckProps> = ({
  lang,
  data,
  state,
  onUpdateDeck,
  onFinish,
}) => {
  const X = (h: string, e: string) => (lang === 'he' ? h : e);
  const PrevIcon = lang === 'he' ? ArrowRight : ArrowLeft;
  const NextIcon = lang === 'he' ? ArrowLeft : ArrowRight;

  const numQuestions = data.q.length;
  const totalCards = numQuestions + data.d.length;

  const order =
    state.premOrder && state.premOrder.length === totalCards
      ? state.premOrder
      : null;
  const pos = Math.min(Math.max(0, state.premPos || 0), totalCards - 1);

  useEffect(() => {
    if (!order) {
      onUpdateDeck(shuffleIndices(totalCards), 0);
    }
  }, [order, totalCards, onUpdateDeck]);

  if (!order) return null;

  const cardIdx = order[pos];
  const isPrompt = cardIdx >= numQuestions;
  const cardText = isPrompt ? data.d[cardIdx - numQuestions] : data.q[cardIdx];
  const cardNumber = pos + 1;
  const isLast = cardNumber >= totalCards;

  const drawerName = partnerName(state, pos % 2);
  const partnerReceiverName = partnerName(state, 1 - (pos % 2));

  return (
    <div className="space-y-5 pb-6">
      <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 space-y-3 shadow-sm">
        <h3 className="text-lg font-bold flex items-center gap-2 text-[var(--gold)]">
          <Flame className="w-5 h-5" />
          <span>{X('חוקי המרחב האינטימי', 'Rules of the Intimate Space')}</span>
        </h3>
        <ul className="space-y-1.5 text-sm leading-relaxed">
          {data.rules.map((r, i) => (
            <li key={i}>
              {['💌', '🤍', '👂', '🌹'][i]} {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Active Turn Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="inline-block rounded-full bg-[var(--rose)] text-[#2b0b16] px-4 py-1 text-sm font-extrabold">
          {isPrompt
            ? X(`${drawerName} שולף/ת ומציע/ה`, `${drawerName} draws & proposes`)
            : X(`${drawerName} שולף/ת ושואל/ת`, `${drawerName} draws & asks`)}
        </span>
        <span className="inline-block rounded-full bg-[var(--sage)] text-white px-4 py-1 text-sm font-bold">
          {isPrompt
            ? X(`${partnerReceiverName} נענה/ית בחום`, `${partnerReceiverName} embraces`)
            : X(`${partnerReceiverName} עונה מהלב`, `${partnerReceiverName} answers`)}
        </span>
      </div>

      {/* Category Label: Intimacy Suggestions / Challenges (no "commands") */}
      <p className="text-center font-bold text-sm text-[var(--gold)]">
        {isPrompt
          ? X('💋 הצעות לקרבה / אתגר אינטימי', '💋 Intimacy Prompts / Challenges')
          : X('💌 שאלה מהלב', '💌 Question from the heart')}
      </p>

      {/* Main Card */}
      <div className="rounded-3xl border-2 border-[var(--gold)] bg-gradient-to-br from-[var(--soft)] to-[var(--card)] p-8 min-h-[200px] flex flex-col items-center justify-center text-center shadow-xl">
        <p className="font-editorial text-2xl sm:text-3xl font-bold leading-snug">
          {cardText}
        </p>
      </div>

      {/* Exact Counter 1 of 100 ... 100 of 100 */}
      <p className="text-center text-xl font-extrabold tabular-nums text-[var(--gold)]">
        {X(`${cardNumber} מתוך ${totalCards}`, `${cardNumber} of ${totalCards}`)}
      </p>

      {isLast && (
        <div className="rounded-2xl border border-[var(--gold)] bg-[var(--card)] p-4 text-center font-bold">
          🏁{' '}
          {X(
            `הגעתם לקלף ${totalCards} מתוך ${totalCards} – המשחק נעצר כאן. לחצו "סיום" או "להתחיל שוב".`,
            `You’ve reached card ${totalCards} of ${totalCards} – the round ends here. Press Finish or Start again.`,
          )}
        </div>
      )}

      {/* Navigation row: Previous on Right (RTL) / Left (LTR), Next on Left (RTL) / Right (LTR) */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          disabled={pos === 0}
          onClick={() => onUpdateDeck(order, Math.max(0, pos - 1))}
          className="inline-flex items-center gap-2 min-h-[46px] px-5 py-2.5 rounded-full border-2 border-[var(--gold)] text-[var(--gold)] font-bold disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
        >
          <PrevIcon className="w-4 h-4" />
          <span>{X('קלף קודם', 'Previous card')}</span>
        </button>

        {!isLast ? (
          <button
            type="button"
            onClick={() => onUpdateDeck(order, Math.min(totalCards - 1, pos + 1))}
            className="inline-flex items-center gap-2 min-h-[46px] px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-[#2b0b16] font-extrabold shadow-md cursor-pointer"
          >
            <span>{X('קלף הבא', 'Next card')} 🔥</span>
            <NextIcon className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onFinish}
            className="inline-flex items-center gap-2 min-h-[46px] px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-[#2b0b16] font-extrabold shadow-md cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{X('סיום', 'Finish')}</span>
          </button>
        )}
      </div>

      {/* Secondary row: Start Again & Finish */}
      <div className="flex items-center justify-center gap-3 flex-wrap pt-1">
        <button
          type="button"
          onClick={() => onUpdateDeck(shuffleIndices(totalCards), 0)}
          className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2 rounded-full border-2 border-[var(--gold)] text-[var(--gold)] font-bold text-sm hover:bg-[var(--soft)] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{X('להתחיל שוב', 'Start again')}</span>
        </button>

        {!isLast && (
          <button
            type="button"
            onClick={onFinish}
            className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2 rounded-full bg-[var(--soft)] text-[var(--gold)] font-bold text-sm border border-[var(--gold)]/40 hover:opacity-90 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{X('סיום', 'Finish')}</span>
          </button>
        )}
      </div>
    </div>
  );
};
