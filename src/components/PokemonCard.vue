<template>
  <div @click="goToDetail" class="bg-white hover:bg-yellow-100 p-4 rounded-xl shadow text-center transition duration-300 border border-gray-300 cursor-pointer">
    <img :src="imageUrl" :alt="name" class="w-24 h-24 mx-auto" />
    <h2 class="text-lg font-semibold mt-2 capitalize text-gray-800">{{ name }}</h2>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const props = defineProps<{
  name: string;
  imageUrl: string;
}>()
const router = useRouter()

function goToDetail() {
  router.push({ name: 'PokemonDetail', params: { id: props.name } })
}
</script>
