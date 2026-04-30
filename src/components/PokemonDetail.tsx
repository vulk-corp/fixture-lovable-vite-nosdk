import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { X, Heart, HeartOff, Ruler, Weight, Sparkles, Circle } from "lucide-react";
import { PokemonData, TYPE_COLORS, fetchPokemonSpecies } from "@/lib/pokemon-api";

interface PokemonDetailProps {
  pokemon: PokemonData | null;
  isSaved: boolean;
  onToggleSave: (pokemon: PokemonData) => void;
  onClose: () => void;
}

function StatRow({ label, value, max = 255 }: { label: string; value: number; max?: number }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="grid grid-cols-[68px_32px_1fr] items-center gap-2">
      <span className="font-display text-[9px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-right text-xs font-bold tabular-nums text-foreground">{value}</span>
      <div className="h-2 overflow-hidden rounded-sm bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="h-full rounded-sm bg-primary"
        />
      </div>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-background/60 px-3 py-2">
      <div className="font-display text-[8px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-xs font-semibold capitalize text-foreground">{value}</div>
    </div>
  );
}

function GenderRatio({ rate }: { rate: number }) {
  if (rate === -1) return <span className="text-muted-foreground">Genderless</span>;
  const femalePct = (rate / 8) * 100;
  const malePct = 100 - femalePct;
  return (
    <span className="text-xs">
      <span className="text-[hsl(210_85%_60%)]">♂ {malePct.toFixed(1)}%</span>
      <span className="mx-1.5 text-muted-foreground">·</span>
      <span className="text-[hsl(330_70%_65%)]">♀ {femalePct.toFixed(1)}%</span>
    </span>
  );
}

