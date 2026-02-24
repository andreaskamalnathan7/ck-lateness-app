<template>
  <div class="min-h-screen bg-slate-50 flex flex-col pb-24">
    <div class="bg-[#84a96b] p-6 text-white flex items-center gap-4 shadow-md">
       <button @click="$router.back()"><i class="fas fa-arrow-left text-xl"></i></button>
       <h1 class="text-xl font-bold">My Lateness History</h1>
    </div>

    <div class="p-4 flex-1">
      <div v-if="store.history.length === 0" class="text-center p-10 text-slate-400">
        No records found.
      </div>

      <div v-for="item in store.history" :key="item.id" 
           class="bg-white rounded-2xl p-5 mb-4 shadow-sm flex justify-between items-center border-l-4 border-red-500">
        <div>
          <h3 class="font-bold text-slate-800">
            {{ new Date(item.arrival_time).toLocaleDateString() }}
          </h3>
          <p class="text-blue-600 font-medium">
            {{ new Date(item.arrival_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
          </p>
          <p class="text-slate-500 text-sm mt-1 italic">Reason: {{ item.reason }}</p>
        </div>

        <div class="bg-red-50 text-red-600 font-bold px-3 py-2 rounded-xl text-sm">
          {{ item.minutes_late }} min late
        </div>
      </div>
    </div>
    
    <BottomNav />
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/userStore'
import BottomNav from '../components/BottomNav.vue'

const store = useUserStore()
</script>