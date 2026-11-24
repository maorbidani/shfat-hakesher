export type Lang = 'he' | 'en';
export type ViewState = 'splash' | 'login' | 'about' | 'map' | 'mod';
export type TabKey = 'L' | 'T' | 'P';
export type PlayMode = 'single' | 'remote' | null;
export type ThemeMode = 'auto' | 'light' | 'dark';

export interface LessonCard {
  h: string;
  g: string;
  p: string[];
}

export interface LessonFlow {
  h: string;
  st: string[];
  loop?: number;
}

export interface LessonData {
  idea: string;
  cards: LessonCard[];
  flow?: LessonFlow;
  note: string;
}

export interface PracticeStep {
  t: string;
  w: 'S' | 'L' | 'B';
  x: string;
  l: string[];
  s: number;
  f?: number;
  r2?: number;
}

export interface PracticeDef {
  n: string;
  rules: string[];
  prep?: string[];
  pre?: PracticeStep[];
  round: PracticeStep[];
  swap?: number;
  closing?: PracticeStep[];
}

export interface ModuleDef {
  t: string;
  s: string;
  ic: string;
  L?: LessonData;
  tool: 'quiz' | 'match' | 'build3' | 'build4' | 'cards' | 'prem';
  P: PracticeDef[];
}

export interface QuizQuestion {
  q: string;
  o: string[];
}

export interface BuilderDef {
  f: [string, string][];
  h: string;
}

export interface PremiumDeckData {
  rules: string[];
  q: string[];
  d: string[];
}

export interface LangContent {
  M: ModuleDef[];
  QZ: QuizQuestion[];
  QR: [string, string][];
  PT: string[];
  PTX: string[];
  MQ: [string, number][];
  BD: {
    build3: BuilderDef;
    build4: BuilderDef;
  };
  CV: [string, string][];
  CD_A: string[];
  CD_B: string[];
  DAILY: string[];
  GIFT_IDEAS: string[];
  PRM: PremiumDeckData;
}

export interface ChatMessage {
  id: string;
  from: number;
  name: string;
  text: string;
  ts: number;
}

export interface AlbumPhoto {
  id: string;
  dataUrl: string;
  caption: string;
  date: string;
}

export interface RoomDoc {
  host?: { name: string; phone: string };
  invited?: { name: string; phone: string };
  guest?: { name: string; phone: string } | null;
  status?: 'invited' | 'connected';
  paid?: { by: string; ts: number } | null;
  anniversary?: string;
  chat: ChatMessage[];
}

export interface AppState {
  names: [string, string];
  done: Record<number, Record<string, number>>;
  q: number | null;
  v: ViewState;
  m: number;
  tab: TabKey;
  lang: Lang;
  theme: ThemeMode;
  full: number;
  user: { name: string; phone: string; ok: number } | null;
  partner: { name: string; phone: string } | null;
  mode: PlayMode;
  room: string | null;
  me: number;
  status: string;
  aboutSeen: number;
  paidBy: string;
  seenTs: number;
  invite: string | null;
  anniversary: string;
  giftPlan: string;
  giftDone: boolean;
  competitionJoined: boolean;
  album: AlbumPhoto[];
  premOrder: number[] | null;
  premPos: number;
  dailyDrawnDate: string;
}
