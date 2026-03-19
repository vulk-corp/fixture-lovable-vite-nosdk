import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, HeartOff, Ruler, Weight, Zap, Shield, Swords, Activity } from "lucide-react";
import { PokemonData, TYPE_COLORS } from "@/lib/pokemon-api";

interface PokemonDetailProps {
  pokemon: PokemonData | null;
  isSaved: boolean;
  onToggleSave: (pokemon: PokemonData) => void;
  onClose: () => void;
}

function StatBar({ label, value, max = 255, icon: Icon }: { label: string; value: number; max?: number; icon: React.ElementType }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="w-16 text-xs text-muted-foreground">{label}</span>
      <div className="flex-1 overflow-hidden rounded-full bg-muted h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-primary"
        />
      </div>
      <span className="w-8 text-right text-xs font-semibold text-foreground">{value}</span>
    </div>
  );
}

export function PokemonDetail({ pokemon, isSaved, onToggleSave, onClose }: PokemonDetailProps) {
  return (
    <AnimatePresence>
      {pokemon && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1 hover:bg-muted">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>

            <span className="font-display text-xs text-muted-foreground">
              #{String(pokemon.id).padStart(3, "0")}
            </span>

            <div className="flex justify-center py-6">
              <motion.img
                src={pokemon.sprite}
                alt={pokemon.name}
                className="h-40 w-40 object-contain drop-shadow-2xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            <h2 className="text-center text-2xl font-bold capitalize text-foreground">
              {pokemon.name}
            </h2>

            <div className="mt-2 flex justify-center gap-2">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize text-primary-foreground ${TYPE_COLORS[type] || "bg-muted"}`}
                >
                  {type}
                </span>
              ))}
            </div>

            <div className="mt-4 flex justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Ruler className="h-4 w-4" />
                <span>{(pokemon.height / 10).toFixed(1)}m</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Weight className="h-4 w-4" />
                <span>{(pokemon.weight / 10).toFixed(1)}kg</span>
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              <StatBar label="HP" value={pokemon.hp} icon={Activity} />
              <StatBar label="Attack" value={pokemon.attack} icon={Swords} />
              <StatBar label="Defense" value={pokemon.defense} icon={Shield} />
              <StatBar label="Speed" value={pokemon.speed} icon={Zap} />
            </div>

            <button
              onClick={() => onToggleSave(pokemon)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
