// src/api/pokemonApi.ts

export interface PokemonItem {
  name: string;
  url: string;
}

export interface Pokemon {
  name: string;
  image: string;
  stats?: { name: string; value: number }[];
}

export async function fetchPokemonList(page: number, limit: number = 10): Promise<Pokemon[]> {
  const offset = (page - 1) * limit;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
  const data = await res.json();
  const results: PokemonItem[] = data.results;

  return Promise.all(
    results.map(async (pokemon: PokemonItem) => {
      const res = await fetch(pokemon.url);
      const details = await res.json();
      return {
        name: pokemon.name,
        image: details.sprites.front_default,
      };
    })
  );
}

export async function fetchPokemonCount(): Promise<number> {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1');
  const data = await res.json();
  return data.count;
}

export async function fetchPokemonByName(name: string): Promise<Pokemon | null> {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      name: data.name,
      image: data.sprites.front_default,
    };
  } catch {
    return null;
  }
}

export async function fetchPokemonDetailById(id: string): Promise<Pokemon | null> {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      name: data.name,
      image: data.sprites.front_default,
      stats: data.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat })),
    };
  } catch {
    return null;
  }
}
