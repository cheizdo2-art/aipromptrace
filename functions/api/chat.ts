interface Env {
  OPENROUTER_API_KEY: string;
  RATE_LIMIT: KVNamespace;
}

const DAILY_LIMIT = 200;
const ALLOWED_MODELS = [
  // Google
  'google/gemma-3-27b-it:free',
  'google/gemma-3-12b-it:free',
  'google/gemma-3-4b-it:free',
  'google/gemma-3n-e4b-it:free',
  // NVIDIA
  'nvidia/nemotron-3-nano-30b-a3b:free',
  'nvidia/nemotron-nano-9b-v2:free',
  'nvidia/nemotron-nano-12b-v2-vl:free',
  // Arcee AI
  'arcee-ai/trinity-large-preview:free',
  'arcee-ai/trinity-mini:free',
  // Z.AI
  'z-ai/glm-4.5-air:free',
  // Meta
  'meta-llama/llama-3.3-70b-instruct:free',
  'meta-llama/llama-3.2-3b-instruct:free',
  // Mistral
  'mistralai/mistral-small-3.1-24b-instruct:free',
  // Alibaba
  'qwen/qwen3-next-80b-a3b-instruct:free',
  'qwen/qwen3-coder:free',
  'qwen/qwen3-4b:free',
  // NousResearch
  'nousresearch/hermes-3-llama-3.1-405b:free',
  // StepFun
  'stepfun/step-3.5-flash:free',
  // OpenAI
  'openai/gpt-oss-120b:free',
  'openai/gpt-oss-20b:free',
  // Venice
  'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
  // Liquid
  'liquid/lfm-2.5-1.2b-instruct:free',
];

function getClientIP(request: Request): string {
  return request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

function getTodayKey(ip: string): string {
  const today = new Date().toISOString().slice(0, 10);
  return `rate:${ip}:${today}`;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Parse request
  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Validate model
  const model = body.model;
  if (!model || !ALLOWED_MODELS.includes(model)) {
    return new Response(JSON.stringify({ error: 'Model not allowed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Rate limiting by IP
  const ip = getClientIP(request);
  const rateKey = getTodayKey(ip);

  let count = 0;
  if (env.RATE_LIMIT) {
    const stored = await env.RATE_LIMIT.get(rateKey);
    count = stored ? parseInt(stored, 10) : 0;

    if (count >= DAILY_LIMIT) {
      return new Response(JSON.stringify({
        error: `Daily limit reached (${DAILY_LIMIT} requests/day). Come back tomorrow!`
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  }

  // Proxy to OpenRouter
  const openrouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://aipromptrace.com',
      'X-Title': 'AI Prompt Race',
    },
    body: JSON.stringify({
      model: body.model,
      messages: body.messages?.slice(0, 1) || [],
      stream: body.stream || false,
      max_tokens: Math.min(body.max_tokens || 1024, 2048),
    }),
  });

  // Increment rate limit counter
  if (env.RATE_LIMIT && openrouterResponse.ok) {
    await env.RATE_LIMIT.put(rateKey, String(count + 1), { expirationTtl: 86400 });
  }

  // Stream response back
  if (body.stream) {
    return new Response(openrouterResponse.body, {
      status: openrouterResponse.status,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        ...corsHeaders,
      },
    });
  }

  const data = await openrouterResponse.text();
  return new Response(data, {
    status: openrouterResponse.status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
