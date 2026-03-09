interface Env {
  RATE_LIMIT: KVNamespace; // reused for votes storage
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { modelId } = await request.json() as { modelId: string };
    if (!modelId || typeof modelId !== 'string' || modelId.length > 50) {
      return new Response(JSON.stringify({ error: 'Invalid modelId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const key = `votes:${modelId}`;
    const current = await env.RATE_LIMIT.get(key);
    const count = parseInt(current || '0') + 1;
    await env.RATE_LIMIT.put(key, String(count));

    // Also increment total votes
    const totalKey = 'votes:__total__';
    const total = parseInt((await env.RATE_LIMIT.get(totalKey)) || '0') + 1;
    await env.RATE_LIMIT.put(totalKey, String(total));

    return new Response(JSON.stringify({ ok: true, votes: count, total }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  // Return all model vote counts
  const models = ['gemma-12b', 'nemotron-30b', 'nemotron-9b', 'trinity-large', 'trinity-mini', 'glm'];
  const results: Record<string, number> = {};

  await Promise.all(models.map(async (id) => {
    const val = await env.RATE_LIMIT.get(`votes:${id}`);
    results[id] = parseInt(val || '0');
  }));

  const total = parseInt((await env.RATE_LIMIT.get('votes:__total__')) || '0');

  return new Response(JSON.stringify({ votes: results, total }), { headers: corsHeaders });
};
