export interface PricingModel {
  id: string;
  name: string;
  provider: string;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  isFree: boolean;
  contextWindow: number;
  category: 'frontier' | 'mid-tier' | 'budget' | 'free';
  color: string;
}

// Last updated: March 2026
export const LAST_UPDATED = '2026-03-05';

export const PRICING_MODELS: PricingModel[] = [
  // Frontier models
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', inputPricePerMillion: 2.50, outputPricePerMillion: 10.00, isFree: false, contextWindow: 128000, category: 'frontier', color: '#10a37f' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', inputPricePerMillion: 10.00, outputPricePerMillion: 30.00, isFree: false, contextWindow: 128000, category: 'frontier', color: '#10a37f' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', inputPricePerMillion: 3.00, outputPricePerMillion: 15.00, isFree: false, contextWindow: 200000, category: 'frontier', color: '#d4a574' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', inputPricePerMillion: 15.00, outputPricePerMillion: 75.00, isFree: false, contextWindow: 200000, category: 'frontier', color: '#d4a574' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', inputPricePerMillion: 1.25, outputPricePerMillion: 5.00, isFree: false, contextWindow: 2000000, category: 'frontier', color: '#4285f4' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'Google', inputPricePerMillion: 0.10, outputPricePerMillion: 0.40, isFree: false, contextWindow: 1000000, category: 'mid-tier', color: '#4285f4' },

  // Mid-tier
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', inputPricePerMillion: 0.15, outputPricePerMillion: 0.60, isFree: false, contextWindow: 128000, category: 'mid-tier', color: '#10a37f' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', inputPricePerMillion: 0.25, outputPricePerMillion: 1.25, isFree: false, contextWindow: 200000, category: 'mid-tier', color: '#d4a574' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google', inputPricePerMillion: 0.075, outputPricePerMillion: 0.30, isFree: false, contextWindow: 1000000, category: 'mid-tier', color: '#4285f4' },
  { id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral', inputPricePerMillion: 2.00, outputPricePerMillion: 6.00, isFree: false, contextWindow: 128000, category: 'frontier', color: '#FF7000' },
  { id: 'mixtral-8x22b', name: 'Mixtral 8x22B', provider: 'Mistral', inputPricePerMillion: 0.65, outputPricePerMillion: 0.65, isFree: false, contextWindow: 65000, category: 'mid-tier', color: '#FF7000' },
  { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek', inputPricePerMillion: 0.27, outputPricePerMillion: 1.10, isFree: false, contextWindow: 128000, category: 'budget', color: '#5b6ee1' },
  { id: 'deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek', inputPricePerMillion: 0.55, outputPricePerMillion: 2.19, isFree: false, contextWindow: 128000, category: 'mid-tier', color: '#5b6ee1' },
  { id: 'command-r-plus', name: 'Command R+', provider: 'Cohere', inputPricePerMillion: 2.50, outputPricePerMillion: 10.00, isFree: false, contextWindow: 128000, category: 'frontier', color: '#39594d' },
  { id: 'llama-3.1-405b', name: 'Llama 3.1 405B', provider: 'Meta (via API)', inputPricePerMillion: 3.00, outputPricePerMillion: 3.00, isFree: false, contextWindow: 128000, category: 'frontier', color: '#0668E1' },
  { id: 'llama-3.3-70b-api', name: 'Llama 3.3 70B', provider: 'Meta (via API)', inputPricePerMillion: 0.10, outputPricePerMillion: 0.40, isFree: false, contextWindow: 128000, category: 'budget', color: '#0668E1' },
  { id: 'qwen-2.5-72b', name: 'Qwen 2.5 72B', provider: 'Alibaba (via API)', inputPricePerMillion: 0.35, outputPricePerMillion: 0.40, isFree: false, contextWindow: 128000, category: 'budget', color: '#6C5CE7' },
  { id: 'grok-2', name: 'Grok-2', provider: 'xAI', inputPricePerMillion: 2.00, outputPricePerMillion: 10.00, isFree: false, contextWindow: 131072, category: 'frontier', color: '#1DA1F2' },

  // Free models (our comparator)
  { id: 'gemma-3-27b', name: 'Gemma 3 27B', provider: 'Google', inputPricePerMillion: 0, outputPricePerMillion: 0, isFree: true, contextWindow: 128000, category: 'free', color: '#34A853' },
  { id: 'gemma-3-12b', name: 'Gemma 3 12B', provider: 'Google', inputPricePerMillion: 0, outputPricePerMillion: 0, isFree: true, contextWindow: 128000, category: 'free', color: '#0F9D58' },
  { id: 'nemotron-30b', name: 'Nemotron 30B', provider: 'NVIDIA', inputPricePerMillion: 0, outputPricePerMillion: 0, isFree: true, contextWindow: 128000, category: 'free', color: '#76B900' },
  { id: 'nemotron-9b', name: 'Nemotron 9B', provider: 'NVIDIA', inputPricePerMillion: 0, outputPricePerMillion: 0, isFree: true, contextWindow: 128000, category: 'free', color: '#8DC63F' },
  { id: 'trinity-400b', name: 'Trinity Large 400B', provider: 'Arcee AI', inputPricePerMillion: 0, outputPricePerMillion: 0, isFree: true, contextWindow: 128000, category: 'free', color: '#E74C3C' },
  { id: 'trinity-mini', name: 'Trinity Mini', provider: 'Arcee AI', inputPricePerMillion: 0, outputPricePerMillion: 0, isFree: true, contextWindow: 128000, category: 'free', color: '#FF6B6B' },
  { id: 'glm-4.5-air', name: 'GLM 4.5 Air', provider: 'Zhipu AI', inputPricePerMillion: 0, outputPricePerMillion: 0, isFree: true, contextWindow: 128000, category: 'free', color: '#00BCF2' },
  { id: 'llama-3.3-70b-free', name: 'Llama 3.3 70B', provider: 'Meta', inputPricePerMillion: 0, outputPricePerMillion: 0, isFree: true, contextWindow: 128000, category: 'free', color: '#0668E1' },
  { id: 'mistral-small-24b', name: 'Mistral Small 24B', provider: 'Mistral', inputPricePerMillion: 0, outputPricePerMillion: 0, isFree: true, contextWindow: 128000, category: 'free', color: '#FF7000' },
  { id: 'qwen3-80b', name: 'Qwen3 Next 80B', provider: 'Alibaba', inputPricePerMillion: 0, outputPricePerMillion: 0, isFree: true, contextWindow: 128000, category: 'free', color: '#6C5CE7' },
  { id: 'qwen3-coder', name: 'Qwen3 Coder 480B', provider: 'Alibaba', inputPricePerMillion: 0, outputPricePerMillion: 0, isFree: true, contextWindow: 128000, category: 'free', color: '#9B59B6' },
  { id: 'hermes-405b', name: 'Hermes 3 405B', provider: 'NousResearch', inputPricePerMillion: 0, outputPricePerMillion: 0, isFree: true, contextWindow: 128000, category: 'free', color: '#2ECC71' },
  { id: 'step-flash', name: 'Step 3.5 Flash', provider: 'StepFun', inputPricePerMillion: 0, outputPricePerMillion: 0, isFree: true, contextWindow: 128000, category: 'free', color: '#F39C12' },
  { id: 'gpt-oss-120b', name: 'GPT-OSS 120B', provider: 'OpenAI', inputPricePerMillion: 0, outputPricePerMillion: 0, isFree: true, contextWindow: 128000, category: 'free', color: '#10a37f' },
];
