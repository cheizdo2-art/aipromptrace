import { useState, useEffect } from 'react';
import { ProviderLogo } from './ProviderLogos';

interface ModelResult {
  model: {
    id: string;
    name: string;
    provider: string;
    color: string;
  };
  text: string;
  elapsed: number;
  tokensPerSec: number;
}

interface VoteData {
  votes: Record<string, number>;
  total: number;
}

interface Props {
  results: ModelResult[];
}

// Shuffle array deterministically per session so A/B labels don't always match same model
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LABELS = ['A', 'B', 'C', 'D'];

export default function BlindBattle({ results }: Props) {
  const [shuffled] = useState(() => shuffle(results.filter(r => r.text && !r.error)));
  const [voted, setVoted] = useState<string | null>(null); // modelId or 'tie'
  const [revealed, setRevealed] = useState(false);
  const [voteData, setVoteData] = useState<VoteData | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load current vote counts
  useEffect(() => {
    fetch('/api/vote').then(r => r.json()).then(setVoteData).catch(() => {});
  }, [revealed]);

  const handleVote = async (modelId: string) => {
    if (voted || submitting) return;
    setSubmitting(true);
    setVoted(modelId);

    try {
      if (modelId !== 'tie') {
        await fetch('/api/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ modelId }),
        });
      }
    } catch { /* silent */ }

    // Small delay for drama, then reveal
    await new Promise(r => setTimeout(r, 400));
    setRevealed(true);
    setSubmitting(false);

    // Refresh vote counts after reveal
    fetch('/api/vote').then(r => r.json()).then(setVoteData).catch(() => {});
  };

  const totalVotes = voteData
    ? Object.values(voteData.votes).reduce((a, b) => a + b, 0)
    : null;

  const maxVotes = voteData
    ? Math.max(...Object.values(voteData.votes), 1)
    : 1;

  if (shuffled.length < 2) return null;

  return (
    <div className="mt-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/60 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]/15">
          <svg className="h-4 w-4 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Blind Battle
          </h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            {revealed ? 'Results revealed' : 'Models hidden — vote for the best response'}
          </p>
        </div>
        {totalVotes !== null && (
          <span className="ml-auto text-xs text-[var(--color-text-muted)] font-mono">
            {(voteData!.total + (voted && voted !== 'tie' ? 0 : 0)).toLocaleString()} total votes cast
          </span>
        )}
      </div>

      {/* Battle cards */}
      <div className={`grid gap-4 p-6 ${shuffled.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
        {shuffled.map((result, i) => {
          const label = LABELS[i];
          const isWinner = voted === result.model.id;
          const isTie = voted === 'tie';

          return (
            <div
              key={result.model.id}
              className={`rounded-xl border transition-all duration-500 overflow-hidden ${
                revealed
                  ? isWinner || isTie
                    ? 'border-[var(--color-success)]/50 shadow-[0_0_20px_rgba(74,222,128,0.1)]'
                    : 'border-[var(--color-border)] opacity-60'
                  : voted === result.model.id
                    ? 'border-[var(--color-accent)]/60 shadow-[0_0_16px_rgba(99,102,241,0.15)]'
                    : 'border-[var(--color-border)]'
              }`}
            >
              {/* Card header — blind until revealed */}
              <div
                className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-border)] transition-all duration-700"
                style={revealed ? { background: `${result.model.color}15` } : {}}
              >
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded transition-all duration-700"
                  style={revealed
                    ? { background: `${result.model.color}25`, color: result.model.color }
                    : { background: 'var(--color-border)', color: 'var(--color-text-muted)' }
                  }
                >
                  {revealed
                    ? <ProviderLogo provider={result.model.provider} className="h-3.5 w-3.5" />
                    : <span className="text-xs font-bold">{label}</span>
                  }
                </div>
                <span
                  className="text-sm font-bold transition-all duration-700"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: revealed ? result.model.color : 'var(--color-text-muted)',
                  }}
                >
                  {revealed ? result.model.name : `Model ${label}`}
                </span>
                {revealed && (
                  <span className="ml-auto text-xs text-[var(--color-text-muted)] font-mono">
                    {result.elapsed.toFixed(1)}s · {result.tokensPerSec} t/s
                  </span>
                )}
              </div>

              {/* Response text */}
              <div className="p-4 max-h-48 overflow-y-auto">
                <pre className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap font-sans">
                  {result.text.slice(0, 600)}{result.text.length > 600 ? '…' : ''}
                </pre>
              </div>

              {/* Vote button */}
              {!voted && (
                <div className="px-4 pb-4">
                  <button
                    onClick={() => handleVote(result.model.id)}
                    disabled={submitting}
                    className="w-full rounded-lg border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 py-2 text-sm font-semibold text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20 transition-all disabled:opacity-50"
                  >
                    👆 Vote for Model {label}
                  </button>
                </div>
              )}

              {/* After reveal — winner badge */}
              {revealed && isWinner && (
                <div className="px-4 pb-4">
                  <div className="rounded-lg bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 py-2 text-center text-sm font-semibold text-[var(--color-success)]">
                    ✓ Your pick
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tie button */}
      {!voted && (
        <div className="px-6 pb-6 -mt-2 text-center">
          <button
            onClick={() => handleVote('tie')}
            disabled={submitting}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors underline underline-offset-2"
          >
            🤝 It's a tie — both equally good
          </button>
        </div>
      )}

      {/* Reveal message */}
      {revealed && voted && (
        <div className="px-6 pb-2 text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            {voted === 'tie'
              ? "You called it a tie!"
              : (() => {
                  const winner = shuffled.find(r => r.model.id === voted);
                  return winner
                    ? `You picked ${winner.model.name} as the winner`
                    : '';
                })()
            }
          </p>
        </div>
      )}

      {/* Global leaderboard */}
      {revealed && voteData && (
        <div className="mx-6 mb-6 mt-4 rounded-xl border border-[var(--color-border)] p-4">
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
            Global Battle Rankings
          </p>
          <div className="space-y-2">
            {Object.entries(voteData.votes)
              .sort(([, a], [, b]) => b - a)
              .filter(([, v]) => v > 0)
              .map(([modelId, votes]) => {
                const result = results.find(r => r.model.id === modelId);
                if (!result) return null;
                const pct = Math.round((votes / maxVotes) * 100);
                return (
                  <div key={modelId} className="flex items-center gap-3">
                    <span className="text-xs text-[var(--color-text-secondary)] w-28 truncate shrink-0">
                      {result.model.name}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: result.model.color }}
                      />
                    </div>
                    <span className="text-xs font-mono text-[var(--color-text-muted)] w-10 text-right">
                      {votes.toLocaleString()}
                    </span>
                  </div>
                );
              })}
          </div>
          <p className="mt-3 text-xs text-[var(--color-text-muted)] text-center">
            {voteData.total.toLocaleString()} battles judged by the community
          </p>
        </div>
      )}
    </div>
  );
}
