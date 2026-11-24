import { Lang } from '../types';

export interface DailyMissionItem {
  category: string;
  text: string;
}

interface MissionTemplate {
  categoryHe: string;
  categoryEn: string;
  heActions: string[];
  heContexts: string[];
  heClosers: string[];
  enActions: string[];
  enContexts: string[];
  enClosers: string[];
}

// 5 dimensions * 9 actions * 5 contexts * 2 closers = 450 distinct practical closeness missions per language!
const MISSION_TEMPLATES: MissionTemplate[] = [
  {
    categoryHe: 'מחווה קטנה מהלב',
    categoryEn: 'Small Heartfelt Gesture',
    heActions: [
      'הכינו לבן/בת הזוג משקה חם או פינוק קטן אהוב',
      'כתבו פתק אהבה קצר והחביאו אותו בתיק, בארנק או ליד הכרית',
      'שלחו באמצע היום הודעה קולית של 15 שניות עם חיוך ומילה חמה',
      'קחו על עצמכם היום מטלה אחת שבן/בת הזוג בדרך כלל עושים',
      'בחרו שיר שמזכיר לכם את שניכם ושלחו קישור להאזנה משותפת',
      'הפתיעו בכוס מים קרים או קפה בדיוק כשבן/בת הזוג מתיישבים לנוח',
      'הדליקו נר או הפעילו מוזיקה רכה בבית רבע שעה לפני שנפגשים',
      'שלחו תמונה משותפת ישנה שלכם וכתבו משפט על הזיכרון הזה',
      'הכינו הערב צלחת פירות או נשנוש קטן והגישו עם חיוך ועיניים אוהבות',
    ],
    heContexts: [
      'בלי לחכות לסיבה מיוחדת',
      'כדי לשבור את עומס השגרה',
      'מתוך בחירה מודעת להכניס רוך הביתה',
      'לפני שהערב הופך לעייף',
      'כמחווה שקטה שאומרת “ראיתי אותך היום”',
    ],
    heClosers: [
      'ושימו לב איך החיוך הקטן משנה את כל האווירה.',
      'בלי לצפות לתמורה – רק לתת מאהבה.',
    ],
    enActions: [
      'Make your partner their favorite warm drink or small treat',
      'Write a short love note and tuck it in their bag, wallet, or by their pillow',
      'Send a 15-second voice note midday with a warm smile and kind words',
      'Take care of one chore today that your partner usually handles',
      'Pick a song that reminds you of both of you and listen together',
      'Surprise them with fresh water or coffee right as they sit down to rest',
      'Light a candle or play soft music 15 minutes before you reunite tonight',
      'Send an old photo of the two of you with one line about why you love that memory',
      'Prepare a small bowl of fruit or snack tonight and serve it with warm eye contact',
    ],
    enContexts: [
      'without waiting for any special occasion',
      'to soften the weight of an ordinary weekday',
      'as a mindful choice to bring warmth home',
      'before the evening turns rushed or tired',
      'as a quiet gesture saying “I thought of you today”',
    ],
    enClosers: [
      'Notice how one small gesture shifts the whole atmosphere.',
      'Give freely with no expectation—just pure care.',
    ],
  },
  {
    categoryHe: 'הקשבה מודעת בשפת הקשר',
    categoryEn: 'Mindful Listening',
    heActions: [
      'הניחו את הטלפונים בחדר אחר למשך 15 דקות ושאלו “איך עבר עליך היום באמת?”',
      'הקשיבו היום 3 דקות רצופות לבן/בת הזוג בלי לקטוע, בלי לייעץ ובלי “אבל”',
      'סיימו שיחה היום במשפט: “שמעתי אותך, וזה ממש הגיוני שהרגשת ככה”',
      'שאלו הערב: “מה הכי העסיק או הכביד עלייך היום, ואיך אפשר להקל עליך?”',
      'שתפו רגש אמיתי אחד מהיום לפי הנוסחה: עובדה → רגש → משמעות → בקשה',
      'הסתכלו בעיניים בזמן שבן/בת הזוג מדברים והנהנו בנוכחות שקטה',
      'במקום לענות מיד על הערה קטנה, עצרו ל-5 שניות של נשימה ושאלו “מה חשוב לך כאן?”',
      'קבעו 10 דקות של “קפה בלי מסכים” לפני השינה לסיכום היום בנחת',
      'שאלו היום: “איזה רגע אחד היום גרם לך להרגיש טוב עם עצמך?”',
    ],
    heContexts: [
      'עם לב פתוח וללא שיפוטיות',
      'כדי ליצור מרחב בטוח לשיח',
      'בגישה של “אנחנו באותו צד”',
      'במהלך פסק זמן רגוע ביום',
      'מתוך סקרנות אמיתית להבין את עולמם',
    ],
    heClosers: [
      'זכרו: הקשבה אמיתית היא מתנת הקרבה הגדולה ביותר.',
      'אל תמהרו לתקן – פשוט היו שם יחד.',
    ],
    enActions: [
      'Put both phones in another room for 15 minutes and ask “How was your day really?”',
      'Listen for 3 uninterrupted minutes without fixing, advising, or saying “but”',
      'Close a conversation today with: “I hear you, and it makes complete sense you feel that way”',
      'Ask tonight: “What weighed on you most today, and how can I make it lighter?”',
      'Share one real feeling using the formula: Fact → Feeling → Meaning → Request',
      'Hold steady eye contact while your partner speaks with calm, quiet presence',
      'Before reacting to a sharp comment, pause for 5 breaths and ask “What matters most to you here?”',
      'Schedule 10 screen-free minutes over tea or coffee before bed to unwind together',
      'Ask today: “What was one moment today that made you feel proud or happy?”',
    ],
    enContexts: [
      'with an open heart and zero judgment',
      'to build a safe space for real dialogue',
      'from an “us on the same team” mindset',
      'during a calm pause in your day',
      'out of genuine curiosity for their inner world',
    ],
    enClosers: [
      'Remember: true listening is the deepest gift of intimacy.',
      'Don’t rush to fix—just be present together.',
    ],
  },
  {
    categoryHe: 'מגע רך ונוכחות פיזית',
    categoryEn: 'Warm Touch & Presence',
    heActions: [
      'תנו חיבוק איטי ועמוק של לפחות 20 שניות שלמות, בלי למהר לשחרר',
      'הציעו עיסוי רך של 5 דקות בכתפיים, בעורף או בכפות הידיים',
      'החזיקו ידיים בהליכה קצרה או בישיבה משותפת על הספה הערב',
      'נשקו את בן/בת הזוג במצח או בלחיים בנחת עם מבט עמוק בעיניים',
      'הניחו ראש אחד על השנייה למשך שתי דקות של נשימה משותפת בשקט',
      'לטפו בעדינות את השיער או הגב של בן/בת הזוג לפני שנרדמים הלילה',
      'עצרו במטבח או בסלון לריקוד איטי של שיר אחד, רק שניכם',
      'פתחו את הפגישה הבאה בבית בנשיקה איטית של 6 שניות לפני שמתחילים לדבר על סידורים',
      'שבו צמודים זה לזה הערב ושימו לב לדופק ולנשימה הרגועה יחד',
    ],
    heContexts: [
      'כדי להרגיע את מערכת העצבים של שניכם',
      'במגע רך שמביע אהבה ללא מילים',
      'בסוף יום עמוס כדי להתחבר מחדש',
      'ברגע שקט של קרבה ביתית',
      'כמגע מכוון ומלא תשומת לב',
    ],
    heClosers: [
      'מגע איטי מחזיר מיד תחושת בית וביטחון.',
      'תנו לגוף לדבר את שפת הקשר.',
    ],
    enActions: [
      'Share a slow, full-bodied hug for at least 20 whole seconds without pulling away',
      'Offer a gentle 5-minute shoulder, neck, or hand massage tonight',
      'Hold hands during a short walk or while sitting together on the couch',
      'Give a slow, tender kiss on the forehead or cheek with lingering eye contact',
      'Rest your head against your partner for two minutes of quiet synchronized breathing',
      'Gently stroke their hair or back before drifting off to sleep tonight',
      'Pause in the kitchen or living room for one slow dance to a single song',
      'Greet each other at home with a 6-second kiss before mentioning chores or logistics',
      'Sit close side by side tonight and match your breathing calmly together',
    ],
    enContexts: [
      'to soothe both of your nervous systems',
      'through tender touch that speaks louder than words',
      'at the end of a busy day to reconnect',
      'during a quiet moment of closeness at home',
      'with intentional, undivided warmth',
    ],
    enClosers: [
      'Slow touch immediately restores safety and home.',
      'Let warmth and presence speak the language of connection.',
    ],
  },
  {
    categoryHe: 'הערכה, תודה ופרגון',
    categoryEn: 'Appreciation & Praise',
    heActions: [
      'אמרו לבן/בת הזוג תודה מפורטת על דבר אחד ספציפי שעשו השבוע',
      'שלחו מחמאה כנה על המראה, החיוך או האנרגיה שלהם היום',
      'ספרו לבן/בת הזוג על רגע מהשבוע שבו הייתם גאים בהם במיוחד',
      'השלימו בקול רם מולם: “אני ממש מעריך/ה אצלך ש…”',
      'שתפו שלושה דברים טובים שראיתם בבן/בת הזוג ב-48 השעות האחרונות',
      'הודו לבן/בת הזוג מול הילדים, חברים או בהודעה פרטית על מאמץ קטן שעשו',
      'אמרו הערב: “החיים שלי יפים ושלווים יותר בזכותך כי…”',
      'הזכירו תכונה אחת שבגללה התאהבתם בהם לראשונה ושעדיין מרגשת אתכם',
      'כתבו 3 מילים שמסכמות מה בן/בת הזוג מהווים עבורכם ושלחו להם עכשיו',
    ],
    heContexts: [
      'בקול חם, ברור ומכל הלב',
      'בלי למהר לעבור לנושא הבא',
      'כדי להאיר את הטוב שכבר קיים ביניכם',
      'במילים מדויקות שנותנות תחושת ערך',
      'כהוקרה יומיומית שמזינה את האהבה',
    ],
    heClosers: [
      'מילה טובה בזמן הנכון נשארת בלב ימים שלמים.',
      'הכרת תודה היא הדלק של זוגיות פורחת.',
    ],
    enActions: [
      'Thank your partner specifically for one thoughtful thing they did this week',
      'Give a sincere compliment about how they look, smile, or carry themselves today',
      'Tell your partner about a moment this week when you felt deeply proud of them',
      'Say aloud face-to-face: “Something I truly appreciate about you is…”',
      'Share three good things you noticed about your partner in the last 48 hours',
      'Acknowledge a quiet effort they made that usually goes unnoticed',
      'Say tonight: “My life feels brighter and calmer with you because…”',
      'Remind them of one quality you fell in love with that still moves you today',
      'Write 3 words describing what your partner means to you and share them right now',
    ],
    enContexts: [
      'in a warm, steady, heartfelt voice',
      'without rushing on to the next topic',
      'to spotlight the goodness already alive between you',
      'with specific words that make them feel truly seen',
      'as daily gratitude that nourishes love',
    ],
    enClosers: [
      'A sincere compliment stays warm in the heart for days.',
      'Appreciation is the fuel of a flourishing bond.',
    ],
  },
  {
    categoryHe: 'הפתעה ודייט יומיומי',
    categoryEn: 'Everyday Surprise & Date',
    heActions: [
      'תכננו “מיני דייט” של 20 דקות הערב: סידור סלון, שתייה קרה ושיחה קרובה',
      'הזמינו את בן/בת הזוג להליכה קצרה של ערב בשכונה יד ביד',
      'בחרו קלף אחד מתוך שלב 6 ושחקו בו הערב במצב רוח סקרני ורך',
      'הפתיעו בהצעה רומנטית קטנה לסוף השבוע – בלי להוציא כסף',
      'שאלו: “איזה חלום קטן לשנה הקרובה נוכל להתחיל להגשים יחד השבוע?”',
      'הקדישו 10 דקות לצחוק משותף – סרטון מצחיק, זיכרון ישן או משחק קצר',
      'הכינו תפאורה קטנה בבית: תאורה עמומה, כיבוי טלוויזיה ומוזיקת רקע נעימה',
      'סכמו יחד הערב על הרגל זוגי קטן שתרצו לאמץ לשבוע הקרוב',
      'שלחו הזמנה משעשעת ורומנטית לפגישה של שניכם היום בשעה 21:00 בסלון',
    ],
    heContexts: [
      'כדי לשמור על ניצוץ של חיזור גם בתוך החיים',
      'ביוזמה פשוטה שלא דורשת תכנון מסובך',
      'ביצירתיות שמזכירה שאתם עדיין בדייט',
      'באווירה קלילה, מזמינה ורומנטית',
      'כדי לייצר זיכרון קטן וטוב מהיום',
    ],
    heClosers: [
      'חיזור יומיומי שומר על האהבה חיה וסקרנית.',
      'רגעים קטנים של יוזמה בונים קשר גדול.',
    ],
    enActions: [
      'Plan a 20-minute “mini date” tonight: tidy corner, drinks, and close conversation',
      'Invite your partner for a short evening stroll around the block hand in hand',
      'Draw one card from Stage 6 tonight with a curious, tender mood',
      'Suggest one small zero-cost romantic plan for this coming weekend',
      'Ask: “What small dream for this year can we take one tiny step toward this week?”',
      'Spend 10 minutes laughing together over a favorite memory or playful story',
      'Set a soft scene at home: dimmed lights, TV off, and gentle background music',
      'Agree tonight on one tiny loving habit to practice together this week',
      'Send a playful, romantic invitation for a 9:00 PM date in your living room tonight',
    ],
    enContexts: [
      'to keep the spark of courtship alive inside daily life',
      'with a simple initiative requiring zero complicated prep',
      'with playful creativity that reminds you you’re still dating',
      'in a warm, lighthearted, inviting atmosphere',
      'to create one sweet new memory out of an ordinary day',
    ],
    enClosers: [
      'Everyday courtship keeps love vivid and curious.',
      'Small moments of initiative build a lasting bond.',
    ],
  },
];

