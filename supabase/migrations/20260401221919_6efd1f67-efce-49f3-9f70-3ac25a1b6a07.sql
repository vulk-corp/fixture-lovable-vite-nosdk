
CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  pokemon_ids integer[] NOT NULL,
  pokemon_names text[] NOT NULL DEFAULT '{}'::text[]
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view teams" ON public.teams FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert teams" ON public.teams FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can delete teams" ON public.teams FOR DELETE TO public USING (true);
