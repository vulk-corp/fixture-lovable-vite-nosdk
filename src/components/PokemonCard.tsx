import { motion } from "framer-motion";
import { Heart, HeartOff } from "lucide-react";
import { PokemonData, TYPE_COLORS } from "@/lib/pokemon-api";

interface PokemonCardProps {
  pokemon: PokemonData;
  isSaved: boolean;
  onToggleSave: (pokemon: PokemonData) => void;
  onClick: (pokemon: PokemonData) => void;
}

export function PokemonCard({ pokemon, isSaved, onToggleSave, onClick }: PokemonCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative cursor-pointer rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40"
      onClick={() => onClick(pokemon)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave(pokemon);
        }}
        className="absolute right-3 top-3 z-10 rounded-full p-1.5 transition-colors hover:bg-muted"
      >
        {isSaved ? (
          <Heart className="h-5 w-5 fill-primary text-primary" />
        ) : (
          <HeartOff className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary/60" />
        )}
      </button>

      <span className="font-display text-[10px] text-muted-foreground">
        #{String(pokemon.id).padStart(3, "0")}
      </span>

      <div className="flex justify-center py-4">
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className="h-24 w-24 object-contain drop-shadow-lg transition-transform group-hover:scale-110"
          loading="lazy"
        />
      </div>

      <h3 className="text-center text-sm font-semibold capitalize text-foreground">
        {pokemon.name}
      </h3>

      <div className="mt-2 flex justify-center gap-1.5">
        {pokemon.types.map((type) => (
          <span
            key={type}
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize text-primary-foreground ${TYPE_COLORS[type] || "bg-muted"}`}
          >
            {type}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