const DAILY_CACHE: Record<Lang, DailyMissionItem[]> = { he: [], en: [] };

export function getDailyMissionsPool(lang: Lang): DailyMissionItem[] {
  if (DAILY_CACHE[lang].length > 0) return DAILY_CACHE[lang];

  const pool: DailyMissionItem[] = [];
  for (const tpl of MISSION_TEMPLATES) {
    const actions = lang === 'he' ? tpl.heActions : tpl.enActions;
    const contexts = lang === 'he' ? tpl.heContexts : tpl.enContexts;
    const closers = lang === 'he' ? tpl.heClosers : tpl.enClosers;
    const category = lang === 'he' ? tpl.categoryHe : tpl.categoryEn;

    for (const action of actions) {
      for (const context of contexts) {
        for (const closer of closers) {
          pool.push({
            category,
            text: `${action} – ${context}. ${closer}`,
          });
        }
      }
    }
  }

  DAILY_CACHE[lang] = pool; // 5 * 9 * 5 * 2 = 450 distinct missions!
  return pool;
}

export function getMissionForDate(lang: Lang, offset = 0): DailyMissionItem {
  const pool = getDailyMissionsPool(lang);
  const todayStr = new Date().toISOString().slice(0, 10);
  // Deterministic date hash
  let hash = 0;
  for (let i = 0; i < todayStr.length; i++) {
    hash = (hash * 31 + todayStr.charCodeAt(i)) >>> 0;
  }
  const idx = (hash + offset * 37) % pool.length;
  return pool[idx];
}
