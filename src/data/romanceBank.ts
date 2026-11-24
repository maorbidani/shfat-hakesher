import { Lang } from '../types';

export type RomanceCategory =
  | 'all'
  | 'love'
  | 'appreciation'
  | 'praise'
  | 'longing'
  | 'passion'
  | 'connection';

export interface CategoryMeta {
  id: RomanceCategory;
  he: string;
  en: string;
  emoji: string;
}

export const ROMANCE_CATEGORIES: CategoryMeta[] = [
  { id: 'all', he: 'הכל (1,200+)', en: 'All (1,200+)', emoji: '✨' },
  { id: 'love', he: 'אהבה ורוך', en: 'Love & Tenderness', emoji: '❤️' },
  { id: 'appreciation', he: 'הערכה ותודה', en: 'Appreciation', emoji: '🙏' },
  { id: 'praise', he: 'פרגון והעצמה', en: 'Praise', emoji: '🌟' },
  { id: 'longing', he: 'געגוע', en: 'Longing', emoji: '💭' },
  { id: 'passion', he: 'תשוקה וחשק', en: 'Passion & Desire', emoji: '🔥' },
  { id: 'connection', he: 'חיזוק הקשר', en: 'Connection', emoji: '💞' },
];

interface MatrixBlock {
  openers: string[];
  cores: string[];
  closers: string[];
}

