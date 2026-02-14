export type QuoteCategory = 
  | 'focus' 
  | 'discipline' 
  | 'endurance' 
  | 'growth' 
  | 'recovery' 
  | 'mental-toughness';

export interface Quote {
  id: string;
  text: string;
  author: string;
  category: QuoteCategory;
  language: 'en' | 'pl';
}

const quotes: Quote[] = [
  // Focus quotes
  {
    id: 'focus_1',
    text: "The miracle isn't that I finished. The miracle is that I had the courage to start.",
    author: 'John Bingham',
    category: 'focus',
    language: 'en'
  },
  {
    id: 'focus_2', 
    text: "Champions focus on what they want to happen.",
    author: 'Muhammad Ali',
    category: 'focus',
    language: 'en'
  },
  {
    id: 'focus_3',
    text: "Nie ma zwycięzców bez pracy. Jest tylko ciężka praca.",
    author: 'Robert Lewandowski',
    category: 'focus',
    language: 'pl'
  },
  {
    id: 'focus_4',
    text: "Only I can change my life. No one can do it for me.",
    author: 'Eliud Kipchoge',
    category: 'focus',
    language: 'en'
  },
  {
    id: 'focus_5',
    text: "Skupienie to jest wszystko. Bez skupienia nie ma mistrzostw.",
    author: 'Robert Korzeniowski',
    category: 'focus',
    language: 'pl'
  },

  // Discipline quotes
  {
    id: 'discipline_1',
    text: "Discipline is the soul of an army. It makes small numbers formidable; procures success to the weak.",
    author: 'Joe Friel',
    category: 'discipline',
    language: 'en'
  },
  {
    id: 'discipline_2',
    text: "I've never lost a game I just ran out of time.",
    author: 'Michael Jordan',
    category: 'discipline',
    language: 'en'
  },
  {
    id: 'discipline_3',
    text: "Dyscyplina to różnica między tym kim jesteś, a tym kim chcesz być.",
    author: 'Jerzy Janowicz',
    category: 'discipline',
    language: 'pl'
  },
  {
    id: 'discipline_4',
    text: "No human is limited.",
    author: 'Eliud Kipchoge',
    category: 'discipline',
    language: 'en'
  },
  {
    id: 'discipline_5',
    text: "Talent without discipline is like an octopus on roller skates.",
    author: 'H. Jackson Brown Jr.',
    category: 'discipline',
    language: 'en'
  },

  // Endurance quotes
  {
    id: 'endurance_1',
    text: "It is not the mountain we conquer but ourselves.",
    author: 'Sir Edmund Hillary',
    category: 'endurance',
    language: 'en'
  },
  {
    id: 'endurance_2',
    text: "The body achieves what the mind believes.",
    author: 'Napoleon Hill',
    category: 'endurance',
    language: 'en'
  },
  {
    id: 'endurance_3',
    text: "Wytrwałość jest matką wszystkich zwycięstw.",
    author: 'Jan Błachowicz',
    category: 'endurance',
    language: 'pl'
  },
  {
    id: 'endurance_4',
    text: "The only impossible journey is the one you never begin.",
    author: 'Tony Robbins',
    category: 'endurance',
    language: 'en'
  },
  {
    id: 'endurance_5',
    text: "Pain is temporary. Quitting lasts forever.",
    author: 'Lance Armstrong',
    category: 'endurance',
    language: 'en'
  },

  // Growth quotes
  {
    id: 'growth_1',
    text: "You are never too old to set another goal or to dream a new dream.",
    author: 'C.S. Lewis',
    category: 'growth',
    language: 'en'
  },
  {
    id: 'growth_2',
    text: "The expert in anything was once a beginner.",
    author: 'Helen Hayes',
    category: 'growth',
    language: 'en'
  },
  {
    id: 'growth_3',
    text: "Każdy dzień to szansa na to, żeby stać się lepszym.",
    author: 'Iga Świątek',
    category: 'growth',
    language: 'pl'
  },
  {
    id: 'growth_4',
    text: "Champions don't become champions in the ring. They become champions in their training.",
    author: 'Muhammad Ali',
    category: 'growth',
    language: 'en'
  },
  {
    id: 'growth_5',
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: 'Winston Churchill',
    category: 'growth',
    language: 'en'
  },

  // Recovery quotes
  {
    id: 'recovery_1',
    text: "Rest when you're weary. Refresh and renew yourself, your body, your mind, your spirit.",
    author: 'Ralph Marston',
    category: 'recovery',
    language: 'en'
  },
  {
    id: 'recovery_2',
    text: "Recovery is not a reward for training. It is a crucial part of training.",
    author: 'Joe Friel',
    category: 'recovery',
    language: 'en'
  },
  {
    id: 'recovery_3',
    text: "Regeneracja to nie lenistwo. To inwestycja w jutrzejszy trening.",
    author: 'Adam Małysz',
    category: 'recovery',
    language: 'pl'
  },
  {
    id: 'recovery_4',
    text: "Take rest; a field that has rested gives a bountiful crop.",
    author: 'Ovid',
    category: 'recovery',
    language: 'en'
  },
  {
    id: 'recovery_5',
    text: "Sleep is the best meditation.",
    author: 'Dalai Lama',
    category: 'recovery',
    language: 'en'
  },

  // Mental toughness quotes
  {
    id: 'mental_1',
    text: "Mental toughness is spartanism with qualities of sacrifice, self-denial, dedication.",
    author: 'Vince Lombardi',
    category: 'mental-toughness',
    language: 'en'
  },
  {
    id: 'mental_2',
    text: "It's not whether you get knocked down; it's whether you get up.",
    author: 'Vince Lombardi',
    category: 'mental-toughness',
    language: 'en'
  },
  {
    id: 'mental_3',
    text: "Silny umysł to połowa zwycięstwa.",
    author: 'Mariusz Pudzianowski',
    category: 'mental-toughness',
    language: 'pl'
  },
  {
    id: 'mental_4',
    text: "Champions are made from something deep inside them - a desire, a dream, a vision.",
    author: 'Muhammad Ali',
    category: 'mental-toughness',
    language: 'en'
  },
  {
    id: 'mental_5',
    text: "The mind is everything. What you think you become.",
    author: 'Buddha',
    category: 'mental-toughness',
    language: 'en'
  },
  {
    id: 'mental_6',
    text: "When your legs scream stop and your lungs are bursting, that's when it starts.",
    author: 'James Bond Stockdale',
    category: 'mental-toughness',
    language: 'en'
  },
  {
    id: 'mental_7',
    text: "Prawdziwa siła rodzi się wtedy, gdy ciało mówi 'nie mogę', a ty mówisz 'muszę'.",
    author: 'Robert Korzeniowski',
    category: 'mental-toughness',
    language: 'pl'
  },
  {
    id: 'mental_8',
    text: "Training gives us an outlet for suppressed energies created by stress and thus tones the spirit.",
    author: 'Arnold Schwarzenegger',
    category: 'mental-toughness',
    language: 'en'
  }
];

/**
 * Get a deterministic quote for today based on the current date
 */
export function getQuoteOfTheDay(): Quote {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const index = dayOfYear % quotes.length;
  return quotes[index];
}

/**
 * Get a random quote from all quotes
 */
export function getRandomQuote(): Quote {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

/**
 * Get quotes by category
 */
export function getQuotesByCategory(category: QuoteCategory): Quote[] {
  return quotes.filter(quote => quote.category === category);
}

/**
 * Get quotes by language
 */
export function getQuotesByLanguage(language: 'en' | 'pl'): Quote[] {
  return quotes.filter(quote => quote.language === language);
}

/**
 * Get all quotes
 */
export function getAllQuotes(): Quote[] {
  return quotes;
}

/**
 * Get all categories
 */
export function getCategories(): QuoteCategory[] {
  return ['focus', 'discipline', 'endurance', 'growth', 'recovery', 'mental-toughness'];
}