import { useState, useMemo } from 'react';
import { PRICING_MODELS, LAST_UPDATED, type PricingModel } from '../data/pricing-models';

type SortBy = 'cheapest' | 'expensive' | 'name';
type ViewMode = 'request' | 'monthly';

function formatCost(cost: number): string {
  if (cost === 0) return 'Free';
  if (cost < 0.001) return `$${cost.toFixed(6)}`;
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  if (cost < 1) return `$${cost.toFixed(3)}`;
  if (cost < 100) return `$${cost.toFixed(2)}`;
  return `$${cost.toFixed(0)}`;
}

function formatTokenCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

// Logarithmic slider: maps 0-100 to 1K-10M
function sliderToTokens(pos: number): number {
  return Math.round(10 ** (3 + pos * 4 / 100));
}

function tokensToSlider(tokens: number): number {
  return Math.round((Math.log10(tokens) - 3) * 100 / 4);
}

export default function AIPricingCalculator() {
  const [sliderPos, setSliderPos] = useState(50); // ~100K tokens
  const [viewMode, setViewMode] = useState<ViewMode>('request');
  const [monthlyRequests, setMonthlyRequests] = useState(1000);
  const [inputRatio, setInputRatio] = useState(70);
  const [sortBy, setSortBy] = useState<SortBy>('cheapest');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const tokenCount = sliderToTokens(sliderPos);
  const inputTokens = tokenCount * inputRatio / 100;
  const outputTokens = tokenCount * (100 - inputRatio) / 100;

  const calculated = useMemo(() => {
    let models = PRICING_MODELS;

    if (showFreeOnly) {
      models = models.filter(m => m.isFree);
    }
    if (selectedCategory !== 'all') {
      models = models.filter(m => m.category === selectedCategory);
    }

    const result = models.map(model => {
      const costPerRequest =
        (inputTokens / 1_000_000) * model.inputPricePerMillion +
        (outputTokens / 1_000_000) * model.outputPricePerMillion;
      const monthlyCost = costPerRequest * monthlyRequests;

      return {
        model,
        costPerRequest,
        monthlyCost,
        displayCost: viewMode === 'monthly' ? monthlyCost : costPerRequest,
      };
    });

    if (sortBy === 'cheapest') result.sort((a, b) => a.displayCost - b.displayCost);
    else if (sortBy === 'expensive') result.sort((a, b) => b.displayCost - a.displayCost);
    else result.sort((a, b) => a.model.name.localeCompare(b.model.name));

    return result;
  }, [tokenCount, inputRatio, viewMode, monthlyRequests, sortBy, showFreeOnly, selectedCategory, inputTokens, outputTokens]);

  const maxCost = Math.max(...calculated.map(c => c.displayCost), 0.001);

  return (
    <div>
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Token count slider */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Tokens per request
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={sliderPos}
            onChange={e => setSliderPos(Number(e.target.value))}
            className="w-full mb-2"
          />
          <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
            <span>1K</span>
            <span className="text-sm font-semibold text-[var(--color-accent)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {formatTokenCount(tokenCount)}
            </span>
            <span>10M</span>
          </div>
        </div>

        {/* Input/Output ratio */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Input / Output ratio
          </label>
          <input
            type="range"
            min={10}
            max={90}
            value={inputRatio}
            onChange={e => setInputRatio(Number(e.target.value))}
            className="w-full mb-2"
          />
          <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
            <span>Input: {inputRatio}%</span>
            <span>Output: {100 - inputRatio}%</span>
          </div>
        </div>
      </div>

      {/* View mode + monthly requests */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden">
          <button
            onClick={() => setViewMode('request')}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              viewMode === 'request'
                ? 'bg-[var(--color-accent)] text-white'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            Per Request
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              viewMode === 'monthly'
                ? 'bg-[var(--color-accent)] text-white'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            Monthly
          </button>
        </div>

        {viewMode === 'monthly' && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-[var(--color-text-muted)]">Requests/month:</label>
            <input
              type="number"
              value={monthlyRequests}
              onChange={e => setMonthlyRequests(Math.max(1, Number(e.target.value) || 1))}
              className="w-24 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)]/50 px-3 py-1.5 text-xs text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
            />
          </div>
        )}

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortBy)}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-xs text-[var(--color-text-secondary)] focus:border-[var(--color-accent)] focus:outline-none"
        >
          <option value="cheapest">Cheapest first</option>
          <option value="expensive">Most expensive first</option>
          <option value="name">Alphabetical</option>
        </select>

        {/* Category filter */}
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-xs text-[var(--color-text-secondary)] focus:border-[var(--color-accent)] focus:outline-none"
        >
          <option value="all">All tiers</option>
          <option value="frontier">Frontier</option>
          <option value="mid-tier">Mid-tier</option>
          <option value="budget">Budget</option>
          <option value="free">Free</option>
        </select>

        {/* Free only toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showFreeOnly}
            onChange={e => setShowFreeOnly(e.target.checked)}
            className="rounded border-[var(--color-border)] accent-[var(--color-accent)]"
          />
          <span className="text-xs text-[var(--color-text-muted)]">Free only</span>
        </label>
      </div>

      {/* Token summary */}
      <div className="mb-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)]/30 p-4 flex flex-wrap gap-6 text-xs text-[var(--color-text-muted)]">
        <div>
          <span className="block text-[var(--color-text-secondary)] font-medium">Total tokens</span>
          {formatTokenCount(tokenCount)}
        </div>
        <div>
          <span className="block text-[var(--color-text-secondary)] font-medium">Input</span>
          {formatTokenCount(Math.round(inputTokens))}
        </div>
        <div>
          <span className="block text-[var(--color-text-secondary)] font-medium">Output</span>
          {formatTokenCount(Math.round(outputTokens))}
        </div>
        {viewMode === 'monthly' && (
          <div>
            <span className="block text-[var(--color-text-secondary)] font-medium">Monthly requests</span>
            {monthlyRequests.toLocaleString()}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-2">
        {calculated.map(({ model, costPerRequest, monthlyCost, displayCost }) => {
          const barWidth = maxCost > 0 ? Math.max((displayCost / maxCost) * 100, model.isFree ? 0 : 1) : 0;

          return (
            <div
              key={model.id}
              className="group flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)]/20 px-4 py-3 hover:border-[var(--color-text-muted)] transition-colors"
            >
              {/* Provider dot */}
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: model.color }}
              />

              {/* Model info */}
              <div className="w-36 sm:w-48 shrink-0">
                <span className="block text-sm font-semibold text-[var(--color-text-primary)] truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                  {model.name}
                </span>
                <span className="block text-[10px] text-[var(--color-text-muted)]">{model.provider}</span>
              </div>

              {/* Cost bar */}
              <div className="flex-1 hidden sm:block">
                <div className="h-5 w-full rounded bg-[var(--color-bg-secondary)]">
                  {model.isFree ? (
                    <div className="h-5 flex items-center px-2">
                      <span className="text-[10px] font-semibold text-[var(--color-success)]">FREE</span>
                    </div>
                  ) : (
                    <div
                      className="cost-bar h-5 flex items-center px-2"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: `${model.color}30`,
                        minWidth: '40px',
                      }}
                    >
                      <span className="text-[10px] font-medium text-[var(--color-text-secondary)] whitespace-nowrap">
                        {formatCost(displayCost)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cost text (mobile) */}
              <div className="sm:hidden ml-auto text-right">
                {model.isFree ? (
                  <span className="text-sm font-bold text-[var(--color-success)]">Free</span>
                ) : (
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {formatCost(displayCost)}
                  </span>
                )}
              </div>

              {/* Prices detail */}
              <div className="hidden lg:flex gap-4 w-40 text-right text-[10px] text-[var(--color-text-muted)]">
                <div>
                  <span className="block">In: ${model.inputPricePerMillion}/1M</span>
                  <span className="block">Out: ${model.outputPricePerMillion}/1M</span>
                </div>
              </div>

              {/* CTA for free models */}
              {model.isFree && (
                <a
                  href="/#compare"
                  className="hidden md:flex shrink-0 items-center gap-1 rounded-md bg-[var(--color-success)]/10 px-2.5 py-1 text-[10px] font-semibold text-[var(--color-success)] hover:bg-[var(--color-success)]/20 transition-colors"
                >
                  Try free
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <p className="mt-6 text-center text-[10px] text-[var(--color-text-muted)]">
        Prices last updated: {LAST_UPDATED}. Prices may vary by provider and region.
        Free models available via{' '}
        <a href="/#compare" className="text-[var(--color-accent)] hover:underline">our comparator</a>.
      </p>
    </div>
  );
}
