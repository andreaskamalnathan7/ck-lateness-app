<script setup>
import { onMounted } from 'vue'
import { useUserStore } from './stores/userStore'
import { useRouter } from 'vue-router'

const store = useUserStore()
const router = useRouter()

onMounted(async () => {
  //Check phone storage for saved user
  await store.loadUserData()
  //If data exists, bypass Login/Register and go to Home
  if (store.isRegistered) {
    router.push('/home')
  }
})
</script>

<template>
  <router-view />
</template>