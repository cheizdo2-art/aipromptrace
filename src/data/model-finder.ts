export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface QuizOption {
  label: string;
  value: string;
  icon: string;
}

export interface ModelScore {
  id: string;
  name: string;
  provider: string;
  color: string;
  isFree: boolean;
  comparatorId?: string;
  scores: {
    writing: number;
    coding: number;
    analysis: number;
    creative: number;
    general: number;
    speed: number;
    quality: number;
    small: number;
    medium: number;
    large: number;
  };
}

export interface ModelRecommendation {
  name: string;
  provider: string;
  color: string;
  score: number;
  reason: string;
  comparatorId?: string;
  isFree: boolean;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'useCase',
    question: "What will you use the AI model for?",
    options: [
      { label: 'Writing', value: 'writing', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
      { label: 'Coding', value: 'coding', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
      { label: 'Data Analysis', value: 'analysis', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
      { label: 'Creative', value: 'creative', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    ]
  },
  {
    id: 'budget',
    question: 'What is your budget?',
    options: [
      { label: 'Free only', value: 'free', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
      { label: 'I have a budget', value: 'paid', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    ]
  },
  {
    id: 'priority',
    question: 'Speed or quality?',
    options: [
      { label: 'Speed first', value: 'speed', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
      { label: 'Balanced', value: 'balanced', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
      { label: 'Quality first', value: 'quality', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    ]
  },
  {
    id: 'size',
    question: 'What model size do you prefer?',
    options: [
      { label: 'Small (<15B)', value: 'small', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
      { label: 'Medium (15-80B)', value: 'medium', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
      { label: 'Large (80B+)', value: 'large', icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01' },
    ]
  },
];

const MODEL_SCORES: ModelScore[] = [
  // Free models (from our comparator — only models with confirmed uptime)
  { id: 'gemma-12b', name: 'Gemma 3 12B', provider: 'Google', color: '#0F9D58', isFree: true, comparatorId: 'gemma-12b',
    scores: { writing: 6, coding: 6, analysis: 5, creative: 6, general: 7, speed: 9, quality: 5, small: 10, medium: 0, large: 0 } },
  { id: 'nemotron-30b', name: 'Nemotron 30B', provider: 'NVIDIA', color: '#76B900', isFree: true, comparatorId: 'nemotron-30b',
    scores: { writing: 6, coding: 7, analysis: 7, creative: 5, general: 7, speed: 8, quality: 7, small: 0, medium: 10, large: 0 } },
  { id: 'nemotron-9b', name: 'Nemotron 9B', provider: 'NVIDIA', color: '#8DC63F', isFree: true, comparatorId: 'nemotron-9b',
    scores: { writing: 5, coding: 5, analysis: 5, creative: 4, general: 6, speed: 10, quality: 4, small: 10, medium: 0, large: 0 } },
  { id: 'trinity-400b', name: 'Trinity Large 400B', provider: 'Arcee AI', color: '#E74C3C', isFree: true, comparatorId: 'trinity-large',
    scores: { writing: 7, coding: 7, analysis: 7, creative: 7, general: 7, speed: 4, quality: 8, small: 0, medium: 0, large: 10 } },
  { id: 'trinity-mini', name: 'Trinity Mini', provider: 'Arcee AI', color: '#FF6B6B', isFree: true, comparatorId: 'trinity-mini',
    scores: { writing: 5, coding: 5, analysis: 5, creative: 5, general: 6, speed: 9, quality: 4, small: 10, medium: 0, large: 0 } },
  { id: 'glm-4.5', name: 'GLM 4.5 Air', provider: 'Zhipu AI', color: '#00BCF2', isFree: true, comparatorId: 'glm',
    scores: { writing: 6, coding: 6, analysis: 6, creative: 6, general: 7, speed: 7, quality: 6, small: 0, medium: 10, large: 0 } },

  // Paid models
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', color: '#10a37f', isFree: false,
    scores: { writing: 9, coding: 9, analysis: 9, creative: 9, general: 10, speed: 7, quality: 10, small: 0, medium: 0, large: 10 } },
  { id: 'claude-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', color: '#d4a574', isFree: false,
    scores: { writing: 10, coding: 10, analysis: 9, creative: 10, general: 10, speed: 7, quality: 10, small: 0, medium: 0, large: 10 } },
  { id: 'gemini-pro', name: 'Gemini 1.5 Pro', provider: 'Google', color: '#4285f4', isFree: false,
    scores: { writing: 8, coding: 8, analysis: 9, creative: 7, general: 9, speed: 6, quality: 9, small: 0, medium: 0, large: 10 } },
  { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek', color: '#5b6ee1', isFree: false,
    scores: { writing: 7, coding: 9, analysis: 8, creative: 6, general: 8, speed: 8, quality: 8, small: 0, medium: 0, large: 10 } },
];

export function getRecommendations(answers: Record<string, string>): ModelRecommendation[] {
  const { useCase, budget, priority, size } = answers;

  let candidates = MODEL_SCORES;

  // Filter by budget
  if (budget === 'free') {
    candidates = candidates.filter(m => m.isFree);
  }

  // Score each model
  const scored = candidates.map(model => {
    let score = 0;

    // Use case score (weight: 4x)
    const useCaseScore = model.scores[useCase as keyof typeof model.scores] || 0;
    score += useCaseScore * 4;

    // Priority score (weight: 2x)
    if (priority === 'speed') {
      score += model.scores.speed * 2;
    } else if (priority === 'quality') {
      score += model.scores.quality * 2;
    } else {
      score += (model.scores.speed + model.scores.quality) * 1;
    }

    // Size score (weight: 1.5x)
    const sizeScore = model.scores[size as keyof typeof model.scores] || 0;
    score += sizeScore * 1.5;

    // Bonus for free models when budget is 'free'
    if (budget === 'free' && model.isFree) {
      score += 5;
    }

    return { model, score };
  });

  // Sort and take top 3
  scored.sort((a, b) => b.score - a.score);
  const top3 = scored.slice(0, 3);

  return top3.map(({ model, score }) => {
    const useCaseLabel = useCase.charAt(0).toUpperCase() + useCase.slice(1);
    let reason = '';

    if (score === top3[0].score) {
      reason = `Top pick for ${useCaseLabel.toLowerCase()}. `;
    }

    const strengths: string[] = [];
    if (model.scores[useCase as keyof typeof model.scores] >= 8) strengths.push(`excellent at ${useCaseLabel.toLowerCase()}`);
    if (model.scores.speed >= 8) strengths.push('very fast responses');
    if (model.scores.quality >= 9) strengths.push('top-tier quality');
    if (model.isFree) strengths.push('completely free');

    reason += strengths.length > 0
      ? strengths.charAt ? `${strengths.join(', ')}.` : ''
      : `Solid all-around model for ${useCaseLabel.toLowerCase()}.`;

    // Fix: strengths is array, join properly
    reason = score === top3[0].score ? `Top pick for ${useCaseLabel.toLowerCase()}. ` : '';
    reason += strengths.length > 0
      ? strengths.join(', ').replace(/^./, c => c.toUpperCase()) + '.'
      : `Solid all-around model for ${useCaseLabel.toLowerCase()}.`;

    return {
      name: model.name,
      provider: model.provider,
      color: model.color,
      score,
      reason,
      comparatorId: model.comparatorId,
      isFree: model.isFree,
    };
  });
}