const HE_MATRICES: Record<Exclude<RomanceCategory, 'all'>, MatrixBlock> = {
  love: {
    openers: [
      'רק רציתי להזכיר לך באמצע היום',
      'כשאני חושב/ת עלייך עכשיו',
      'מכל הדברים הטובים בחיים שלי,',
      'בלי שום סיבה מיוחדת, רק מהלב:',
      'רציתי שתדע/י שברגע הזה ממש',
      'הדבר הכי חם שיש לי בלב הוא',
      'אפילו ביום הכי עמוס בעולם,',
    ],
    cores: [
      'שהאהבה שלי אליך רק גדלה ומעמיקה מיום ליום',
      'שאת/ה הבית האמיתי והשקט של הלב שלי',
      'שלצדך אני מרגיש/ה הכי בטוח/ה ואהוב/ה בעולם',
      'שמבט אחד שלך עדיין מצליח להמיס אותי לגמרי',
      'שלבחור בך מחדש זו ההחלטה הכי יפה בחיי',
      'שהנוכחות שלך מביאה אור ורוך לכל פינה אצלי',
    ],
    closers: [
      'אוהב/ת אותך יותר ממה שמילים יכולות לתאר ❤️',
      'שולח/ת לך חיבוק חם וענק מרחוק 🫂',
      'תודה שאת/ה שלי 💗',
      'מחכה כבר לרגע שנהיה יחד הערב ✨',
      'תמיד איתך, בלב ובמחשבה 💕',
    ],
  },
  appreciation: {
    openers: [
      'רציתי לעצור לרגע ולהגיד תודה ענקית',
      'אני לא לוקח/ת כמובן מאליו לרגע',
      'חשוב לי שתדע/י שאני רואה ומעריך/ה מאוד',
      'באמצע השגרה המהירה שלנו, רציתי להודות לך',
      'הלב שלי מלא בהכרת תודה על',
      'מגיעה לך היום מילה טובה מהלב על',
      'הסתכלתי עלינו היום והבנתי כמה אני מעריך/ה',
    ],
    cores: [
      'את כל ההשקעה והלב הרחב שלך בבית ובזוגיות שלנו',
      'את הדרך שבה את/ה מקשיב/ה לי באמת ומכיל/ה אותי',
      'את הדברים הקטנים שאת/ה עושה בשבילי בלי שאפילו אבקש',
      'את הסבלנות, הרוך והאכפתיות שאת/ה מביא/ה לקשר שלנו',
      'את העובדה שאפשר תמיד לסמוך עליך בעיניים עצומות',
      'את החיוך והחום שאת/ה מכניס/ה לחיים שלי כל יום',
    ],
    closers: [
      'אני בר/ת מזל שיש לי אותך בחיים 🌹',
      'מעריך/ה אותך עד השמיים ובחזרה 💛',
      'תודה על מי שאת/ה בשבילי 🙏',
      'הזוגיות איתך היא המתנה הכי גדולה שלי 🎁',
      'לא יכולתי לבקש שותף/ה טובה יותר למסע ❤️',
    ],
  },
  praise: {
    openers: [
      'רק שתדע/י שאני כל כך גאה בך:',
      'היום עצרתי להתפעל ממך –',
      'יש בך משהו מיוחד במינו:',
      'רציתי להזכיר לך כמה כוח ואור יש בך,',
      'בעיניי את/ה פשוט מדהים/ה,',
      'אין הרבה אנשים בעולם עם לב כמו שלך,',
      'מכל הלב, אני רוצה לפרגן לך על',
    ],
    cores: [
      'האופן שבו את/ה מתמודד/ת עם אתגרים באצילות ובשקט',
      'היכולת שלך להאיר כל חדר שאת/ה נכנס/ת אליו',
      'האומץ, הרגישות והחוכמה שיוצאים ממך בכל שיחה',
      'הדרך המרגשת שבה את/ה דואג/ת לאנשים שאת/ה אוהב/ת',
      'הקסם האישי והכישרון שיש בך בכל דבר שאת/ה נוגע/ת בו',
      'הנוכחות החזקה והחמה שלך שמרימה גם אותי למעלה',
    ],
    closers: [
      'מאמין/ה בך תמיד ומעריץ/ה אותך 🌟',
      'את/ה השראה אמיתית עבורי ✨',
      'שמח/ה כל כך ללכת לצדך בחיים 💫',
      'כל הכבוד לך – תמשיך/י לזרוח 💛',
      'מגיע לך את כל הטוב שבעולם 🌷',
    ],
  },
  longing: {
    openers: [
      'סופר/ת את השעות והדקות',
      'לא מצליח/ה להתרכז היום כי',
      'באמצע היום תפסתי את עצמי מחייך/ת –',
      'הייתי נותן/ת עכשיו הכול כדי',
      'עבר רק חצי יום וכבר',
      'כל דבר קטן שראיתי היום הזכיר לי',
      'חסר/ה לי עכשיו בטירוף',
    ],
    cores: [
      'לגעת בך, להריח אותך ולהרגיש אותך קרוב/ה אליי',
      'לשמוע את הקול שלך ולצלול לתוך החיבוק שלך',
      'כמה אני מתגעגע/ת לצחוק המשותף שלנו ולשקט שאיתך',
      'להסתכל לך בעיניים ולנשק אותך לאט בלי למהר',
      'המגע שלך שמרגיע לי את כל המחשבות ברגע אחד',
      'פשוט לשבת קרוב אליך, יד ביד, ולשכוח מכל העולם',
    ],
    closers: [
      'מתגעגע/ת אליך המון 💭❤️',
      'מחכה כבר שנפגשים ונחבק חזק 🫂',
      'את/ה כל הזמן במחשבות שלי 💓',
      'אי אפשר לחכות כבר לערב שלנו ✨',
      'בוא/י כבר הביתה לזרועות שלי 🌹',
    ],
  },
  passion: {
    openers: [
      'מחשבה קטנה ומדליקה שעברה לי בראש:',
      'בלילה שלנו היום בא לי',
      'אין לך מושג כמה את/ה מושך/ת אותי –',
      'נזכרתי עכשיו ברגע אינטימי שלנו ופתאום',
      'רק לחשוב על השפתיים והמגע שלך',
      'הסוד הקטן שלי להיום הוא',
      'מהרגע שהתעוררתי הבוקר',
    ],
    cores: [
      'עולה בי חשק עז להתקרב אליך לאט ולנשק אותך בלי סוף',
      'כל הגוף שלי מתמלא בחום ובסקרנות להיות לבד איתך',
      'בא לי שנעזוב הכול הערב ונתמסר לרגעים של תשוקה ורוך',
      'אני רוצה להעביר את הידיים שלי עלייך ולהרגיש את הדופק שלך',
      'את/ה עדיין מדליק/ה אותי בדיוק כמו בהתחלה, ואפילו יותר',
      'חולם/ת על נשיקה ארוכה ועמוקה שתעצור לנו את הזמן',
    ],
    closers: [
      'תתכונן/י לערב חם ומיוחד רק של שנינו 🔥',
      'שומר/ת לך את כל התשוקה ללילה 💋',
      'הלילה הזה שייך אך ורק לנו 🍷✨',
      'מחכה כבר להרגיש אותך קרוב קרוב 🔥❤️',
      'אל תתפלא/י אם אפתיע אותך בנשיקה בכניסה 😘',
    ],
  },
  connection: {
    openers: [
      'חשבתי עלינו היום ברוח “שפת הקשר”:',
      'בא לי שניקח הערב 10 דקות שקטות רק שלנו,',
      'הקשר שלנו הוא הדבר הכי יקר לי,',
      'בלי מסכים ובלי רעש מסביב –',
      'כשאנחנו מדברים מהלב ומקשיבים באמת,',
      'מבטיח/ה לך שהיום אשתדל יותר מתמיד',
      'רציתי להזמין אותך הערב לרגע של בנייה וקרבה:',
    ],
    cores: [
      'להקשיב לך בנוכחות מלאה, בלי לתקן ובלי למהר, רק להיות איתך',
      'כי אני מרגיש/ה שכשיש בינינו שפה בטוחה, אנחנו יכולים לעבור הכול',
      'שנדבר בכנות וברוך, נחבק חזק ונחזק את האמון שבינינו',
      'לראות את הצורך שלך מאחורי המילים ולהזכיר לך שאני בצד שלך',
      'לבחור בשיח שמקרב ומחבר, גם בימים עמוסים או מאתגרים',
      'לשתף אותך ברגש אמיתי אחד ולהקשיב למה שיושב לך על הלב',
    ],
    closers: [
      'אנחנו צוות מנצח ביחד 💞',
      'שמח/ה שאנחנו בונים את השפה שלנו כל יום מחדש 🌱',
      'איתך בקשר – בטוב ובמאתגר 🤝❤️',
      'מה דעתך על קפה שקט של שנינו הערב? ☕💗',
      'תודה שאת/ה בוחר/ת לבנות איתי קשר אמיתי 🕊️',
    ],
  },
};

