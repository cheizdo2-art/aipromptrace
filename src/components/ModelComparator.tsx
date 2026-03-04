import { useState, useRef, useCallback, useEffect } from 'react';

interface Model {
  id: string;
  name: string;
  provider: string;
  color: string;
  openrouterId: string;
}

const AVAILABLE_MODELS: Model[] = [
  { id: 'gemma-27b', name: 'Gemma 3 27B', provider: 'Google', color: '#34A853', openrouterId: 'google/gemma-3-27b-it:free' },
  { id: 'gemma-12b', name: 'Gemma 3 12B', provider: 'Google', color: '#0F9D58', openrouterId: 'google/gemma-3-12b-it:free' },
  { id: 'nemotron-30b', name: 'Nemotron 30B', provider: 'NVIDIA', color: '#76B900', openrouterId: 'nvidia/nemotron-3-nano-30b-a3b:free' },
  { id: 'nemotron-9b', name: 'Nemotron 9B', provider: 'NVIDIA', color: '#8DC63F', openrouterId: 'nvidia/nemotron-nano-9b-v2:free' },
  { id: 'trinity-large', name: 'Trinity Large 400B', provider: 'Arcee AI', color: '#E74C3C', openrouterId: 'arcee-ai/trinity-large-preview:free' },
  { id: 'trinity-mini', name: 'Trinity Mini', provider: 'Arcee AI', color: '#FF6B6B', openrouterId: 'arcee-ai/trinity-mini:free' },
  { id: 'glm', name: 'GLM 4.5 Air', provider: 'Zhipu AI', color: '#00BCF2', openrouterId: 'z-ai/glm-4.5-air:free' },
  { id: 'llama', name: 'Llama 3.3 70B', provider: 'Meta', color: '#0668E1', openrouterId: 'meta-llama/llama-3.3-70b-instruct:free' },
  { id: 'mistral', name: 'Mistral Small 24B', provider: 'Mistral', color: '#FF7000', openrouterId: 'mistralai/mistral-small-3.1-24b-instruct:free' },
  { id: 'qwen3-80b', name: 'Qwen3 Next 80B', provider: 'Alibaba', color: '#6C5CE7', openrouterId: 'qwen/qwen3-next-80b-a3b-instruct:free' },
];

interface ModelResult {
  model: Model;
  text: string;
  done: boolean;
  error: string | null;
  startTime: number;
  elapsed: number;
}

const API_KEY_STORAGE = 'aipr_openrouter_key';

export default function ModelComparator() {
  const [prompt, setPrompt] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [results, setResults] = useState<ModelResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const abortRef = useRef<AbortController[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(API_KEY_STORAGE);
    if (saved) {
      setApiKey(saved);
    } else {
      setShowKeyInput(true);
    }
  }, []);

  const saveKey = () => {
    const key = keyInput.trim();
    if (!key.startsWith('sk-or-')) return;
    localStorage.setItem(API_KEY_STORAGE, key);
    setApiKey(key);
    setShowKeyInput(false);
  };

  const clearKey = () => {
    localStorage.removeItem(API_KEY_STORAGE);
    setApiKey('');
    setKeyInput('');
    setShowKeyInput(true);
  };

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
      next[index] = { model, text: '', done: false, error: null, startTime, elapsed: 0 };
      return next;
    });

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://aipromptrace.com',
          'X-Title': 'AI Prompt Race',
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
        const msg = errorData?.error?.message || `HTTP ${response.status}`;
        if (response.status === 401) {
          clearKey();
          throw new Error('Invalid API key. Please enter a valid OpenRouter key.');
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
                  next[index] = {
                    ...next[index],
                    text: next[index].text + token,
                    elapsed: (Date.now() - startTime) / 1000,
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
          next[index] = { ...next[index], done: true, elapsed: (Date.now() - startTime) / 1000 };
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
    if (!prompt.trim() || selectedModels.length < 2 || !apiKey) return;

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
      {/* API Key Setup */}
      {showKeyInput && (
        <div className="mb-6 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 mt-0.5">
              <svg className="h-4 w-4 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Free API Key Required</h3>
              <p className="text-xs text-[var(--color-text-secondary)] mb-3 leading-relaxed">
                Get a free API key from{' '}
                <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline font-medium">
                  openrouter.ai/keys
                </a>
                {' '}(no credit card needed). This key stays in your browser — we never see it.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={keyInput}
                  onChange={e => setKeyInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveKey(); }}
                  placeholder="sk-or-v1-..."
                  className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-mono"
                />
                <button
                  onClick={saveKey}
                  disabled={!keyInput.trim().startsWith('sk-or-')}
                  className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-light)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connected indicator */}
      {apiKey && !showKeyInput && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[var(--color-success)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
            API connected
          </div>
          <button onClick={clearKey} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
            Change key
          </button>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {AVAILABLE_MODELS.map(model => {
            const isSelected = selectedModels.includes(model.id);
            return (
              <button
                key={model.id}
                onClick={() => toggleModel(model.id)}
                className={`relative flex flex-col items-start rounded-lg border p-3 text-left transition-all ${
                  isSelected
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                    : 'border-[var(--color-border)] bg-[var(--color-bg-primary)]/30 hover:border-[var(--color-text-muted)]'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                    <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: model.color }} />
                  <span className="text-xs font-medium text-[var(--color-text-primary)]">{model.name}</span>
                </div>
                <span className="text-xs text-[var(--color-text-muted)]">{model.provider}</span>
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
          disabled={selectedModels.length < 2 || !prompt.trim() || !apiKey}
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
        <div className={`mt-8 grid gap-4 ${results.length <= 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
          {results.map((result, i) => (
            <div
              key={result.model.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)]/30 p-4 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[var(--color-border)]">
                <div className="h-3 w-3 rounded-full" style={{ background: result.model.color }} />
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">{result.model.name}</span>
                <span className="text-xs text-[var(--color-text-muted)]">{result.model.provider}</span>
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

              {/* Body */}
              <div className="flex-1 min-h-[120px] max-h-[400px] overflow-y-auto">
                {result.error ? (
                  <p className="text-sm text-red-400">{result.error}</p>
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
                <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                  <span>{result.text.split(/\s+/).length} words</span>
                  <span>{result.text.length} chars</span>
                  <span>{result.elapsed.toFixed(1)}s total</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
