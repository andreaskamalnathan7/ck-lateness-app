<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
    <div class="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10">
      
      <div class="text-center mb-10">
        <h1 class="text-4xl font-extrabold text-slate-800 tracking-tight">Login</h1>
        <p class="text-slate-400 mt-2 font-medium">Welcome back!</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <BaseInput v-model="email" placeholder="Email" type="email">
          <template #icon><i class="fas fa-envelope text-slate-400"></i></template>
        </BaseInput>

        <div class="relative">
          <BaseInput v-model="password" placeholder="Password" type="password">
            <template #icon><i class="fas fa-lock text-slate-400"></i></template>
          </BaseInput>
          <button type="button" @click="handleForgotPassword" class="absolute right-2 -bottom-6 text-xs text-[#84a96b] font-bold">
            Forgot Password?
          </button>
        </div>

        <button type="submit" :disabled="loading" class="w-full bg-[#84a96b] hover:bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg mt-8 text-lg active:scale-95 transition-all disabled:opacity-50">
          {{ loading ? 'Authenticating...' : 'Login' }}
        </button>
      </form>

      <div class="mt-8 pt-8 border-t border-slate-100 text-center">
        <p class="text-slate-500">
          Don't have an account? 
          <router-link to="/register" class="text-[#84a96b] font-bold hover:underline ml-1">
            Register Here
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import API_BASE_URL from '../config'
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import BaseInput from '../components/BaseInput.vue'

const store = useUserStore()
const router = useRouter()
const server_url = `${API_BASE_URL}/api/login`;

const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) return alert("Please enter both email and password.")

  loading.value = true
  try {
    const response = await fetch(server_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: email.value, 
        password: password.value 
      })
    })

    const data = await response.json()

    if (response.ok) {
      await store.saveUser(data.user) 
      await store.fetchHistory()
      router.push('/home')
    } else {
      alert(data.error || "Login failed. Please check your credentials.")
    }
  } catch (e) {
    alert("Connection Error. Is the server running at the correct ip?")
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = () => {
  alert("For security, please contact the School Office or your Teacher to reset your password manually in the database.")
}
</script>