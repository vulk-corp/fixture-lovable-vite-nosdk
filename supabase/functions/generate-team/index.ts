import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limit config per function (requests per window)
const RATE_LIMITS: Record<string, { maxRequests: number; windowSeconds: number }> = {
  "generate-team": { maxRequests: 10, windowSeconds: 60 }, // 10 per minute – moderate, allows bursts
  // Add stricter limits for auth-type functions:
  // "auth-function": { maxRequests: 5, windowSeconds: 60 },
  // Higher for batch/webhook functions:
  // "webhook-handler": { maxRequests: 100, windowSeconds: 60 },
};

async function checkRateLimit(
  supabase: ReturnType<typeof createClient>,
  ip: string,
  functionName: string
): Promise<{ allowed: boolean; retryAfter: number }> {
  const config = RATE_LIMITS[functionName] ?? { maxRequests: 30, windowSeconds: 60 };
  const windowStart = new Date(Date.now() - config.windowSeconds * 1000).toISOString();

  // Count requests in current window
  const { count, error } = await supabase
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("ip_address", ip)
    .eq("function_name", functionName)
    .gte("window_start", windowStart);

  if (error) {
    console.error("Rate limit check error:", error.message);
    // Fail open – don't block on DB errors
    return { allowed: true, retryAfter: 0 };
  }

  if ((count ?? 0) >= config.maxRequests) {
    return { allowed: false, retryAfter: config.windowSeconds };
  }

  // Record this request
  await supabase
    .from("rate_limits")
    .insert({ ip_address: ip, function_name: functionName });

  return { allowed: true, retryAfter: 0 };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get client IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("cf-connecting-ip") ??
      "unknown";

    // Check rate limit
    const { allowed, retryAfter } = await checkRateLimit(supabase, ip, "generate-team");
    if (!allowed) {
      return new Response(JSON.stringify({ error: "Too many requests" }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Retry-After": String(retryAfter),
        },
        status: 429,
      });
    }

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
