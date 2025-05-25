<template>
  <div class="min-h-screen bg-gradient-to-b from-yellow-100 to-pink-100 flex flex-col items-center pt-8">
    <div class="w-full flex flex-col items-center"> 
      <div v-if="loading" class="text-xl mt-8">Loading...</div>
      <div v-else-if="pokemon" class="bg-white rounded-xl shadow p-8 flex flex-col items-center mt-8 w-full max-w-md">
        <img :src="pokemon.image" :alt="pokemon.name" class="w-40 h-40 mb-4" />
        <h2 class="text-2xl font-bold capitalize mb-4">{{ pokemon.name }}</h2>
        <div class="w-full">
          <h3 class="text-lg font-semibold mb-2">Stats</h3>
          <ul>
            <li v-for="stat in pokemon.stats" :key="stat.name" class="mb-4">
              <div class="flex justify-between mb-1">
                <span class="capitalize">{{ stat.name }}</span>
                <span class="font-mono">{{ stat.value }}</span>
              </div>
              <div class="w-full h-3 bg-blue-100 rounded-full overflow-hidden">
                <div class="h-full bg-blue-400 transition-all duration-300" :style="`width: ${Math.min(stat.value, 100)}%`"></div>
              </div>
            </li>
          </ul>
        </div>
        <button @click="goBack" class="mt-8 w-full py-3 rounded-lg bg-red-500 text-white text-lg font-semibold shadow hover:bg-red-600 transition flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          Back to Home
        </button>
      </div>
      <div v-else class="text-red-500 mt-8 text-lg font-semibold">Pokémon not found.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchPokemonDetailById } from '../api/pokemonApi'

interface PokemonStat {
  name: string;
  value: number;
}

interface PokemonDetail {
  name: string;
  image: string;
  stats: PokemonStat[];
}

const route = useRoute()
const router = useRouter()
const pokemon = ref<PokemonDetail | null>(null)
const loading = ref(true)

function goBack() {
  router.push({ name: 'Home' })
}

const fetchPokemon = async (id: string) => {
  loading.value = true
  try {
    const data = await fetchPokemonDetailById(id)
    if (data) {
      pokemon.value = {
        name: data.name,
        image: data.image,
        stats: (data.stats ?? []).map((stat: any) => ({
          name: stat.name,
          value: stat.value
        }))
      }
    } else {
      pokemon.value = null
    }
  } catch (e) {
    pokemon.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPokemon(route.params.id as string)
})
</script>