const EN_MATRICES: Record<Exclude<RomanceCategory, 'all'>, MatrixBlock> = {
  love: {
    openers: [
      'Just wanted to remind you in the middle of the day',
      'Whenever I think of you right now,',
      'Out of all the good things in my life,',
      'For no special reason at all, straight from the heart:',
      'I want you to know at this exact moment',
      'The warmest truth inside my heart is',
      'Even on the busiest day imaginable,',
    ],
    cores: [
      'that my love for you keeps growing deeper every single day',
      'that you are the true, peaceful home of my heart',
      'that beside you I feel safer and more loved than anywhere else',
      'that a single look from you still melts me completely',
      'that choosing you again is the best decision of my life',
      'that your presence brings warmth and tenderness to every corner of my day',
    ],
    closers: [
      'I love you more than words can ever say ❤️',
      'Sending you a huge, warm hug from afar 🫂',
      'Thank you for being mine 💗',
      'Counting down until we’re together tonight ✨',
      'Always with you, in heart and mind 💕',
    ],
  },
  appreciation: {
    openers: [
      'I wanted to pause for a second and say a huge thank you',
      'I never take for granted for even a moment',
      'I want you to know how deeply I see and appreciate',
      'In the middle of our busy routine, I’m so grateful',
      'My heart is full of gratitude for',
      'You deserve a heartfelt thank-you today for',
      'Looking at us today, I realized how much I cherish',
    ],
    cores: [
      'all the care and generosity you pour into our home and relationship',
      'the way you truly listen to me and hold space for my heart',
      'all the quiet, thoughtful things you do without me even asking',
      'the patience, softness, and kindness you bring into our bond',
      'knowing I can always rely on you with my eyes closed',
      'the smile and warmth you bring into my life every single day',
    ],
    closers: [
      'I’m so lucky to walk through life with you 🌹',
      'I appreciate you to the moon and back 💛',
      'Thank you for who you are to me 🙏',
      'Being with you is my greatest gift 🎁',
      'I couldn’t ask for a better partner ❤️',
    ],
  },
  praise: {
    openers: [
      'Just so you know, I am so proud of you:',
      'I stopped today to admire you –',
      'There is something truly rare about you:',
      'I wanted to remind you how much light and strength you carry,',
      'In my eyes, you are genuinely extraordinary,',
      'There aren’t many people in this world with a heart like yours,',
      'From the bottom of my heart, I admire',
    ],
    cores: [
      'the grace and quiet strength you show when facing challenges',
      'the way you light up every single room you walk into',
      'the courage, sensitivity, and wisdom that shine through your words',
      'how deeply and thoughtfully you care for the people you love',
      'your unique charm and talent in everything you touch',
      'your warm, steady presence that lifts me higher too',
    ],
    closers: [
      'I believe in you always and admire you endlessly 🌟',
      'You are a true inspiration to me ✨',
      'So proud to walk beside you in life 💫',
      'Keep shining just the way you are 💛',
      'You deserve all the goodness in the world 🌷',
    ],
  },
  longing: {
    openers: [
      'Counting down the hours and minutes',
      'I can barely focus today because',
      'In the middle of the day I caught myself smiling –',
      'I would give anything right now just',
      'Only half the day has passed and already',
      'Every little thing I saw today reminded me',
      'I’m missing so badly right now',
    ],
    cores: [
      'to touch you, breathe you in, and feel you close to me',
      'to hear your voice and sink straight into your arms',
      'how much I miss our shared laughter and quiet peace together',
      'to look into your eyes and kiss you slowly without rushing',
      'your touch that calms every racing thought in an instant',
      'to simply sit close, hand in hand, and forget the whole world',
    ],
    closers: [
      'Missing you like crazy 💭❤️',
      'Can’t wait to hold you tight soon 🫂',
      'You’re on my mind nonstop 💓',
      'Can’t wait for our evening together ✨',
      'Hurry back into my arms 🌹',
    ],
  },
  passion: {
    openers: [
      'A little sparks-flying thought that crossed my mind:',
      'Tonight when we’re alone, I want',
      'You have no idea how irresistible you are to me –',
      'I just remembered an intimate moment of ours and suddenly',
      'Just thinking about your lips and your touch',
      'My little secret for today is',
      'From the moment I woke up this morning,',
    ],
    cores: [
      'I feel a fierce pull to move close slowly and kiss you endlessly',
      'my whole body fills with warmth and curiosity to be alone with you',
      'I want us to drop everything tonight and surrender to tenderness and desire',
      'I want to trace my hands along you and feel your heartbeat',
      'you still turn me on just like the very beginning, and even more',
      'I’m dreaming of one long, deep kiss that makes time stand still',
    ],
    closers: [
      'Get ready for a warm, unforgettable night just for the two of us 🔥',
      'Saving all my passion for tonight 💋',
      'Tonight belongs strictly to us 🍷✨',
      'Can’t wait to feel you close, so close 🔥❤️',
      'Don’t be surprised if I greet you with a kiss at the door 😘',
    ],
  },
  connection: {
    openers: [
      'Thinking about us today in the spirit of Connection Language:',
      'I’d love for us to take 10 quiet minutes tonight just for us,',
      'Our bond is the most precious thing I have,',
      'No screens and no outside noise –',
      'When we speak from the heart and truly listen,',
      'I promise to try harder than ever today',
      'I want to invite you tonight to a moment of building closeness:',
    ],
    cores: [
      'to listen to you with full presence, without fixing or rushing, just being with you',
      'because I know with a safe language between us, we can weather anything',
      'to speak honestly and gently, hug tight, and deepen the trust between us',
      'to hear the need behind your words and remind you I’m on your team',
      'to choose words that unite and soften us, even on busy or tough days',
      'to share one real feeling with you and listen to what’s on your heart',
    ],
    closers: [
      'We’re an unbeatable team together 💞',
      'So glad we’re building our shared language every day 🌱',
      'With you in this connection – through easy and hard alike 🤝❤️',
      'How about a quiet coffee for just the two of us tonight? ☕💗',
      'Thank you for choosing to build something real with me 🕊️',
    ],
  },
};

