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
  specialAttack?: number;
  specialDefense?: number;
  abilities?: { name: string; isHidden: boolean }[];
}

export interface PokemonSpecies {
  genus: string;
  flavorText: string;
  category: string;
  growthRate: string;
  habitat: string | null;
  captureRate: number;
  baseHappiness: number;
  eggGroups: string[];
  genderRate: number; // -1 genderless, else female 1/8 chance
  isLegendary: boolean;
  isMythical: boolean;
}

export async function fetchPokemon(idOrName: number | string): Promise<PokemonData> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
  if (!res.ok) throw new Error("Pokémon not found");
  const data = await res.json();

  const stat = (name: string) =>
    data.stats.find((s: any) => s.stat.name === name)?.base_stat ?? 0;

  return {
    id: data.id,
    name: data.name,
    sprite: data.sprites.other?.["official-artwork"]?.front_default || data.sprites.front_default,
    types: data.types.map((t: any) => t.type.name),
    height: data.height,
    weight: data.weight,
    hp: stat("hp"),
    attack: stat("attack"),
    defense: stat("defense"),
    speed: stat("speed"),
    specialAttack: stat("special-attack"),
    specialDefense: stat("special-defense"),
    abilities: data.abilities.map((a: any) => ({
      name: a.ability.name,
      isHidden: a.is_hidden,
    })),
  };
}

export async function fetchPokemonSpecies(id: number | string): Promise<PokemonSpecies> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  if (!res.ok) throw new Error("Species not found");
  const data = await res.json();

  const flavor =
    data.flavor_text_entries.find((f: any) => f.language.name === "en")?.flavor_text ?? "";
  const genus =
    data.genera.find((g: any) => g.language.name === "en")?.genus ?? "Pokémon";

  return {
    genus,
    flavorText: flavor.replace(/[\n\f\r]/g, " "),
    category: genus.replace(/ Pok[eé]mon$/i, ""),
    growthRate: data.growth_rate?.name ?? "—",
    habitat: data.habitat?.name ?? null,
    captureRate: data.capture_rate,
    baseHappiness: data.base_happiness,
    eggGroups: data.egg_groups.map((e: any) => e.name),
    genderRate: data.gender_rate,
    isLegendary: data.is_legendary,
    isMythical: data.is_mythical,
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
