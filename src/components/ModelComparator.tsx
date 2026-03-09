import { useState, useRef, useCallback, useEffect } from 'react';
import { ProviderLogo } from './ProviderLogos';
import BlindBattle from './BlindBattle';

interface Model {
  id: string;
  name: string;
  provider: string;
  color: string;
  openrouterId: string;
}

const AVAILABLE_MODELS: Model[] = [
  { id: 'gemma-12b', name: 'Gemma 3 12B', provider: 'Google', color: '#0F9D58', openrouterId: 'google/gemma-3-12b-it:free' },
  { id: 'nemotron-30b', name: 'Nemotron 30B', provider: 'NVIDIA', color: '#76B900', openrouterId: 'nvidia/nemotron-3-nano-30b-a3b:free' },
  { id: 'nemotron-9b', name: 'Nemotron 9B', provider: 'NVIDIA', color: '#8DC63F', openrouterId: 'nvidia/nemotron-nano-9b-v2:free' },
  { id: 'trinity-large', name: 'Trinity Large 400B', provider: 'Arcee AI', color: '#E74C3C', openrouterId: 'arcee-ai/trinity-large-preview:free' },
  { id: 'trinity-mini', name: 'Trinity Mini', provider: 'Arcee AI', color: '#FF6B6B', openrouterId: 'arcee-ai/trinity-mini:free' },
  { id: 'glm', name: 'GLM 4.5 Air', provider: 'Zhipu AI', color: '#00BCF2', openrouterId: 'z-ai/glm-4.5-air:free' },
];

interface ModelResult {
  model: Model;
  text: string;
  done: boolean;
  error: string | null;
  startTime: number;
  elapsed: number;
  tokensPerSec: number;
}

