import {
  Footprints,
  Mountain,
  Bike,
  MapPin,
  Waves,
  Wind,
  Activity,
  Target,
  Timer,
  Users2,
  Trophy,
  Circle,
  Square,
  Zap,
  Dumbbell,
  Flame,
  Sword,
  Shield,
  CircleDot,
  Disc,
  Gamepad2,
  Heart,
  TreePine,
  Snowflake,
  Anchor,
  Palmtree,
  Plus
} from 'lucide-react';

export interface Sport {
  id: string;
  name: string;
  emoji: string;
  category: 'Popular' | 'Endurance' | 'Team' | 'Strength' | 'Combat' | 'Other';
  icon: React.ComponentType<{ className?: string }>;
}

export const SPORT_CATEGORIES = [
  'Popular',
  'Endurance', 
  'Team',
  'Strength',
  'Combat',
  'Other'
] as const;

export const SPORTS: Sport[] = [
  // Popular
  {
    id: 'running',
    name: 'Running',
    emoji: '🏃‍♂️',
    category: 'Popular',
    icon: Footprints
  },
  {
    id: 'cycling',
    name: 'Cycling',
    emoji: '🚴‍♂️',
    category: 'Popular',
    icon: Bike
  },
  {
    id: 'swimming',
    name: 'Swimming',
    emoji: '🏊‍♂️',
    category: 'Popular',
    icon: Waves
  },
  {
    id: 'football',
    name: 'Football',
    emoji: '⚽',
    category: 'Popular',
    icon: Users2
  },
  {
    id: 'crossfit',
    name: 'CrossFit',
    emoji: '🏋️‍♂️',
    category: 'Popular',
    icon: Dumbbell
  },
  {
    id: 'hyrox',
    name: 'HYROX',
    emoji: '🔥',
    category: 'Popular',
    icon: Timer
  },
  {
    id: 'basketball',
    name: 'Basketball',
    emoji: '🏀',
    category: 'Popular',
    icon: Trophy
  },
  {
    id: 'mma',
    name: 'MMA',
    emoji: '🥊',
    category: 'Popular',
    icon: Sword
  },
  {
    id: 'tennis',
    name: 'Tennis',
    emoji: '🎾',
    category: 'Popular',
    icon: CircleDot
  },
  {
    id: 'strength-training',
    name: 'Strength Training',
    emoji: '💪',
    category: 'Popular',
    icon: Dumbbell
  },

  // Endurance
  {
    id: 'trail-running',
    name: 'Trail Running',
    emoji: '🏔️',
    category: 'Endurance',
    icon: Mountain
  },
  {
    id: 'mountain-biking',
    name: 'Mountain Biking',
    emoji: '🚵‍♂️',
    category: 'Endurance',
    icon: Mountain
  },
  {
    id: 'open-water-swimming',
    name: 'Open Water Swimming',
    emoji: '🌊',
    category: 'Endurance',
    icon: Waves
  },
  {
    id: 'triathlon',
    name: 'Triathlon',
    emoji: '🏊‍♂️🚴‍♂️🏃‍♂️',
    category: 'Endurance',
    icon: Activity
  },
  {
    id: 'duathlon',
    name: 'Duathlon',
    emoji: '🚴‍♂️🏃‍♂️',
    category: 'Endurance',
    icon: Activity
  },
  {
    id: 'aquathlon',
    name: 'Aquathlon',
    emoji: '🏊‍♂️🏃‍♂️',
    category: 'Endurance',
    icon: Activity
  },

  // Team
  {
    id: 'volleyball',
    name: 'Volleyball',
    emoji: '🏐',
    category: 'Team',
    icon: Users2
  },
  {
    id: 'handball',
    name: 'Handball',
    emoji: '🤾‍♂️',
    category: 'Team',
    icon: Users2
  },
  {
    id: 'rugby',
    name: 'Rugby',
    emoji: '🏉',
    category: 'Team',
    icon: Users2
  },
  {
    id: 'hockey',
    name: 'Hockey',
    emoji: '🏒',
    category: 'Team',
    icon: Users2
  },

  // Strength
  {
    id: 'functional-fitness',
    name: 'Functional Fitness',
    emoji: '🏋️‍♀️',
    category: 'Strength',
    icon: Dumbbell
  },
  {
    id: 'powerlifting',
    name: 'Powerlifting',
    emoji: '🏋️‍♂️',
    category: 'Strength',
    icon: Dumbbell
  },
  {
    id: 'olympic-weightlifting',
    name: 'Olympic Weightlifting',
    emoji: '🏋️‍♀️',
    category: 'Strength',
    icon: Dumbbell
  },

  // Combat
  {
    id: 'boxing',
    name: 'Boxing',
    emoji: '🥊',
    category: 'Combat',
    icon: Sword
  },
  {
    id: 'kickboxing',
    name: 'Kickboxing',
    emoji: '🦵',
    category: 'Combat',
    icon: Sword
  },
  {
    id: 'judo',
    name: 'Judo',
    emoji: '🥋',
    category: 'Combat',
    icon: Shield
  },
  {
    id: 'bjj',
    name: 'BJJ',
    emoji: '🥋',
    category: 'Combat',
    icon: Shield
  },
  {
    id: 'wrestling',
    name: 'Wrestling',
    emoji: '🤼‍♂️',
    category: 'Combat',
    icon: Shield
  },

  // Other
  {
    id: 'padel',
    name: 'Padel',
    emoji: '🎾',
    category: 'Other',
    icon: CircleDot
  },
  {
    id: 'badminton',
    name: 'Badminton',
    emoji: '🏸',
    category: 'Other',
    icon: CircleDot
  },
  {
    id: 'table-tennis',
    name: 'Table Tennis',
    emoji: '🏓',
    category: 'Other',
    icon: CircleDot
  },
  {
    id: 'squash',
    name: 'Squash',
    emoji: '🎾',
    category: 'Other',
    icon: CircleDot
  },
  {
    id: 'yoga',
    name: 'Yoga',
    emoji: '🧘‍♀️',
    category: 'Other',
    icon: Heart
  },
  {
    id: 'pilates',
    name: 'Pilates',
    emoji: '🧘‍♀️',
    category: 'Other',
    icon: Heart
  },
  {
    id: 'dance',
    name: 'Dance',
    emoji: '💃',
    category: 'Other',
    icon: Heart
  },
  {
    id: 'gymnastics',
    name: 'Gymnastics',
    emoji: '🤸‍♀️',
    category: 'Other',
    icon: Activity
  },
  {
    id: 'skiing',
    name: 'Skiing',
    emoji: '⛷️',
    category: 'Other',
    icon: Snowflake
  },
  {
    id: 'snowboarding',
    name: 'Snowboarding',
    emoji: '🏂',
    category: 'Other',
    icon: Snowflake
  },
  {
    id: 'ice-skating',
    name: 'Ice Skating',
    emoji: '⛸️',
    category: 'Other',
    icon: Snowflake
  },
  {
    id: 'rowing',
    name: 'Rowing',
    emoji: '🚣‍♂️',
    category: 'Other',
    icon: Anchor
  },
  {
    id: 'kayaking',
    name: 'Kayaking',
    emoji: '🛶',
    category: 'Other',
    icon: Anchor
  },
  {
    id: 'surfing',
    name: 'Surfing',
    emoji: '🏄‍♂️',
    category: 'Other',
    icon: Palmtree
  },
  {
    id: 'golf',
    name: 'Golf',
    emoji: '⛳',
    category: 'Other',
    icon: Target
  },
  {
    id: 'climbing',
    name: 'Climbing',
    emoji: '🧗‍♂️',
    category: 'Other',
    icon: Mountain
  },
  {
    id: 'hiking',
    name: 'Hiking',
    emoji: '🥾',
    category: 'Other',
    icon: TreePine
  }
];

export const getPopularSports = () => {
  return SPORTS.filter(sport => sport.category === 'Popular');
};

export const getSportsByCategory = (category: Sport['category']) => {
  return SPORTS.filter(sport => sport.category === category);
};

export const searchSports = (query: string) => {
  if (!query.trim()) return SPORTS;
  
  const searchTerm = query.toLowerCase().trim();
  return SPORTS.filter(sport => 
    sport.name.toLowerCase().includes(searchTerm) ||
    sport.emoji.includes(searchTerm)
  );
};

export const getSportById = (id: string) => {
  return SPORTS.find(sport => sport.id === id);
};

export const getSportsByIds = (ids: string[]) => {
  return SPORTS.filter(sport => ids.includes(sport.id));
};