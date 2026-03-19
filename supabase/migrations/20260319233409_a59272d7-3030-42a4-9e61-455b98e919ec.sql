
CREATE TABLE public.saved_pokemon (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pokedex_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  sprite_url TEXT NOT NULL,
  types TEXT[] NOT NULL DEFAULT '{}',
  height INTEGER,
  weight INTEGER,
  hp INTEGER,
  attack INTEGER,
  defense INTEGER,
  speed INTEGER,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(pokedex_number)
);

ALTER TABLE public.saved_pokemon ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view saved pokemon"
  ON public.saved_pokemon FOR SELECT USING (true);

CREATE POLICY "Anyone can save pokemon"
  ON public.saved_pokemon FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can release pokemon"
  ON public.saved_pokemon FOR DELETE USING (true);
