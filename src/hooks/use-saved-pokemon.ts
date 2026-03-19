import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PokemonData } from "@/lib/pokemon-api";
import { toast } from "sonner";

export function useSavedPokemon() {
  const queryClient = useQueryClient();

  const { data: savedPokemon = [], isLoading } = useQuery({
    queryKey: ["saved-pokemon"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_pokemon")
        .select("*")
        .order("pokedex_number");
      if (error) throw error;
      return data;
    },
  });

  const savedIds = new Set(savedPokemon.map((p) => p.pokedex_number));

  const saveMutation = useMutation({
    mutationFn: async (pokemon: PokemonData) => {
      const { error } = await supabase.from("saved_pokemon").insert({
        pokedex_number: pokemon.id,
        name: pokemon.name,
        sprite_url: pokemon.sprite,
        types: pokemon.types,
        height: pokemon.height,
        weight: pokemon.weight,
        hp: pokemon.hp,
        attack: pokemon.attack,
        defense: pokemon.defense,
        speed: pokemon.speed,
      });
      if (error) throw error;
    },
    onSuccess: (_, pokemon) => {
      queryClient.invalidateQueries({ queryKey: ["saved-pokemon"] });
      toast.success(`${pokemon.name} saved to your Pokédex!`);
    },
    onError: () => toast.error("Failed to save Pokémon"),
  });

  const removeMutation = useMutation({
    mutationFn: async (pokedexNumber: number) => {
      const { error } = await supabase
        .from("saved_pokemon")
        .delete()
        .eq("pokedex_number", pokedexNumber);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-pokemon"] });
      toast.success("Pokémon released!");
    },
    onError: () => toast.error("Failed to release Pokémon"),
  });

  const toggleSave = (pokemon: PokemonData) => {
    if (savedIds.has(pokemon.id)) {
      removeMutation.mutate(pokemon.id);
    } else {
      saveMutation.mutate(pokemon);
    }
  };

  return { savedPokemon, savedIds, isLoading, toggleSave };
}
