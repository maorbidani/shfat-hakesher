import { AppState, Lang, ModuleDef, RoomDoc } from '../types';

export const VERIFY_CODE = '1234'; // TEST ONLY. Connect Firebase Auth / Twilio Verify for live SMS.
export const ACCESS_CODE = '2026';
export const UNLOCK_PARAM = 'LOVE2026';
export const PAY_URL = ''; // Paste external checkout URL here when ready

export function detectDeviceLang(): Lang {
  try {
    const raw = (navigator.language || (navigator.languages && navigator.languages[0]) || 'he').toLowerCase();
    return raw.startsWith('he') || raw.startsWith('iw') ? 'he' : 'en';
  } catch {
    return 'he';
  }
}

export function freshState(lang?: Lang): AppState {
  return {
    names: ['', ''],
    done: {},
    q: null,
    v: 'splash',
    m: 0,
    tab: 'L',
    lang: lang ?? detectDeviceLang(),
    theme: 'auto',
    full: 0,
    user: null,
    partner: null,
    mode: null,
    room: null,
    me: 0,
    status: '',
    aboutSeen: 0,
    paidBy: '',
    seenTs: 0,
    invite: null,
    anniversary: '',
    giftPlan: '',
    giftDone: false,
    competitionJoined: false,
    album: [],
    premOrder: null,
    premPos: 0,
    dailyDrawnDate: '',
  };
}

const PERSIST_KEYS: (keyof AppState)[] = [
  'names',
  'done',
  'q',
  'lang',
  'theme',
  'full',
  'user',
  'mode',
  'room',
  'me',
  'status',
  'aboutSeen',
  'paidBy',
  'partner',
  'seenTs',
  'anniversary',
  'giftPlan',
  'giftDone',
  'competitionJoined',
  'album',
  'premOrder',
  'premPos',
  'dailyDrawnDate',
];

export function loadState(): AppState {
  const base = freshState();
  try {
    const raw = localStorage.getItem('shk');
    if (raw) {
      const parsed = JSON.parse(raw);
      PERSIST_KEYS.forEach((k) => {
        if (parsed[k] !== undefined && parsed[k] !== null) {
          // @ts-expect-error dynamic key restore
          base[k] = parsed[k];
        }
      });
    }
  } catch {
    // ignore storage errors
  }
  return base;
}

export function saveState(state: AppState): void {
  try {
    const out: Record<string, unknown> = {};
    PERSIST_KEYS.forEach((k) => {
      out[k] = state[k];
    });
    localStorage.setItem('shk', JSON.stringify(out));
  } catch {
    // ignore quota errors
  }
}

export function clearAllStorage(): void {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('shk')) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    // ignore
  }
}

export function urlParam(k: string): string | null {
  try {
    const fromSearch = new URLSearchParams(window.location.search).get(k);
    if (fromSearch) return fromSearch;
    const hashMatch = (window.location.hash || '')
      .slice(1)
      .match(new RegExp(`^${k}[-=]([A-Za-z0-9_-]+)$`));
    if (hashMatch) return hashMatch[1];
  } catch {
    // ignore
  }
  return null;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 8);
}

