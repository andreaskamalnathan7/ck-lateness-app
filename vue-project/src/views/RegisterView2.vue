<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
    
    <div class="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 p-10">
      
      <div class="text-center mb-10">
        <h1 class="text-4xl font-extrabold text-slate-800 tracking-tight">Register</h1>
        <p class="text-slate-400 mt-2 font-medium">Create your account</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        
        <BaseInput 
          v-model="form.name" 
          placeholder="Full Name" 
          type="text"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </template>
        </BaseInput>

        <BaseInput 
          v-model="form.email" 
          placeholder="Email" 
          type="email"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </template>
        </BaseInput>

        <BaseInput 
          v-model="form.password" 
          placeholder="Password" 
          type="password"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </template>
        </BaseInput>

        <button 
          type="submit" 
          class="w-full bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-200 transition-all duration-200 mt-4 text-lg"
        >
          Register
        </button>
      </form>

      <div class="mt-8 pt-8 border-t border-slate-100 text-center">
        <p class="text-slate-500">
          Already have an account? 
          <RouterLink to="/login" class="text-green-500 font-bold hover:underline ml-1">Login Here</RouterLink>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import BaseInput from '../components/BaseInput.vue';
import { RouterLink } from 'vue-router';

const form = reactive({
  name: '',
  email: '',
  password: ''
});

const handleRegister = () => {
  alert(`Attempting to register: ${form.name}`);
  // This is where your API logic will go later!
};
</script>