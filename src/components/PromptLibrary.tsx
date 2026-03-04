import { useState, useCallback } from 'react';
import { PROMPTS, CATEGORY_META, type PromptCategory } from '../data/prompt-library';

export default function PromptLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = Object.entries(CATEGORY_META) as [PromptCategory, { label: string; color: string }][];

  const filtered = PROMPTS.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    if (!matchesCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.promptText.toLowerCase().includes(q)
    );
  });

  const copyPrompt = useCallback(async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)]/50 pl-11 pr-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-[var(--color-accent)] text-white'
              : 'border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
          }`}
        >
          All ({PROMPTS.length})
        </button>
        {categories.map(([key, meta]) => {
          const count = PROMPTS.filter(p => p.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === key
                  ? 'text-white'
                  : 'border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              }`}
              style={selectedCategory === key ? { backgroundColor: meta.color } : undefined}
            >
              {meta.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <p className="mb-4 text-xs text-[var(--color-text-muted)]">
        {filtered.length} prompt{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Prompt grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-[var(--color-text-muted)]">No prompts match your search.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="mt-2 text-sm text-[var(--color-accent)] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(prompt => {
            const meta = CATEGORY_META[prompt.category];
            const isExpanded = expandedId === prompt.id;
            const isCopied = copiedId === prompt.id;

            return (
              <div
                key={prompt.id}
                className="glass-card flex flex-col rounded-xl p-5"
              >
                {/* Category badge */}
                <span
                  className="mb-3 inline-flex w-fit rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
                  style={{ backgroundColor: meta.color }}
                >
                  {meta.label}
                </span>

                {/* Title */}
                <h3
                  className="text-sm font-bold text-[var(--color-text-primary)] mb-1"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {prompt.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[var(--color-text-muted)] mb-3 leading-relaxed">
                  {prompt.description}
                </p>

                {/* Prompt text (expandable) */}
                <div
                  className={`mb-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)]/50 p-3 cursor-pointer transition-all ${
                    isExpanded ? 'max-h-[400px]' : 'max-h-[80px]'
                  } overflow-hidden`}
                  onClick={() => setExpandedId(isExpanded ? null : prompt.id)}
                >
                  <pre className="text-xs text-[var(--color-text-secondary)] whitespace-pre-wrap" style={{ fontFamily: 'var(--font-mono)' }}>
                    {prompt.promptText}
                  </pre>
                  {!isExpanded && (
                    <div className="mt-1 text-[10px] text-[var(--color-accent)]">Click to expand</div>
                  )}
                </div>

                {/* Tags */}
                <div className="mb-4 flex flex-wrap gap-1">
                  {prompt.tags.map(tag => (
                    <span key={tag} className="rounded bg-[var(--color-bg-secondary)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-muted)]">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => copyPrompt(prompt.id, prompt.promptText)}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                      isCopied
                        ? 'border-[var(--color-success)]/30 text-[var(--color-success)]'
                        : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                  <a
                    href={`/?prompt=${encodeURIComponent(prompt.promptText)}`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-3 py-2 text-xs font-medium text-white hover:bg-[var(--color-accent-light)] transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Try it
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