export default function ModelComparator() {
  const [prompt, setPrompt] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [results, setResults] = useState<ModelResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const abortRef = useRef<AbortController[]>([]);

  // Read URL params for deep-linking from other tools
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlPrompt = params.get('prompt');
    const urlModels = params.get('models');
    if (urlPrompt) setPrompt(decodeURIComponent(urlPrompt));
    if (urlModels) {
      const modelIds = urlModels.split(',').filter(id =>
        AVAILABLE_MODELS.some(m => m.id === id)
      );
      setSelectedModels(modelIds.slice(0, 4));
    }
  }, []);

  const toggleModel = useCallback((modelId: string) => {
    setSelectedModels(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId);
      }
      if (prev.length >= 4) return prev;
      return [...prev, modelId];
    });
  }, []);

  const streamModel = async (model: Model, userPrompt: string, index: number, controller: AbortController) => {
    const startTime = Date.now();

    setResults(prev => {
      const next = [...prev];
      next[index] = { model, text: '', done: false, error: null, startTime, elapsed: 0, tokensPerSec: 0 };
      return next;
    });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model.openrouterId,
          messages: [{ role: 'user', content: userPrompt }],
          stream: true,
          max_tokens: 1024,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg = errorData?.error?.message || errorData?.error || `HTTP ${response.status}`;
        if (response.status === 429) {
          setRateLimited(true);
          throw new Error(msg);
        }
        throw new Error(msg);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const token = parsed.choices?.[0]?.delta?.content || '';
            if (token) {
              setResults(prev => {
                const next = [...prev];
                if (next[index]) {
                  const newText = next[index].text + token;
                  const elapsed = (Date.now() - startTime) / 1000;
                  const approxTokens = newText.length / 4;
                  next[index] = {
                    ...next[index],
                    text: newText,
                    elapsed,
                    tokensPerSec: elapsed > 0.1 ? Math.round(approxTokens / elapsed) : 0,
                  };
                }
                return next;
              });
            }
          } catch {
            // skip malformed JSON
          }
        }
      }

      setResults(prev => {
        const next = [...prev];
        if (next[index]) {
          const finalElapsed = (Date.now() - startTime) / 1000;
      const finalTokens = next[index].text.length / 4;
      next[index] = {
        ...next[index],
        done: true,
        elapsed: finalElapsed,
        tokensPerSec: finalElapsed > 0.1 ? Math.round(finalTokens / finalElapsed) : 0,
      };
        }
        return next;
      });
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setResults(prev => {
        const next = [...prev];
        if (next[index]) {
          next[index] = {
            ...next[index],
            done: true,
            error: err.message || 'Unknown error',
            elapsed: (Date.now() - startTime) / 1000,
          };
        }
        return next;
      });
    }
  };

  const runRace = async () => {
    if (!prompt.trim() || selectedModels.length < 2) return;

    // Abort previous
    abortRef.current.forEach(c => c.abort());

    const models = selectedModels.map(id => AVAILABLE_MODELS.find(m => m.id === id)!);
    const controllers = models.map(() => new AbortController());
    abortRef.current = controllers;

    setIsRunning(true);
    setResults(models.map(model => ({
      model,
      text: '',
      done: false,
      error: null,
      startTime: Date.now(),
      elapsed: 0,
      tokensPerSec: 0,
    })));

    await Promise.all(models.map((model, i) => streamModel(model, prompt.trim(), i, controllers[i])));
    setIsRunning(false);
  };

  const stopRace = () => {
    abortRef.current.forEach(c => c.abort());
    setIsRunning(false);
    setResults(prev => prev.map(r => ({ ...r, done: true })));
  };

  return (
    <div>
      {/* Rate limit warning */}
      {rateLimited && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
              <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-amber-300">Daily limit reached</p>
              <p className="text-xs text-[var(--color-text-muted)]">You've used all 20 free requests for today. Come back tomorrow!</p>
            </div>
          </div>
        </div>
      )}

      {/* Prompt Input */}
      <div className="mb-6">
        <label htmlFor="prompt" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
          Your Prompt
        </label>
        <textarea
          id="prompt"
          rows={3}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) runRace();
          }}
          placeholder="Write a compelling product description for wireless noise-canceling headphones..."
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)]/50 px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] resize-none font-mono text-sm"
        />
        <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
          Ctrl+Enter to run • {prompt.length > 0 ? `${prompt.length} chars` : 'Type your prompt above'}
        </p>
      </div>

      {/* Model Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-3">
          Select Models <span className="text-[var(--color-text-muted)]">({selectedModels.length}/4 selected — min 2)</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {AVAILABLE_MODELS.map(model => {
            const isSelected = selectedModels.includes(model.id);
            return (
              <button
                key={model.id}
                onClick={() => toggleModel(model.id)}
                className={`model-card relative flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
                  isSelected
                    ? 'shadow-[0_0_16px_rgba(99,102,241,0.2)]'
                    : 'border-[var(--color-border)] bg-[var(--color-bg-primary)]/30 hover:border-[var(--color-text-muted)]'
                }`}
                style={isSelected
                  ? { borderColor: model.color, background: `${model.color}12` }
                  : { ['--hover-glow' as string]: model.color }
                }
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 h-5 w-5 rounded-full flex items-center justify-center" style={{ background: model.color }}>
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: `${model.color}25`, color: model.color }}>
                  <ProviderLogo provider={model.provider} className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="block text-sm font-bold truncate" style={{ fontFamily: 'var(--font-heading)', color: model.color }}>{model.name}</span>
                  <span className="block text-xs text-[var(--color-text-secondary)]">{model.provider}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Run / Stop Button */}
      {isRunning ? (
        <button
          onClick={stopRace}
          className="w-full rounded-xl bg-red-600 py-3.5 text-base font-semibold text-white hover:bg-red-700 transition-all flex items-center justify-center gap-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h12v12H6z" />
          </svg>
          Stop Race
        </button>
      ) : (
        <button
          onClick={runRace}
          disabled={selectedModels.length < 2 || !prompt.trim() || rateLimited}
          className="w-full rounded-xl bg-[var(--color-accent)] py-3.5 text-base font-semibold text-white hover:bg-[var(--color-accent-light)] transition-all hover:shadow-lg hover:shadow-[var(--color-accent)]/25 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
          </svg>
          Race! Compare Models
        </button>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className={`mt-8 grid gap-4 grid-cols-1 md:grid-cols-2`}>
          {results.map((result, i) => (
            <div
              key={result.model.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)]/30 p-4 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[var(--color-border)]">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded" style={{ background: `${result.model.color}20`, color: result.model.color }}>
                  <ProviderLogo provider={result.model.provider} className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>{result.model.name}</span>
                <span className="ml-auto text-xs text-[var(--color-text-muted)] font-mono">
                  {result.elapsed.toFixed(1)}s
                </span>
                {result.done && !result.error && (
                  <span className="text-xs text-[var(--color-success)] font-medium">Done</span>
                )}
                {!result.done && !result.error && (
                  <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                )}
              </div>

              {/* Speedometer bar — visible while generating and after done */}
              {(result.text || result.done) && !result.error && result.tokensPerSec > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[var(--color-text-muted)]">Speed</span>
                    <span className="text-xs font-bold font-mono" style={{ color: result.model.color }}>
                      {result.tokensPerSec} <span className="font-normal opacity-70">tok/s</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[var(--color-border)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        background: result.model.color,
                        width: `${Math.min(100, (result.tokensPerSec / 120) * 100)}%`,
                        opacity: result.done ? 1 : 0.75,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Body */}
              <div className="flex-1 min-h-[120px] max-h-[400px] overflow-y-auto">
                {result.error ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 mb-3">
                      <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-amber-300 mb-1">Server overloaded</p>
                    <p className="text-xs text-[var(--color-text-muted)]">This model is temporarily busy. Try another one!</p>
                  </div>
                ) : result.text ? (
                  <pre className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap font-sans">
                    {result.text}
                    {!result.done && <span className="inline-block w-2 h-4 bg-[var(--color-accent)] animate-pulse ml-0.5" />}
                  </pre>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                    Waiting for response...
                  </div>
                )}
              </div>

              {/* Footer stats */}
              {result.done && result.text && (
                <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex items-center gap-3">
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-accent)]/10 px-2.5 py-1">
                    <svg className="h-3 w-3 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <span className="text-xs font-semibold text-[var(--color-accent)]" style={{ fontFamily: 'var(--font-heading)', fontVariantNumeric: 'tabular-nums' }}>
                      {result.text.split(/\s+/).length} <span className="font-normal text-[var(--color-accent)]/70">words</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-accent-2)]/10 px-2.5 py-1">
                    <svg className="h-3 w-3 text-[var(--color-accent-2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <span className="text-xs font-semibold text-[var(--color-accent-2)]" style={{ fontFamily: 'var(--font-heading)', fontVariantNumeric: 'tabular-nums' }}>
                      {result.text.length.toLocaleString()} <span className="font-normal text-[var(--color-accent-2)]/70">chars</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-accent-3)]/10 px-2.5 py-1">
                    <svg className="h-3 w-3 text-[var(--color-accent-3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-semibold text-[var(--color-accent-3)]" style={{ fontFamily: 'var(--font-heading)', fontVariantNumeric: 'tabular-nums' }}>
                      {result.elapsed.toFixed(1)}<span className="font-normal text-[var(--color-accent-3)]/70">s</span>
                    </span>
                  </div>
                  {result.tokensPerSec > 0 && (
                    <div className="flex items-center gap-1.5 rounded-md px-2.5 py-1" style={{ background: `${result.model.color}15` }}>
                      <svg className="h-3 w-3" style={{ color: result.model.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-xs font-semibold font-mono" style={{ color: result.model.color }}>
                        {result.tokensPerSec}<span className="font-normal opacity-70"> t/s</span>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Blind Battle — appears when all models done and at least 2 have text */}
      {!isRunning && results.length >= 2 && results.every(r => r.done) && results.filter(r => r.text).length >= 2 && (
        <BlindBattle key={results.map(r => r.model.id).join('-') + results.map(r => r.text.slice(0, 10)).join('')} results={results} />
      )}
    </div>
  );
}
