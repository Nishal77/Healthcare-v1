// ─── Content data for the Learn screen ────────────────────────────────────────
// All Ayurveda · Yoga · Wellness content is defined here.
// Replace iconName with a real asset path when media is ready.

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface YogaLesson {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  level: DifficultyLevel;
  category: string;
  iconName: string;
}

export interface HomeRemedy {
  id: string;
  symptom: string;
  title: string;
  description: string;
  iconName: string;
}

export interface AyurvedaTip {
  id: string;
  category: string;
  title: string;
  body: string;
  iconName: string;
}

// ─── Featured lesson (hero card) ──────────────────────────────────────────────
export const FEATURED_LESSON = {
  tag: 'Featured · Today',
  title: 'Morning Pranayama for Inner Balance',
  instructor: 'Vaidya Ramesh Kumar',
  duration: '12 min',
  level: 'Beginner' as DifficultyLevel,
  description:
    'Begin your day with conscious breathwork rooted in ancient Ayurvedic tradition. Calm the mind, energise the body.',
  iconName: 'leaf-outline',
};

// ─── Yoga & Pranayama lessons ──────────────────────────────────────────────────
export const YOGA_LESSONS: YogaLesson[] = [
  {
    id: 'y1',
    title: 'Surya Namaskar',
    instructor: 'Priya Sharma',
    duration: '20 min',
    level: 'Beginner',
    category: 'Morning Flow',
    iconName: 'sunny-outline',
  },
  {
    id: 'y2',
    title: 'Nadi Shodhana',
    instructor: 'Dr. Anand Rao',
    duration: '15 min',
    level: 'Intermediate',
    category: 'Breathing',
    iconName: 'leaf-outline',
  },
  {
    id: 'y3',
    title: 'Yoga Nidra',
    instructor: 'Meera Iyer',
    duration: '30 min',
    level: 'Beginner',
    category: 'Sleep & Rest',
    iconName: 'moon-outline',
  },
  {
    id: 'y4',
    title: 'Kapalbhati',
    instructor: 'Suresh Gupta',
    duration: '10 min',
    level: 'Intermediate',
    category: 'Detox',
    iconName: 'flame-outline',
  },
  {
    id: 'y5',
    title: 'Shavasana Flow',
    instructor: 'Anita Menon',
    duration: '25 min',
    level: 'Beginner',
    category: 'Relaxation',
    iconName: 'body-outline',
  },
];

// ─── Home Remedies ─────────────────────────────────────────────────────────────
export const HOME_REMEDIES: HomeRemedy[] = [
  {
    id: 'r1',
    symptom: 'Cold & Cough',
    title: 'Turmeric Honey Milk',
    description:
      'Ancient Ayurvedic golden milk to soothe the throat and boost immunity naturally.',
    iconName: 'water-outline',
  },
  {
    id: 'r2',
    symptom: 'Digestion',
    title: 'Ajwain & Jeera Water',
    description:
      'Relieves bloating, gas and indigestion within minutes of consumption.',
    iconName: 'leaf-outline',
  },
  {
    id: 'r3',
    symptom: 'Stress & Anxiety',
    title: 'Ashwagandha Warm Drink',
    description:
      'Adaptogenic herb blend that calms the nervous system and restores inner balance.',
    iconName: 'flower-outline',
  },
  {
    id: 'r4',
    symptom: 'Headache',
    title: 'Brahmi Oil Head Massage',
    description:
      'Cooling scalp massage to relieve tension headaches and calm the mind deeply.',
    iconName: 'hand-left-outline',
  },
  {
    id: 'r5',
    symptom: 'Low Immunity',
    title: 'Tulsi Ginger Kadha',
    description:
      'A warming herbal decoction that strengthens natural immunity from within.',
    iconName: 'medkit-outline',
  },
];

// ─── Ayurveda Daily Tips ───────────────────────────────────────────────────────
export const AYURVEDA_TIPS: AyurvedaTip[] = [
  {
    id: 't1',
    category: 'Morning Ritual',
    title: 'Oil Pulling with Sesame',
    body: 'Swish 1 tbsp sesame oil for 15–20 min on empty stomach for oral and gut health.',
    iconName: 'sunny-outline',
  },
  {
    id: 't2',
    category: 'Dosha Balance',
    title: 'Know Your Prakriti',
    body: 'Understanding your Vata-Pitta-Kapha constitution guides your diet and lifestyle.',
    iconName: 'body-outline',
  },
  {
    id: 't3',
    category: 'Gut Health',
    title: 'Eat Mindfully at Noon',
    body: 'Digestive fire (Agni) is strongest at noon — make it your biggest meal of the day.',
    iconName: 'restaurant-outline',
  },
  {
    id: 't4',
    category: 'Sleep Hygiene',
    title: 'Abhyanga Before Bed',
    body: 'Self-massage with warm sesame oil 30 min before sleep calms Vata and aids rest.',
    iconName: 'moon-outline',
  },
  {
    id: 't5',
    category: 'Hydration',
    title: 'Sip Warm Water Daily',
    body: 'Warm water throughout the day flushes toxins (Ama) and enhances digestion.',
    iconName: 'water-outline',
  },
];
