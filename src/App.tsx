import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { CONTENT } from './data/content';
import { AlbumPhoto, AppState, Lang, RoomDoc, TabKey } from './types';
import {
  TOTAL_TASKS,
  UNLOCK_PARAM,
  RoomAdapter,
  clearAllStorage,
  freshState,
  isTaskDone,
  loadState,
  partnerName,
  saveState,
  totalCompletedTasks,
  uid,
  urlParam,
} from './utils/storage';
import { TopBar } from './components/TopBar';
import { AboutView, LoginView, SplashView } from './components/AuthViews';
import { MapView } from './components/MapView';
import { LessonView } from './components/LessonView';
import { ModuleTools } from './components/ModuleTools';
import { PracticeRunner } from './components/PracticeRunner';
import { PremiumDeck } from './components/PremiumDeck';
import { ChatDrawer } from './components/ChatDrawer';
import { ActiveModalType, Modals } from './components/Modals';

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const initial = loadState();
    const inv = urlParam('invite');
    if (inv && initial.room !== inv) {
      initial.invite = inv;
    }
    if ((urlParam('unlock') || '').toUpperCase() === UNLOCK_PARAM) {
      initial.full = 1;
    }
    return initial;
  });

  const [chatOpen, setChatOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [roleColor, setRoleColor] = useState<'ask' | 'ans' | null>(null);
  const [systemDark, setSystemDark] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false,
  );

  const toastTimerRef = useRef<number | null>(null);
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMsg(''), 2400);
  }, []);

  const content = CONTENT[state.lang];
  const X = useCallback(
    (h: string, e: string) => (state.lang === 'he' ? h : e),
    [state.lang],
  );

  // Smooth Auto-Scroll to the next unlocked station when returning to Map
  const scrollToNextStation = useCallback(() => {
    window.setTimeout(() => {
      const nextEl = document.querySelector('[data-next-station="true"]');
      if (nextEl) {
        nextEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 90);
  }, []);

  // Listen to OS color-scheme changes when theme === 'auto'
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  const isDarkResolved =
    state.theme === 'dark' || (state.theme === 'auto' && systemDark);

  // Persist state & update HTML attributes
  useEffect(() => {
    saveState(state);
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.classList.toggle('dark', isDarkResolved);
  }, [state, isDarkResolved]);

  useEffect(() => {
    const isWine = state.v === 'mod' && state.m === 5;
    document.body.classList.toggle('wine', isWine);
    document.body.classList.toggle(
      'role-ask',
      state.v === 'mod' && state.m === 4 && state.tab === 'T' && roleColor === 'ask',
    );
    document.body.classList.toggle(
      'role-ans',
      state.v === 'mod' && state.m === 4 && state.tab === 'T' && roleColor === 'ans',
    );
  }, [state.v, state.m, state.tab, roleColor]);

  // Splash 7-second timer (7000ms)
  const leaveSplash = useCallback(() => {
    setState((prev) => {
      if (prev.v !== 'splash') return prev;
      const logged = Boolean(prev.user?.ok);
      const nextView =
        prev.invite || !logged ? 'login' : prev.aboutSeen ? 'map' : 'about';
      return { ...prev, v: nextView };
    });
  }, []);

  useEffect(() => {
    if (state.v !== 'splash') return;
    const timer = window.setTimeout(leaveSplash, 7000);
    return () => window.clearTimeout(timer);
  }, [state.v, leaveSplash]);

  // Room sync subscription (for remote partner status, shared unlock, anniversary)
  const roomId = state.room || 'local';
  const applyRoomDoc = useCallback(
    (docData: RoomDoc, fromSelf = false) => {
      setState((prev) => {
        let changed = false;
        const next = { ...prev, names: [...prev.names] as [string, string] };
        if (
          prev.me === 1 &&
          docData.host?.name &&
          prev.names[0] !== docData.host.name
        ) {
          next.names[0] = docData.host.name;
          changed = true;
        }
        if (
          prev.me === 0 &&
          docData.guest?.name &&
          (prev.names[1] !== docData.guest.name ||
            prev.partner?.phone !== docData.guest.phone)
        ) {
          next.names[1] = docData.guest.name;
          next.partner = { name: docData.guest.name, phone: docData.guest.phone };
          changed = true;
        }
        if (
          prev.mode === 'remote' &&
          docData.status &&
          docData.status !== prev.status
        ) {
          next.status = docData.status;
          changed = true;
        }
        if (docData.paid && !prev.full) {
          next.full = 1;
          next.paidBy = docData.paid.by || '';
          changed = true;
          if (!fromSelf) {
            showToast(
              X('הגישה המלאה נפתחה לזוג 💎', 'Full access is now open for the couple 💎'),
            );
          }
        }
        if (docData.anniversary && docData.anniversary !== prev.anniversary) {
          next.anniversary = docData.anniversary;
          changed = true;
        }
        return changed ? next : prev;
      });
    },
    [X, showToast],
  );

  useEffect(() => {
    return RoomAdapter.subscribe(roomId, (docData) => applyRoomDoc(docData, false));
  }, [roomId, applyRoomDoc]);

  const completedCount = useMemo(
    () => totalCompletedTasks(state, content.M),
    [state, content.M],
  );
  const progressPct = useMemo(
    () => Math.round((completedCount / TOTAL_TASKS) * 100),
    [completedCount],
  );

  // Trigger smooth Auto-Scroll to next station whenever entering Map with progress
  const prevViewRef = useRef(state.v);
  useEffect(() => {
    if (state.v === 'map' && prevViewRef.current !== 'map' && completedCount > 0) {
      scrollToNextStation();
    }
    prevViewRef.current = state.v;
  }, [state.v, completedCount, scrollToNextStation]);

  const handleCopyText = useCallback(
    (txt: string) => {
      const ok = () => showToast(X('הועתק ✓', 'Copied ✓'));
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(txt).then(ok).catch(() => ok());
      } else {
        ok();
      }
    },
    [X, showToast],
  );

  const handleVerifiedLogin = (name: string, phone: string) => {
    setState((prev) => {
      const next: AppState = {
        ...prev,
        user: { name, phone, ok: 1 },
        names: [...prev.names] as [string, string],
      };
      if (prev.invite) {
        const room = prev.invite;
        const existing = RoomAdapter.read(room) || { chat: [] };
        next.room = room;
        next.me = 1;
        next.mode = 'remote';
        next.invite = null;
        next.names[1] = name;
        next.names[0] = existing.host?.name || '';
        next.status = 'connected';
        if (existing.paid) {
          next.full = 1;
          next.paidBy = existing.paid.by || '';
        }
        if (existing.anniversary) {
          next.anniversary = existing.anniversary;
        }
        const patch: Partial<RoomDoc> = {
          guest: { name, phone },
          status: 'connected',
        };
        if (!existing.paid && next.full) {
          patch.paid = { by: next.paidBy || name, ts: Date.now() };
        }
        RoomAdapter.update(room, patch);
      } else {
        next.me = 0;
        next.names[0] = name;
      }
      next.v = prev.aboutSeen ? 'map' : 'about';
      return next;
    });
    window.scrollTo(0, 0);
  };

  const handleMarkTask = (modIdx: number, key: string) => {
    setState((prev) => ({
      ...prev,
      done: {
        ...prev.done,
        [modIdx]: {
          ...(prev.done[modIdx] || {}),
          [key]: 1,
        },
      },
    }));
  };

  const handleFinishPractice = (modIdx: number) => {
    handleMarkTask(modIdx, 'P');
    setState((prev) => ({ ...prev, v: 'map' }));
    scrollToNextStation();
    if (modIdx === 0 && !state.full) {
      setActiveModal('pay');
    }
  };

  const handleFinishPremium = () => {
    const nextDone: Record<number, Record<string, number>> = {
      ...state.done,
      5: { ...(state.done[5] || {}), G: 1 },
    };
    setState((prev) => ({ ...prev, done: nextDone, v: 'map' }));
    const totalDone = content.M.reduce((acc, _, idx) => {
      const keys = idx < 5 ? ['L', 'T', 'P'] : ['G'];
      return acc + keys.filter((k) => Boolean(nextDone[idx]?.[k])).length;
    }, 0);
    if (totalDone === TOTAL_TASKS) {
      setActiveModal('finale');
    } else {
      scrollToNextStation();
    }
  };

  const handleFullReset = () => {
    clearAllStorage();
    const keepLang = state.lang;
    const keepTheme = state.theme;
    const resetState = freshState(keepLang);
    resetState.theme = keepTheme;
    resetState.v = 'login';
    setState(resetState);
    setChatOpen(false);
    setActiveModal(null);
    setRoleColor(null);
    window.scrollTo(0, 0);
  };

  const activeModule = content.M[state.m];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-3 pb-10 flex-1">
        {state.v !== 'splash' && (
          <TopBar
            lang={state.lang}
            theme={state.theme}
            isDarkResolved={isDarkResolved}
            view={state.v}
            progressPct={progressPct}
            isLoggedIn={Boolean(state.user?.ok)}
            unreadCount={0}
            onSetLang={(l: Lang) => setState((prev) => ({ ...prev, lang: l }))}
            onToggleTheme={() =>
              setState((prev) => ({
                ...prev,
                theme: isDarkResolved ? 'light' : 'dark',
              }))
            }
            onBack={() =>
              setState((prev) => ({
                ...prev,
                v: prev.v === 'map' ? 'about' : 'map',
              }))
            }
            onOpenChat={() => setChatOpen(true)}
            onOpenSettings={() => setActiveModal('settings')}
          />
        )}

        {state.v === 'splash' && <SplashView lang={state.lang} onFinish={leaveSplash} />}

        {state.v === 'login' && (
          <LoginView
            lang={state.lang}
            hasInvite={Boolean(state.invite)}
            initialName={state.user?.name || ''}
            initialPhone={state.user?.phone || ''}
            onVerified={handleVerifiedLogin}
          />
        )}

        {state.v === 'about' && (
          <AboutView
            lang={state.lang}
            onStartJourney={() => {
              setState((prev) => ({ ...prev, aboutSeen: 1, v: 'map' }));
              window.scrollTo(0, 0);
            }}
          />
        )}

        {state.v === 'map' && (
          <MapView
            lang={state.lang}
            modules={content.M}
            state={state}
            onSelectStation={(idx) => {
              setState((prev) => ({ ...prev, v: 'mod', m: idx, tab: 'L' }));
              window.scrollTo(0, 0);
            }}
            onOpenPay={() => setActiveModal('pay')}
            onOpenReset={() => setActiveModal('reset')}
            onOpenAnniversary={() => setActiveModal('anniversary')}
            onOpenDailyCard={() => setActiveModal('daily')}
            onOpenFinaleHub={() => setActiveModal('finale')}
            onSetupSingle={(pName) => {
              setState((prev) => ({
                ...prev,
                names: [prev.user?.name || '', pName],
                partner: { name: pName, phone: '' },
                mode: 'single',
                me: 0,
                room: null,
                status: '',
              }));
            }}
            onCreateInvite={(pName, pPhone) => {
              const newRoom = `r${uid()}`;
              const hostName = state.user?.name || '';
              const hostPhone = state.user?.phone || '';
              RoomAdapter.update(newRoom, {
                host: { name: hostName, phone: hostPhone },
                invited: { name: pName, phone: pPhone },
                guest: null,
                status: 'invited',
                paid: state.full
                  ? { by: state.paidBy || hostName, ts: Date.now() }
                  : null,
                anniversary: state.anniversary || undefined,
                chat: [],
              });
              setState((prev) => ({
                ...prev,
                room: newRoom,
                me: 0,
                mode: 'remote',
                names: [hostName, pName],
                partner: { name: pName, phone: pPhone },
                status: 'invited',
              }));
            }}
            onChangeMode={() => {
              setState((prev) => ({
                ...prev,
                mode: null,
                room: null,
                me: 0,
                status: '',
              }));
            }}
            onCopyText={handleCopyText}
          />
        )}

        {state.v === 'mod' && activeModule && (
          <div className="space-y-4">
            <h2 className="font-editorial text-2xl sm:text-3xl font-extrabold">
              {activeModule.ic}{' '}
              {state.m === 5
                ? activeModule.t
                : `${X('תחנה', 'Station')} ${state.m + 1}: ${activeModule.t}`}
            </h2>

            {state.m === 5 ? (
              <PremiumDeck
                lang={state.lang}
                data={content.PRM}
                state={state}
                onUpdateDeck={(order, pos) =>
                  setState((prev) => ({
                    ...prev,
                    premOrder: order,
                    premPos: pos,
                  }))
                }
                onFinish={handleFinishPremium}
              />
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2 sticky top-0 py-2 z-10 backdrop-blur-md">
                  {(
                    [
                      ['L', X('📖 לימוד', '📖 Learn')],
                      ['T', X('🛠 כלי', '🛠 Tool')],
                      ['P', X('💞 תרגול זוגי', '💞 Practice')],
                    ] as [TabKey, string][]
                  ).map(([tabKey, label]) => {
                    const active = state.tab === tabKey;
                    const done = isTaskDone(state, state.m, tabKey);
                    return (
                      <button
                        key={tabKey}
                        type="button"
                        onClick={() =>
                          setState((prev) => ({ ...prev, tab: tabKey }))
                        }
                        className={`min-h-[44px] rounded-2xl border-2 px-2 py-2 text-xs sm:text-sm font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                          active
                            ? 'border-[var(--rose)] bg-[var(--soft)] text-[var(--rose)]'
                            : 'border-[var(--line)] bg-[var(--card)] text-[var(--mut)]'
                        }`}
                      >
                        <span>{label}</span>
                        {done && <Check className="w-3.5 h-3.5 text-[var(--sage)] shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {state.tab === 'L' && activeModule.L && (
                  <LessonView
                    lang={state.lang}
                    lesson={activeModule.L}
                    onContinueToTool={() => {
                      handleMarkTask(state.m, 'L');
                      setState((prev) => ({ ...prev, tab: 'T' }));
                      window.scrollTo(0, 0);
                    }}
                  />
                )}

                {state.tab === 'T' && (
                  <ModuleTools
                    lang={state.lang}
                    modIndex={state.m}
                    content={content}
                    state={state}
                    onMarkToolDone={(idx) => handleMarkTask(idx, 'T')}
                    onSaveQuizResult={(res) =>
                      setState((prev) => ({ ...prev, q: res }))
                    }
                    onGoToLesson={() => {
                      setState((prev) => ({ ...prev, tab: 'L' }));
                      window.scrollTo(0, 0);
                    }}
                    onGoToPractice={() => {
                      setState((prev) => ({ ...prev, tab: 'P' }));
                      window.scrollTo(0, 0);
                    }}
                    onSendToChat={() => {}}
                    onCopyText={handleCopyText}
                    onRoleColorChange={setRoleColor}
                  />
                )}

                {state.tab === 'P' && (
                  <PracticeRunner
                    lang={state.lang}
                    modIndex={state.m}
                    practices={activeModule.P}
                    state={state}
                    onBackToTool={() => {
                      setState((prev) => ({ ...prev, tab: 'T' }));
                      window.scrollTo(0, 0);
                    }}
                    onFinishPractice={() => handleFinishPractice(state.m)}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom Copyright Footer */}
      {state.v !== 'splash' && (
        <footer className="text-center text-xs text-[var(--mut)] py-6 px-4 border-t border-[var(--line)]/50">
          {X(
            '© כל הזכויות שמורות למאור בידאני – שיטת שפת הקשר',
            '© All rights reserved to Maor Bidani – The Language of Connection method',
          )}
        </footer>
      )}

      {/* Direct WhatsApp Couple Hub */}
      <ChatDrawer
        open={chatOpen}
        lang={state.lang}
        state={state}
        onClose={() => setChatOpen(false)}
        onCopyText={handleCopyText}
      />

      {/* Modals */}
      <Modals
        activeModal={activeModal}
        lang={state.lang}
        content={content}
        state={state}
        onClose={() => {
          const closingPay = activeModal === 'pay';
          setActiveModal(null);
          if (closingPay && state.v === 'map') {
            scrollToNextStation();
          }
        }}
        onUnlockFull={(payerIdx) => {
          const payerName = partnerName(state, payerIdx);
          const updated = RoomAdapter.update(roomId, {
            paid: { by: payerName, ts: Date.now() },
          });
          applyRoomDoc(updated, true);
          setState((prev) => ({
            ...prev,
            full: 1,
            paidBy: payerName,
          }));
          setActiveModal(null);
          showToast(
            X('הגישה המלאה נפתחה לשני בני הזוג! 💎', 'Full access unlocked for both partners! 💎'),
          );
          if (state.v === 'map') {
            scrollToNextStation();
          }
        }}
        onOpenResetFromSettings={() => setActiveModal('reset')}
        onOpenPayFromSettings={() => setActiveModal('pay')}
        onConfirmFullReset={handleFullReset}
        onSaveAnniversary={(dateStr) => {
          setState((prev) => ({ ...prev, anniversary: dateStr }));
          RoomAdapter.update(roomId, { anniversary: dateStr });
          showToast(X('תאריך הנישואין נשמר 💍', 'Anniversary date saved 💍'));
        }}
        onSaveGift={(plan, done) => {
          setState((prev) => ({ ...prev, giftPlan: plan, giftDone: done }));
          showToast(X('המתנה הזוגית נשמרה 🎁', 'Our Gift saved 🎁'));
        }}
        onAddPhoto={(photo: AlbumPhoto) => {
          setState((prev) => ({ ...prev, album: [photo, ...prev.album] }));
          showToast(X('התמונה נוספה לאלבום הזוגי 📸', 'Photo added to Couple Album 📸'));
        }}
        onDeletePhoto={(id) => {
          setState((prev) => ({
            ...prev,
            album: prev.album.filter((p) => p.id !== id),
          }));
        }}
        onJoinCompetition={() => {
          setState((prev) => ({ ...prev, competitionJoined: true }));
          showToast(
            X('נרשמתם לתחרות הזוג הרומנטי 🏆', 'Entered Romantic Couple Competition 🏆'),
          );
        }}
      />

      {/* Toast Feedback */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 inset-x-0 mx-auto w-max max-w-[90vw] z-[60] rounded-full bg-[#3b2230] text-white px-5 py-2.5 text-sm font-bold shadow-xl"
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
}
