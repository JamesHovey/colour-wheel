export type Colour = 'red' | 'yellow' | 'blue' | 'green';

export type Question = {
  id: number;
  colour: Colour;
  text: string;
};

export const questions: Question[] = [
  // RED Questions (IDs 1-10)
  { id: 1, colour: 'red', text: 'I like making quick decisions.' },
  { id: 2, colour: 'red', text: 'I prefer direct and to-the-point communication.' },
  { id: 3, colour: 'red', text: 'I focus on getting results and achieving goals.' },
  { id: 4, colour: 'red', text: 'I enjoy competition and challenges.' },
  { id: 5, colour: 'red', text: 'I am comfortable taking charge in a group.' },
  { id: 6, colour: 'red', text: "I don't like wasting time on unnecessary discussions." },
  { id: 7, colour: 'red', text: 'I work best under pressure and deadlines.' },
  { id: 8, colour: 'red', text: "I can be blunt, but I don't mean to be rude." },
  { id: 9, colour: 'red', text: 'I like to be in control of situations.' },
  { id: 10, colour: 'red', text: 'I appreciate efficiency and dislike slow processes.' },

  // YELLOW Questions (IDs 11-20)
  { id: 11, colour: 'yellow', text: 'I enjoy working in a social and interactive environment.' },
  { id: 12, colour: 'yellow', text: 'I love brainstorming and coming up with creative ideas.' },
  { id: 13, colour: 'yellow', text: 'I prefer a flexible and spontaneous work style.' },
  { id: 14, colour: 'yellow', text: 'I thrive on energy and enthusiasm.' },
  { id: 15, colour: 'yellow', text: 'I like making work fun for myself and others.' },
  { id: 16, colour: 'yellow', text: 'I enjoy meeting new people and networking.' },
  { id: 17, colour: 'yellow', text: 'I tend to start new projects before finishing old ones.' },
  { id: 18, colour: 'yellow', text: 'I prefer talking through ideas rather than writing them down.' },
  { id: 19, colour: 'yellow', text: 'I get bored with routine and repetitive tasks.' },
  { id: 20, colour: 'yellow', text: 'I am naturally optimistic and see possibilities everywhere.' },

  // BLUE Questions (IDs 21-30)
  { id: 21, colour: 'blue', text: 'I like to plan things carefully before taking action.' },
  { id: 22, colour: 'blue', text: 'I prefer receiving instructions in a detailed and structured way.' },
  { id: 23, colour: 'blue', text: 'I focus on accuracy and precision in my work.' },
  { id: 24, colour: 'blue', text: 'I like working alone or in a quiet environment.' },
  { id: 25, colour: 'blue', text: 'I make decisions based on facts, not emotions.' },
  { id: 26, colour: 'blue', text: 'I am naturally cautious and avoid taking unnecessary risks.' },
  { id: 27, colour: 'blue', text: 'I enjoy solving problems logically and systematically.' },
  { id: 28, colour: 'blue', text: 'I prefer following a well-organized process.' },
  { id: 29, colour: 'blue', text: 'I take time to think things through before responding.' },
  { id: 30, colour: 'blue', text: 'I get frustrated when people are too vague or unstructured.' },

  // GREEN Questions (IDs 31-40)
  { id: 31, colour: 'green', text: 'I am a good listener and care about how others feel.' },
  { id: 32, colour: 'green', text: 'I value teamwork and harmony in the workplace.' },
  { id: 33, colour: 'green', text: 'I enjoy supporting and helping others succeed.' },
  { id: 34, colour: 'green', text: 'I avoid conflict and prefer peaceful solutions.' },
  { id: 35, colour: 'green', text: 'I appreciate a stable and predictable work environment.' },
  { id: 36, colour: 'green', text: 'I find it hard to say no to people who need help.' },
  { id: 37, colour: 'green', text: "I am patient and considerate of others' needs." },
  { id: 38, colour: 'green', text: "I don't like being rushed or pressured." },
  { id: 39, colour: 'green', text: 'I value relationships and emotional connections at work.' },
  { id: 40, colour: 'green', text: 'I dislike aggressive or confrontational behavior.' },
];

// Fisher-Yates shuffle algorithm
export function shuffleQuestions(questions: Question[]): Question[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Colour configuration for UI
export const colourConfig = {
  red: {
    hex: '#E63946',
    name: 'Red',
  },
  yellow: {
    hex: '#F4A61D',
    name: 'Yellow',
  },
  blue: {
    hex: '#2D5AA3',
    name: 'Blue',
  },
  green: {
    hex: '#2D936C',
    name: 'Green',
  },
} as const;

// Answer value mapping
export const answerValues = {
  'Strongly Disagree': 1,
  'Disagree': 2,
  'Neutral': 3,
  'Agree': 4,
  'Strongly Agree': 5,
} as const;

export type AnswerLabel = keyof typeof answerValues;