function buildCategoryPool(matrix: MatrixBlock): string[] {
  const pool: string[] = [];
  for (const opener of matrix.openers) {
    for (const core of matrix.cores) {
      for (const closer of matrix.closers) {
        pool.push(`${opener} ${core}. ${closer}`);
      }
    }
  }
  return pool;
}

const CACHE: Record<Lang, Record<RomanceCategory, string[]>> = {
  he: {} as Record<RomanceCategory, string[]>,
  en: {} as Record<RomanceCategory, string[]>,
};

export function getRomancePool(lang: Lang, category: RomanceCategory): string[] {
  const cached = CACHE[lang][category];
  if (cached) return cached;

  const src = lang === 'he' ? HE_MATRICES : EN_MATRICES;
  if (category === 'all') {
    const all: string[] = [];
    (Object.keys(src) as Exclude<RomanceCategory, 'all'>[]).forEach((cat) => {
      all.push(...getRomancePool(lang, cat));
    });
    CACHE[lang].all = all;
    return all;
  }

  const built = buildCategoryPool(src[category]);
  CACHE[lang][category] = built;
  return built;
}

export function getTotalRomanceCount(lang: Lang): number {
  return getRomancePool(lang, 'all').length; // 6 * (7 * 6 * 5) = 1,260 unique sentences!
}

export function buildWhatsAppSendUrl(text: string, partnerPhone?: string): string {
  let cleanDigits = (partnerPhone || '').replace(/\D/g, '');
  if (cleanDigits.startsWith('0')) {
    cleanDigits = `972${cleanDigits.slice(1)}`;
  }
  const encoded = encodeURIComponent(text);
  return cleanDigits.length >= 8
    ? `https://wa.me/${cleanDigits}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;
}
