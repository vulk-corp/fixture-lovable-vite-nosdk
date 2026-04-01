import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limit config per function name
const RATE_LIMITS: Record<string, { maxRequests: number; windowSeconds: number }> = {
  "generate-team": { maxRequests: 10, windowSeconds: 60 },
  // Stricter for auth-related functions
  "auth-action": { maxRequests: 5, windowSeconds: 60 },
  // Higher for batch/webhook functions
  "webhook-handler": { maxRequests: 100, windowSeconds: 60 },
};

async function checkRateLimit(
  supabase: ReturnType<typeof createClient>,
  ip: string,
  functionName: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const config = RATE_LIMITS[functionName] ?? { maxRequests: 20, windowSeconds: 60 };
  const windowStart = new Date(Date.now() - config.windowSeconds * 1000).toISOString();

  // Upsert: increment counter if within window, otherwise insert new row
  const { data: existing } = await supabase
    .from("rate_limits")
    .select("id, request_count, window_start")
    .eq("ip_address", ip)
    .eq("function_name", functionName)
    .gte("window_start", windowStart)
    .maybeSingle();

  if (existing) {
    if (existing.request_count >= config.maxRequests) {
      const windowEnd = new Date(new Date(existing.window_start).getTime() + config.windowSeconds * 1000);
      const retryAfter = Math.ceil((windowEnd.getTime() - Date.now()) / 1000);
      return { allowed: false, retryAfter: Math.max(retryAfter, 1) };
    }
    await supabase
      .from("rate_limits")
      .update({ request_count: existing.request_count + 1 })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("rate_limits")
      .insert({ ip_address: ip, function_name: functionName, request_count: 1 });
  }

  return { allowed: true };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get client IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  // Check rate limit
  const { allowed, retryAfter } = await checkRateLimit(supabase, ip, "generate-team");
  if (!allowed) {
    return new Response(JSON.stringify({ error: "Too many requests. Please slow down." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": String(retryAfter) },
      status: 429,
    });
  }

  try {
    // Pick 6 unique random IDs from Gen 1 (1-151)
    const ids = new Set<number>();
    while (ids.size < 6) {
      ids.add(Math.floor(Math.random() * 151) + 1);
    }
    const pokemonIds = Array.from(ids);

    // Fetch names from PokeAPI
    const names = await Promise.all(
      pokemonIds.map(async (id) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await res.json();
        return data.name as string;
      })
    );

    // Save to teams table
    const { data, error } = await supabase
      .from("teams")
      .insert({ pokemon_ids: pokemonIds, pokemon_names: names })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