export function shuffleIndices(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function taskKeys(modIndex: number): string[] {
  return modIndex < 5 ? ['L', 'T', 'P'] : ['G'];
}

export function isTaskDone(state: AppState, modIndex: number, key: string): boolean {
  return Boolean(state.done[modIndex] && state.done[modIndex][key]);
}

export function isModuleFinished(state: AppState, modIndex: number): boolean {
  return taskKeys(modIndex).every((k) => isTaskDone(state, modIndex, k));
}

export function isModuleUnlocked(state: AppState, modIndex: number): boolean {
  return modIndex === 0 || (isModuleFinished(state, modIndex - 1) && Boolean(state.full));
}

export function totalCompletedTasks(state: AppState, modules: ModuleDef[]): number {
  return modules.reduce(
    (acc, _, idx) => acc + taskKeys(idx).filter((k) => isTaskDone(state, idx, k)).length,
    0,
  );
}

export const TOTAL_TASKS = 16;

export function partnerName(state: AppState, index: number): string {
  if (state.names[index]) return state.names[index];
  if (state.mode === 'remote' && index !== state.me) {
    return state.lang === 'he' ? 'בן/בת הזוג' : 'Your partner';
  }
  if (state.lang === 'he') {
    return index === 0 ? 'בן/בת זוג א׳' : 'בן/בת זוג ב׳';
  }
  return index === 0 ? 'Partner A' : 'Partner B';
}

export function buildInviteUrl(roomId: string): string {
  try {
    const url = new URL(window.location.href.split('#')[0]);
    url.searchParams.delete('unlock');
    url.searchParams.set('invite', roomId);
    return url.toString();
  } catch {
    return `?invite=${roomId}`;
  }
}

/* ============================================================================
   COUPLE SYNC ADAPTER (Firebase / Supabase Integration Hook)
   ----------------------------------------------------------------------------
   Currently persists each room in `localStorage` and broadcasts updates
   across tabs via `BroadcastChannel` + `window.storage`.
   To enable LIVE real-time sync between two separate phones/devices:
   Replace `RoomAdapter.read`, `RoomAdapter.write`, and `RoomAdapter.subscribe`:

   - Firebase Firestore:
       read(roomId)   -> getDoc(doc(db, 'rooms', roomId))
       write(roomId)  -> setDoc(doc(db, 'rooms', roomId), docData, { merge: true })
       subscribe(...) -> onSnapshot(doc(db, 'rooms', roomId), snap => cb(snap.data()))

   - Supabase Realtime:
       read(roomId)   -> supabase.from('rooms').select('data').eq('id', roomId).single()
       write(roomId)  -> supabase.from('rooms').upsert({ id: roomId, data: docData })
       subscribe(...) -> supabase.channel('room-' + roomId)
                           .on('postgres_changes', { event: '*', table: 'rooms', filter: `id=eq.${roomId}` },
                               payload => cb(payload.new.data))
                           .subscribe()
   ============================================================================ */
let channel: BroadcastChannel | null = null;
try {
  if (typeof BroadcastChannel !== 'undefined') {
    channel = new BroadcastChannel('shk_room_sync');
  }
} catch {
  channel = null;
}

export const RoomAdapter = {
  key: (roomId: string) => `shk_room_${roomId}`,

  read(roomId: string): RoomDoc | null {
    try {
      const raw = localStorage.getItem(RoomAdapter.key(roomId));
      return raw ? (JSON.parse(raw) as RoomDoc) : null;
    } catch {
      return null;
    }
  },

  write(roomId: string, docData: RoomDoc): void {
    try {
      localStorage.setItem(RoomAdapter.key(roomId), JSON.stringify(docData));
      channel?.postMessage({ roomId, data: docData });
    } catch {
      // ignore
    }
  },

  update(
    roomId: string,
    patch: Partial<RoomDoc>,
    newMessage?: RoomDoc['chat'][number],
  ): RoomDoc {
    const existing = RoomAdapter.read(roomId) || { chat: [] };
    const updated: RoomDoc = {
      ...existing,
      ...patch,
      chat: newMessage
        ? [...(existing.chat || []), newMessage].slice(-300)
        : existing.chat || [],
    };
    RoomAdapter.write(roomId, updated);
    return updated;
  },

  subscribe(roomId: string, onUpdate: (data: RoomDoc) => void): () => void {
    const onStorage = (e: StorageEvent) => {
      if (e.key === RoomAdapter.key(roomId) && e.newValue) {
        try {
          onUpdate(JSON.parse(e.newValue) as RoomDoc);
        } catch {
          // ignore
        }
      }
    };
    const onBroadcast = (e: MessageEvent) => {
      if (e.data && e.data.roomId === roomId && e.data.data) {
        onUpdate(e.data.data as RoomDoc);
      }
    };
    window.addEventListener('storage', onStorage);
    channel?.addEventListener('message', onBroadcast);
    return () => {
      window.removeEventListener('storage', onStorage);
      channel?.removeEventListener('message', onBroadcast);
    };
  },
};

export function compressImageFile(file: File, maxDim = 900, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = String(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function computeAnniversaryInfo(dateStr: string) {
  if (!dateStr) return null;
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let next = new Date(today.getFullYear(), parsed.getMonth(), parsed.getDate());
  if (next.getTime() < today.getTime()) {
    next = new Date(today.getFullYear() + 1, parsed.getMonth(), parsed.getDate());
  }
  const daysLeft = Math.round((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const yearsTogether = Math.max(0, next.getFullYear() - parsed.getFullYear());
  const daysMarried = Math.max(0, Math.round((today.getTime() - parsed.getTime()) / (1000 * 60 * 60 * 24)));
  const isToday = daysLeft === 0;
  return { daysLeft, yearsTogether, daysMarried, isToday };
}

export function playGentleChime(): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 660;
    gain.gain.value = 0.14;
    osc.start();
    osc.stop(ctx.currentTime + 0.65);
  } catch {
    // ignore audio block
  }
  try {
    navigator.vibrate?.([180, 90, 180]);
  } catch {
    // ignore
  }
}

export function downloadCertificatePng(
  nameA: string,
  nameB: string,
  lang: Lang,
  anniversary?: string,
): void {
  const canvas = document.createElement('canvas');
  canvas.width = 1400;
  canvas.height = 980;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Warm parchment & rose-gold background
  const bg = ctx.createLinearGradient(0, 0, 1400, 980);
  bg.addColorStop(0, '#fff9f3');
  bg.addColorStop(0.5, '#fdf1ea');
  bg.addColorStop(1, '#f8e4e0');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1400, 980);

  // Outer & inner ornate borders
  ctx.strokeStyle = '#d49a3a';
  ctx.lineWidth = 8;
  ctx.strokeRect(42, 42, 1316, 896);
  ctx.strokeStyle = '#c9566b';
  ctx.lineWidth = 2;
  ctx.strokeRect(58, 58, 1284, 864);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#d49a3a';
  ctx.font = '700 28px Heebo, Arial, sans-serif';
  ctx.fillText(
    lang === 'he' ? '✦ תעודת הוקרה זוגית ✦' : '✦ COUPLE CERTIFICATE OF APPRECIATION ✦',
    700,
    150,
  );

  ctx.fillStyle = '#3b2230';
  ctx.font = '800 56px "Frank Ruhl Libre", Heebo, serif';
  ctx.fillText(
    lang === 'he' ? 'שיטת שפת הקשר' : 'The Language of Connection',
    700,
    230,
  );

  ctx.fillStyle = '#7d6672';
  ctx.font = '400 26px Heebo, Arial, sans-serif';
  ctx.fillText(
    lang === 'he'
      ? 'מוענקת באהבה ובהוקרה רבה לזוג'
      : 'Presented with love and deep appreciation to',
    700,
    315,
  );

  ctx.fillStyle = '#c9566b';
  ctx.font = '800 66px "Frank Ruhl Libre", Heebo, serif';
  ctx.fillText(`${nameA}  ♥  ${nameB}`, 700, 415);

  ctx.fillStyle = '#3b2230';
  ctx.font = '400 28px Heebo, Arial, sans-serif';
  const bodyLines =
    lang === 'he'
      ? [
          'על השלמת המסע הזוגי בשפת הקשר,',
          'על הבחירה להקשיב בלי להאשים, לדבר מתוך אחריות,',
          'ולהמשיך לבחור בקרבה, ברוך ובבנייה משותפת בכל יום מחדש.',
        ]
      : [
          'For completing the Language of Connection couple’s journey,',
          'choosing to listen without blame, speak with responsibility,',
          'and nurture closeness, tenderness, and shared growth every day.',
        ];
  bodyLines.forEach((line, i) => {
    ctx.fillText(line, 700, 505 + i * 44);
  });

  if (anniversary) {
    ctx.fillStyle = '#d49a3a';
    ctx.font = '700 24px Heebo, Arial, sans-serif';
    ctx.fillText(
      lang === 'he' ? `תאריך מיוחד: ${anniversary}` : `Special Date: ${anniversary}`,
      700,
      670,
    );
  }

  // Seal
  ctx.beginPath();
  ctx.arc(700, 775, 52, 0, Math.PI * 2);
  ctx.fillStyle = '#c9566b';
  ctx.fill();
  ctx.strokeStyle = '#d49a3a';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = '#fff9f3';
  ctx.font = '700 26px Heebo, sans-serif';
  ctx.fillText('♥', 700, 785);

  ctx.fillStyle = '#3b2230';
  ctx.font = '700 24px Heebo, Arial, sans-serif';
  ctx.fillText(
    lang === 'he' ? 'מאור בידאני – מייסד שיטת שפת הקשר' : 'Maor Bidani – Founder of the Method',
    700,
    875,
  );

  const link = document.createElement('a');
  link.download = `shfat-hakesher-certificate.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
