export interface PokemonData {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  height: number;
  weight: number;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export async function fetchPokemon(idOrName: number | string): Promise<PokemonData> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
  if (!res.ok) throw new Error("Pokémon not found");
  const data = await res.json();
  
  return {
    id: data.id,
    name: data.name,
    sprite: data.sprites.other?.["official-artwork"]?.front_default || data.sprites.front_default,
    types: data.types.map((t: any) => t.type.name),
    height: data.height,
    weight: data.weight,
    hp: data.stats.find((s: any) => s.stat.name === "hp")?.base_stat ?? 0,
    attack: data.stats.find((s: any) => s.stat.name === "attack")?.base_stat ?? 0,
    defense: data.stats.find((s: any) => s.stat.name === "defense")?.base_stat ?? 0,
    speed: data.stats.find((s: any) => s.stat.name === "speed")?.base_stat ?? 0,
  };
}

export async function fetchPokemonList(limit = 151, offset = 0): Promise<{ name: string; url: string }[]> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  const data = await res.json();
  return data.results;
}

export const TYPE_COLORS: Record<string, string> = {
  normal: "bg-pokemon-normal",
  fire: "bg-pokemon-fire",
  water: "bg-pokemon-water",
  electric: "bg-pokemon-electric",
  grass: "bg-pokemon-grass",
  ice: "bg-pokemon-ice",
  fighting: "bg-pokemon-fighting",
  poison: "bg-pokemon-poison",
  ground: "bg-pokemon-ground",
  flying: "bg-pokemon-flying",
  psychic: "bg-pokemon-psychic",
  bug: "bg-pokemon-bug",
  rock: "bg-pokemon-rock",
  ghost: "bg-pokemon-ghost",
  dragon: "bg-pokemon-dragon",
  dark: "bg-pokemon-dark",
  steel: "bg-pokemon-steel",
  fairy: "bg-pokemon-fairy",
};
