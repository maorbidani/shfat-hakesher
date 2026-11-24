import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, HeartHandshake, Phone, ShieldCheck, User } from 'lucide-react';
import { Lang } from '../types';
import { VERIFY_CODE } from '../utils/storage';
import { LogoSvg } from './LogoSvg';

interface SplashViewProps {
  lang: Lang;
  onFinish: () => void;
}

export const SplashView: React.FC<SplashViewProps> = ({ lang, onFinish }) => {
  const X = (h: string, e: string) => (lang === 'he' ? h : e);

  return (
    <div
      onClick={onFinish}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onFinish()}
      className="relative min-h-[84vh] flex flex-col items-center justify-center text-center px-4 cursor-pointer select-none"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onFinish();
        }}
        className="absolute top-2 end-1 min-h-[36px] px-3.5 py-1 rounded-full border border-[var(--line)] bg-[var(--card)]/75 backdrop-blur-sm text-xs font-semibold text-[var(--mut)] hover:text-[var(--rose)] hover:border-[var(--rose)] transition-colors cursor-pointer"
      >
        {X('דלג', 'Skip')}
      </button>
      <LogoSvg size={220} animated idSuffix="splash" />
      <h1 className="splash-fade font-editorial text-4xl sm:text-6xl font-extrabold bg-gradient-to-br from-[var(--rose)] to-[var(--gold)] bg-clip-text text-transparent mt-3">
        {X('שפת הקשר', 'The Language of Connection')}
      </h1>
      <p className="splash-fade-sub text-lg text-[var(--mut)] mt-2">
        {X('כשיש שפה – יש קשר', 'When there is a language – there is a bond')}
      </p>
      <p className="splash-fade-sub text-xs text-[var(--mut)] mt-6 opacity-75">
        {X('מאת מאור בידאני', 'By Maor Bidani')}
      </p>
    </div>
  );
};

