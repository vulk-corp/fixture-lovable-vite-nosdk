import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, BookOpen, Grid3X3 } from "lucide-react";
import { motion } from "framer-motion";
import { fetchPokemon, fetchPokemonList, PokemonData } from "@/lib/pokemon-api";
import { PokemonCard } from "@/components/PokemonCard";
import { PokemonDetail } from "@/components/PokemonDetail";
import { useSavedPokemon } from "@/hooks/use-saved-pokemon";

type ViewMode = "all" | "saved";

export default function Index() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PokemonData | null>(null);
  const [view, setView] = useState<ViewMode>("all");
  const { savedPokemon, savedIds, toggleSave } = useSavedPokemon();

  const { data: allPokemon = [], isLoading } = useQuery({
    queryKey: ["pokemon-list"],
    queryFn: async () => {
      const list = await fetchPokemonList(151);
      const details = await Promise.all(
        list.map((_, i) => fetchPokemon(i + 1))
      );
      return details;
    },
    staleTime: Infinity,
  });

  const savedPokemonData: PokemonData[] = useMemo(
    () =>
      savedPokemon.map((sp) => ({
        id: sp.pokedex_number,
        name: sp.name,
        sprite: sp.sprite_url,
        types: sp.types,
        height: sp.height ?? 0,
        weight: sp.weight ?? 0,
        hp: sp.hp ?? 0,
        attack: sp.attack ?? 0,
        defense: sp.defense ?? 0,
        speed: sp.speed ?? 0,
      })),
    [savedPokemon]
  );

  const displayList = view === "saved" ? savedPokemonData : allPokemon;

  const filtered = useMemo(() => {
    if (!search.trim()) return displayList;
    const q = search.toLowerCase();
    return displayList.filter(
      (p) =>
        p.name.includes(q) ||
        String(p.id).includes(q) ||
        p.types.some((t) => t.includes(q))
    );
  }, [displayList, search]);

  return (
    <div className="min-h-screen pokeball-pattern">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-display text-lg text-foreground tracking-wide">POKÉDEX</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex overflow-hidden rounded-lg border border-border">
              <button
                onClick={() => setView("all")}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors ${view === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Grid3X3 className="h-3.5 w-3.5" /> All
              </button>
              <button
                onClick={() => setView("saved")}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors ${view === "saved" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <BookOpen className="h-3.5 w-3.5" /> Saved ({savedPokemon.length})
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search name, #, or type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-52 rounded-lg border border-border bg-secondary pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <motion.div
              className="h-12 w-12 rounded-full border-4 border-muted border-t-primary"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="font-display text-xs text-muted-foreground">Loading Pokémon...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20">
            <p className="text-lg font-semibold text-muted-foreground">
              {view === "saved" ? "No saved Pokémon yet" : "No Pokémon found"}
            </p>
            <p className="text-sm text-muted-foreground">
              {view === "saved"
                ? "Click the heart icon on any Pokémon to save it!"
                : "Try a different search term"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filtered.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                isSaved={savedIds.has(pokemon.id)}
                onToggleSave={toggleSave}
                onClick={setSelected}
              />
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <PokemonDetail
        pokemon={selected}
        isSaved={selected ? savedIds.has(selected.id) : false}
        onToggleSave={toggleSave}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