export function PokemonDetail({ pokemon, isSaved, onToggleSave, onClose }: PokemonDetailProps) {
  const { data: species } = useQuery({
    queryKey: ["species", pokemon?.id],
    queryFn: () => fetchPokemonSpecies(pokemon!.id),
    enabled: !!pokemon,
    staleTime: Infinity,
  });

  return (
    <AnimatePresence>
      {pokemon && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 22 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-primary/40 bg-card shadow-[0_20px_60px_-10px_hsl(var(--primary)/0.4)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pokédex top bar */}
            <div className="flex items-center gap-3 border-b-2 border-primary/60 bg-primary px-5 py-3">
              <div className="relative h-8 w-8 rounded-full border-2 border-primary-foreground/80 bg-[hsl(210_85%_60%)] shadow-inner">
                <span className="absolute inset-1 rounded-full bg-[hsl(210_90%_75%)] opacity-70 blur-[1px]" />
                <span className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-white" />
              </div>
              <div className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[hsl(0_85%_55%)]" />
                <span className="h-2 w-2 rounded-full bg-[hsl(50_100%_55%)]" />
                <span className="h-2 w-2 rounded-full bg-[hsl(130_60%_50%)]" />
              </div>
              <h2 className="ml-2 flex-1 truncate font-display text-sm capitalize tracking-wider text-primary-foreground">
                {pokemon.name}
              </h2>
              <span className="font-display text-xs text-primary-foreground/80">
                Nº {String(pokemon.id).padStart(3, "0")}
              </span>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/20 hover:text-primary-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto">
              <div className="grid gap-5 p-5 md:grid-cols-[minmax(0,240px)_1fr]">
                {/* Screen / artwork */}
                <div className="flex flex-col gap-3">
                  <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-border bg-gradient-to-br from-muted/80 to-background">
                    <div className="pokeball-pattern absolute inset-0 opacity-40" />
                    <motion.img
                      src={pokemon.sprite}
                      alt={pokemon.name}
                      className="relative z-10 h-full w-full object-contain p-4 drop-shadow-2xl"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {species?.isLegendary && (
                      <span className="absolute left-2 top-2 z-20 flex items-center gap-1 rounded-full bg-accent/90 px-2 py-0.5 font-display text-[8px] uppercase text-accent-foreground">
                        <Sparkles className="h-2.5 w-2.5" /> Legendary
                      </span>
                    )}
                    {species?.isMythical && (
                      <span className="absolute left-2 top-2 z-20 flex items-center gap-1 rounded-full bg-[hsl(var(--pokemon-psychic))] px-2 py-0.5 font-display text-[8px] uppercase text-primary-foreground">
                        <Sparkles className="h-2.5 w-2.5" /> Mythical
                      </span>
                    )}
                  </div>

                  {/* Genus + types */}
                  <div className="rounded-md border border-border bg-background/60 p-3">
                    <div className="font-display text-[8px] uppercase tracking-wider text-muted-foreground">
                      Species
                    </div>
                    <div className="mt-1 text-sm font-semibold text-foreground">
                      {species?.genus ?? "—"}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {pokemon.types.map((type) => (
                        <span
                          key={type}
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm ${TYPE_COLORS[type] || "bg-muted"}`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-4">
                  {/* Flavor text */}
                  <div className="relative rounded-md border border-border bg-[hsl(130_40%_15%)]/30 p-3">
                    <div className="mb-1 flex items-center gap-1.5">
                      <Circle className="h-1.5 w-1.5 fill-primary text-primary" />
                      <span className="font-display text-[8px] uppercase tracking-wider text-muted-foreground">
                        Pokédex Entry
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {species?.flavorText ?? "Loading data…"}
                    </p>
                  </div>

                  {/* Physical info */}
                  <div className="grid grid-cols-2 gap-2">
                    <InfoCell
                      label="Height"
                      value={
                        <span className="flex items-center gap-1.5">
                          <Ruler className="h-3 w-3 text-muted-foreground" />
                          {(pokemon.height / 10).toFixed(1)} m
                        </span>
                      }
                    />
                    <InfoCell
                      label="Weight"
                      value={
                        <span className="flex items-center gap-1.5">
                          <Weight className="h-3 w-3 text-muted-foreground" />
                          {(pokemon.weight / 10).toFixed(1)} kg
                        </span>
                      }
                    />
                  </div>

                  {/* Abilities */}
                  <div>
                    <div className="mb-1.5 font-display text-[8px] uppercase tracking-wider text-muted-foreground">
                      Abilities
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {pokemon.abilities?.map((a) => (
                        <span
                          key={a.name}
                          className={`rounded-md border px-2 py-1 text-xs font-medium capitalize ${
                            a.isHidden
                              ? "border-accent/60 bg-accent/10 text-accent"
                              : "border-border bg-secondary text-foreground"
                          }`}
                        >
                          {a.name.replace(/-/g, " ")}
                          {a.isHidden && <span className="ml-1 text-[9px] opacity-70">(Hidden)</span>}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Breeding / misc */}
                  {species && (
                    <div className="grid grid-cols-2 gap-2">
                      <InfoCell label="Gender" value={<GenderRatio rate={species.genderRate} />} />
                      <InfoCell
                        label="Egg Groups"
                        value={species.eggGroups.join(", ") || "—"}
                      />
                      <InfoCell
                        label="Habitat"
                        value={species.habitat ?? "Unknown"}
                      />
                      <InfoCell
                        label="Growth Rate"
                        value={species.growthRate.replace(/-/g, " ")}
                      />
                      <InfoCell label="Catch Rate" value={species.captureRate} />
                      <InfoCell label="Base Happiness" value={species.baseHappiness} />
                    </div>
                  )}
                </div>
              </div>

              {/* Stats section */}
              <div className="border-t border-border bg-background/40 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-display text-xs uppercase tracking-wider text-foreground">
                    Base Stats
                  </h3>
                  <span className="font-display text-[9px] text-muted-foreground">
                    TOTAL{" "}
                    <span className="text-foreground">
                      {pokemon.hp +
                        pokemon.attack +
                        pokemon.defense +
                        (pokemon.specialAttack ?? 0) +
                        (pokemon.specialDefense ?? 0) +
                        pokemon.speed}
                    </span>
                  </span>
                </div>
                <div className="grid gap-2 md:grid-cols-2 md:gap-x-6">
                  <StatRow label="HP" value={pokemon.hp} />
                  <StatRow label="Sp. Atk" value={pokemon.specialAttack ?? 0} />
                  <StatRow label="Attack" value={pokemon.attack} />
                  <StatRow label="Sp. Def" value={pokemon.specialDefense ?? 0} />
                  <StatRow label="Defense" value={pokemon.defense} />
                  <StatRow label="Speed" value={pokemon.speed} />
                </div>
              </div>

              {/* Save button */}
              <div className="border-t border-border p-4">
                <button
                  onClick={() => onToggleSave(pokemon)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {isSaved ? (
                    <>
                      <Heart className="h-4 w-4 fill-current" /> Saved to Pokédex
                    </>
                  ) : (
                    <>
                      <HeartOff className="h-4 w-4" /> Save to Pokédex
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