interface LoginViewProps {
  lang: Lang;
  hasInvite: boolean;
  initialName?: string;
  initialPhone?: string;
  onVerified: (name: string, phone: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  lang,
  hasInvite,
  initialName = '',
  initialPhone = '',
  onVerified,
}) => {
  const X = (h: string, e: string) => (lang === 'he' ? h : e);
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const digits = phone.replace(/\D/g, '');
    if (cleanName.length < 2) {
      setError(X('נא להזין שם פרטי', 'Please enter a first name'));
      return;
    }
    if (digits.length < 8) {
      setError(X('נא להזין מספר טלפון תקין', 'Please enter a valid phone number'));
      return;
    }
    setError('');
    setStep('code');
    // TODO: Integrate real SMS OTP provider (Firebase Phone Auth / Twilio Verify) here
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() !== VERIFY_CODE) {
      setError(X('הקוד שגוי, נסו שוב (קוד בדיקה: 1234)', 'Incorrect code, try again (test code: 1234)'));
      return;
    }
    setError('');
    onVerified(name.trim(), phone.trim());
  };

  return (
    <div className="max-w-md mx-auto pt-4 pb-8 text-center">
      <div className="flex justify-center">
        <LogoSvg size={115} animated={false} idSuffix="login" />
      </div>
      <h2 className="font-editorial text-3xl font-bold mt-2">
        {X('ברוכים הבאים לשפת הקשר', 'Welcome to The Language of Connection')}
      </h2>
      <p className="text-sm text-[var(--mut)] mt-1 mb-5">
        {X('מתחילים בחיבור אישי ואמיתי', 'Begin with a real, personal connection')}
      </p>

      {hasInvite && (
        <div className="rounded-2xl border border-[var(--rose2)] bg-gradient-to-br from-[var(--soft)] to-[var(--card)] p-4 mb-5 text-sm font-semibold">
          💌{' '}
          {X(
            'הוזמנתם להצטרף לחוויית זוגיות משותפת בשפת הקשר',
            'You’ve been invited to join a shared couple’s experience',
          )}
        </div>
      )}

      <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-sm text-start">
        {step === 'phone' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label htmlFor="auth-name" className="block text-sm font-bold text-[var(--rose)] mb-1.5">
                <span className="inline-flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {X('שם פרטי', 'First name')}
                </span>
              </label>
              <input
                id="auth-name"
                type="text"
                maxLength={24}
                autoComplete="given-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={X('השם שלך…', 'Your first name…')}
                className="w-full rounded-xl border-2 border-[var(--line)] bg-[var(--card)] px-4 py-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--rose)]"
              />
            </div>

            <div>
              <label htmlFor="auth-phone" className="block text-sm font-bold text-[var(--rose)] mb-1.5">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  {X('מספר טלפון', 'Phone number')}
                </span>
              </label>
              <input
                id="auth-phone"
                type="tel"
                dir="ltr"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="050-0000000"
                className="w-full rounded-xl border-2 border-[var(--line)] bg-[var(--card)] px-4 py-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--rose)]"
              />
            </div>

            {error && <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{error}</p>}

            <button
              type="submit"
              className="w-full min-h-[48px] rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white font-bold shadow-md hover:opacity-95 transition-opacity cursor-pointer"
            >
              {X('שלח קוד אימות', 'Send verification code')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--soft)] text-[var(--rose)] mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <p className="text-base">
              {X('שלחנו קוד אימות אל', 'We sent a verification code to')}{' '}
              <b dir="ltr">{phone}</b>
            </p>
            <p className="text-xs text-[var(--mut)]">
              {X(
                'לבדיקה כרגע: הזינו את הקוד 1234 לאימות מיידי.',
                'For testing: enter code 1234 to verify immediately.',
              )}
            </p>
            <input
              type="text"
              dir="ltr"
              inputMode="numeric"
              maxLength={4}
              autoFocus
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="••••"
              className="w-full rounded-xl border-2 border-[var(--line)] bg-[var(--card)] px-4 py-3 text-center text-3xl font-bold tracking-[0.4em] text-[var(--ink)] focus:outline-none focus:border-[var(--rose)]"
            />
            {error && <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{error}</p>}
            <button
              type="submit"
              className="w-full min-h-[48px] rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white font-bold shadow-md hover:opacity-95 transition-opacity cursor-pointer"
            >
              {X('אימות והמשך', 'Verify & continue')}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setError('');
              }}
              className="inline-flex items-center justify-center min-h-[40px] px-4 rounded-full bg-[var(--soft)] text-[var(--rose)] text-sm font-bold cursor-pointer"
            >
              {X('החלפת מספר', 'Change number')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

interface AboutViewProps {
  lang: Lang;
  onStartJourney: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ lang, onStartJourney }) => {
  const X = (h: string, e: string) => (lang === 'he' ? h : e);
  const NextIcon = lang === 'he' ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-4 pb-8">
      <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[var(--soft)] flex items-center justify-center text-[var(--rose)] shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold">
            {X('איך קמה שיטת שפת הקשר', 'How the Language of Connection began')}
          </h2>
        </div>

        <p className="text-[var(--ink)] leading-relaxed">
          {X(
            'זוגיות היא אחד הקשרים המשמעותיים והמורכבים בחיינו, ובכל זאת רוב הזוגות נכנסים אליה בלי ללמוד את הכלי המרכזי שמחזיק אותה לאורך זמן: התקשורת. רוב הקשיים בזוגיות אינם נובעים מחוסר אהבה, אלא משיח לא מודע – מילים שנאמרות מכאב ולא מאחריות, שתיקות שמחליפות שיחה, ותגובות אוטומטיות שמרחיקות במקום לקרב.',
            'A relationship is one of the most meaningful and complex bonds in our lives, yet most couples enter it without learning the central tool that sustains it over time: communication. Most difficulties in relationships don’t come from a lack of love, but from unconscious speech – words said from pain rather than responsibility, silences that replace conversation, and automatic reactions that push apart instead of bringing close.',
          )}
        </p>

        <p className="text-[var(--ink)] leading-relaxed">
          {X(
            'מתוך ההבנה הזו נולדה שיטת שפת הקשר: שיטה סדורה שמתייחסת לתקשורת הזוגית כאל שפה נרכשת של חיבור אמיתי מתוך עשייה ושיח מודע – לא ככישרון מולד ולא כעניין של אופי.',
            'From this understanding the Language of Connection method was born: a structured method treating couple communication as an acquired language of true connection through mindful action and dialogue – not an innate talent or a matter of personality.',
          )}
        </p>

        <div className="pt-2">
          <h3 className="text-lg font-bold mb-2">{X('מה מטרת השיטה?', 'The goal of the method')}</h3>
          <ul className="space-y-1.5 text-[var(--ink)] list-disc ps-5">
            <li>{X('ליצור מרחב בטוח בדיבור ובהקשבה', 'Create a safe space for speaking and listening')}</li>
            <li>{X('להתמודד עם קונפליקטים מבלי לפגוע בקשר', 'Face conflict without harming the relationship')}</li>
            <li>{X('לפתח שיח שמחזק קרבה, חשק ואמון מתוך עשייה משותפת', 'Develop dialogue and shared actions that strengthen closeness, desire, and trust')}</li>
            <li>{X('לבנות זוגיות שמחזיקה ופורחת לאורך זמן', 'Build a relationship that endures and flourishes')}</li>
          </ul>
        </div>

        <p className="text-sm text-[var(--mut)] pt-1">
          {X(
            'לא באמצעות שינוי בן או בת הזוג, אלא באמצעות שינוי השפה שביניהם.',
            'Not by changing your partner, but by transforming the language between you.',
          )}
        </p>
      </div>

      <div className="rounded-3xl border border-[var(--rose2)] bg-gradient-to-br from-[var(--soft)] to-[var(--card)] p-6 text-center text-lg font-semibold">
        {X(
          'כשיש שפה – יש קשר. וכשלומדים את שפת הקשר – הזוגיות מפסיקה לשרוד ומתחילה להיבנות.',
          'When there is a language – there is a bond. And when you learn the language of connection – the relationship stops surviving and starts building.',
        )}
      </div>

      <div className="text-center py-2">
        <p className="text-sm text-[var(--mut)]">{X('מייסד השיטה', 'Founder of the method')}</p>
        <p className="font-editorial text-2xl font-extrabold text-[var(--rose)] mt-0.5">
          {X('מאור בידאני', 'Maor Bidani')}
        </p>
      </div>

      {/* Navigation row: Next sits on the LEFT in Hebrew (RTL) and on the RIGHT in English (LTR) */}
      <div className="flex items-center justify-between pt-2">
        <div />
        <button
          type="button"
          onClick={onStartJourney}
          className="inline-flex items-center gap-2 min-h-[52px] px-7 py-3 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--rose2)] text-white text-lg font-bold shadow-lg hover:-translate-y-0.5 transition-transform cursor-pointer"
        >
          <span>{X('הבא – מתחילים במסע', 'Next – start the journey')}</span>
          <NextIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
