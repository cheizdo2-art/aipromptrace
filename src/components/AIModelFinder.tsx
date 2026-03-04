import { useState } from 'react';
import { QUIZ_QUESTIONS, getRecommendations, type ModelRecommendation } from '../data/model-finder';

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];
const MEDAL_LABELS = ['Best Match', '2nd Pick', '3rd Pick'];

export default function AIModelFinder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<ModelRecommendation[] | null>(null);

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const recs = getRecommendations(newAnswers);
      setResults(recs);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers({});
    setResults(null);
  };

  const goBack = () => {
    if (currentStep > 0) {
      const q = QUIZ_QUESTIONS[currentStep - 1];
      const newAnswers = { ...answers };
      delete newAnswers[q.id];
      setAnswers(newAnswers);
      setCurrentStep(currentStep - 1);
    }
  };

  // Show results
  if (results) {
    return (
      <div className="animate-fade-in-up">
        <div className="text-center mb-8">
          <h2
            className="text-2xl font-bold text-[var(--color-text-primary)] mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Your Top Recommendations
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            Based on your answers, here are the best models for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {results.map((rec, i) => (
            <div
              key={rec.name}
              className={`glass-card relative rounded-xl p-6 animate-fade-in-up ${
                i === 0 ? 'md:scale-105 md:shadow-lg ring-1' : ''
              }`}
              style={{
                animationDelay: `${i * 100}ms`,
                borderColor: i === 0 ? rec.color : undefined,
                ringColor: i === 0 ? `${rec.color}40` : undefined,
              }}
            >
              {/* Medal */}
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                  style={{ backgroundColor: `${MEDAL_COLORS[i]}20`, color: MEDAL_COLORS[i] }}
                >
                  #{i + 1}
                </div>
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: MEDAL_COLORS[i] }}
                >
                  {MEDAL_LABELS[i]}
                </span>
              </div>

              {/* Model info */}
              <div className="mb-3">
                <h3
                  className="text-lg font-bold text-[var(--color-text-primary)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {rec.name}
                </h3>
                <p className="text-xs text-[var(--color-text-muted)]">{rec.provider}</p>
              </div>

              {/* Reason */}
              <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                {rec.reason}
              </p>

              {/* Badge */}
              {rec.isFree && (
                <span className="mb-4 inline-flex rounded-full bg-[var(--color-success)]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-success)]">
                  Free
                </span>
              )}

              {/* CTA */}
              {rec.comparatorId ? (
                <a
                  href={`/?models=${rec.comparatorId}`}
                  className="mt-auto flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: rec.color }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Try in Comparator
                </a>
              ) : (
                <div className="mt-auto rounded-lg border border-[var(--color-border)] py-2.5 text-center text-sm text-[var(--color-text-muted)]">
                  Paid model
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-6 py-3 text-sm font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)] transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Start Over
          </button>
          <a
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--color-accent-light)] transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Go to Comparator
          </a>
        </div>
      </div>
    );
  }

  // Show quiz
  const question = QUIZ_QUESTIONS[currentStep];

  return (
    <div>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[var(--color-text-muted)]">
            Question {currentStep + 1} of {QUIZ_QUESTIONS.length}
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">
            {Math.round(((currentStep) / QUIZ_QUESTIONS.length) * 100)}% complete
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--color-border)]">
          <div
            className="h-1.5 rounded-full bg-[var(--color-accent)] transition-all duration-500"
            style={{ width: `${((currentStep) / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div key={currentStep} className="animate-fade-in-up">
        <h2
          className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mb-6 text-center"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {question.question}
        </h2>

        <div className={`grid gap-3 ${question.options.length <= 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-lg mx-auto' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {question.options.map(option => (
            <button
              key={option.value}
              onClick={() => handleAnswer(question.id, option.value)}
              className="glass-card group flex items-center gap-4 rounded-xl p-5 text-left hover:border-[var(--color-accent)] transition-all duration-200"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] group-hover:bg-[var(--color-accent)]/20 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={option.icon} />
                </svg>
              </div>
              <span className="text-sm font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                {option.label}
              </span>
              <svg className="ml-auto h-4 w-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Back button */}
      {currentStep > 0 && (
        <button
          onClick={goBack}
          className="mt-6 flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors mx-auto"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      )}
    </div>
  );
}
