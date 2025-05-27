<template>
    <div class="min-h-screen bg-gradient-to-b from-yellow-100 to-pink-100 flex flex-col items-center pt-8">

        <!-- 🧩 Pokemons Grid -->
        <div class="p-8 w-full flex flex-col items-center">
            <form @submit.prevent="onSearchSubmit" class="w-full flex flex-col items-center mb-6">
                <div class="relative w-64 flex">
                    <input v-model="search" type="text" placeholder="Search For Pokémon..."
                        class="px-4 py-2 rounded-l-lg text-black w-full focus:outline-none shadow-md border border-gray-200 bg-white focus:ring-2 focus:ring-red-200 transition"
                        style="box-shadow: 0 2px 12px 0 rgba(0,0,0,0.06);" />
                    <button type="submit"
                        class="rounded-r-lg px-6 py-2 bg-red-500 text-white text-base font-semibold shadow-md hover:bg-red-600 transition border border-l-0 border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-200 w-auto"
                        style="box-shadow: 0 2px 12px 0 rgba(255,0,0,0.10); min-width: 90px;">
                        Search
                    </button>
                </div>
            </form>
            <div v-if="pokemons.length === 0 && search.trim() !== ''" class="text-red-500 text-lg font-semibold mb-8">Pokémon not found.</div>
            <div v-if="search.trim() !== '' && pokemons.length === 1 || pokemons.length === 0" class="mb-8">
                <button @click="resetToAllPokemon"
                    class="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition border border-gray-300">
                    Other Pokémon
                </button>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-center mb-8">
                <PokemonCard v-for="pokemon in paginatedPokemons" :key="pokemon.name" :name="pokemon.name"
                    :imageUrl="pokemon.image" />
            </div>

            <!-- Pagination -->
            <div class="flex items-center space-x-2 mt-4">
                <button
                    class="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                    :disabled="currentPage === 1"
                    @click="currentPage--"
                >
                    &lt;
                </button>
                <span v-for="page in visiblePages" :key="page">
                    <button
                        v-if="page !== '...'"
                        class="px-3 py-1 rounded border border-gray-300"
                        :class="page === currentPage ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-700 hover:bg-gray-100'"
                        @click="goToPage(page)"
                    >
                        {{ page }}
                    </button>
                    <span v-else class="px-2 text-gray-400">...</span>
                </span>
                <button
                    class="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                    :disabled="currentPage === totalPages"
                    @click="currentPage++"
                >
                    &gt;
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import PokemonCard from '../components/PokemonCard.vue'
import { fetchPokemonList, fetchPokemonCount, fetchPokemonByName } from '../api/pokemonApi'
import type { Pokemon } from '../api/pokemonApi'

const pokemons = ref<Pokemon[]>([])
const search = ref('')
const itemsPerPage = 10
const currentPage = ref(1)
const totalCount = ref(0)

const filteredPokemons = computed(() =>
  pokemons.value.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()))
)

const totalPages = computed(() =>
  Math.ceil(totalCount.value / itemsPerPage)
)

const paginatedPokemons = computed(() => filteredPokemons.value)

async function loadPokemons() {
  pokemons.value = await fetchPokemonList(currentPage.value, itemsPerPage)
}

onMounted(async () => {
  totalCount.value = await fetchPokemonCount()
  await loadPokemons()
})

watch(currentPage, loadPokemons)

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  if (totalPages.value <= 5) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  } else {
    if (currentPage.value <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages.value)
    } else if (currentPage.value >= totalPages.value - 2) {
      pages.push(1, '...', totalPages.value - 3, totalPages.value - 2, totalPages.value - 1, totalPages.value)
    } else {
      pages.push(1, '...', currentPage.value - 1, currentPage.value, currentPage.value + 1, '...', totalPages.value)
    }
  }
  return pages
})

function goToPage(page: number | string) {
  if (typeof page === 'number') currentPage.value = page
}

async function onSearchSubmit() {
  if (search.value.trim() === '') {
    await loadPokemons()
    return
  }
  try {
    const result = await fetchPokemonByName(search.value)
    if (result) {
      pokemons.value = [result]
      totalCount.value = 1
      currentPage.value = 1
    } else {
      pokemons.value = []
      totalCount.value = 0
    }
  } catch (e) {
    pokemons.value = []
    totalCount.value = 0
  }
}

const resetToAllPokemon = () => {
  window.location.reload()
}
</script>
