<template>
  <div class="p-8 bg-slate-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-800 tracking-tight">CK School Lateness Monitoring</h1>
          <p class="text-slate-500 mt-1">Attendance & Biometric Status Dashboard</p>
        </div>
        <button @click="fetchData" 
          class="bg-[#84a96b] hover:bg-[#73945d] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-green-100 flex items-center gap-2">
          <i class="fas fa-sync-alt"></i>
          Refresh Data
        </button>
      </div>

      <div class="bg-white rounded-4xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th class="p-5 font-bold text-slate-600 text-sm uppercase tracking-wider">Student</th>
              <th class="p-5 font-bold text-slate-600 text-sm uppercase tracking-wider">Identity</th>
              <th class="p-5 font-bold text-slate-600 text-sm uppercase tracking-wider">Face ID</th>
              <th class="p-5 font-bold text-slate-600 text-sm uppercase tracking-wider">Arrival Time</th>
              <th class="p-5 font-bold text-slate-600 text-sm uppercase tracking-wider text-right">Lateness</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="record in records" :key="record.date" class="hover:bg-slate-50/80 transition-colors">
              <td class="p-5">
                <div class="font-bold text-slate-800">{{ record.name }}</div>
                <div class="text-xs text-slate-400 font-medium">{{ record.student_id }}</div>
              </td>
              <td class="p-5">
                <div class="flex items-center gap-2">
                  <span class="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border border-blue-100">
                    {{ record.level }}
                  </span>
                  <span class="text-slate-600 text-sm font-semibold">
                    {{ record.grade }}{{ record.class_group }} · {{ record.ship }}
                  </span>
                </div>
              </td>
              <td class="p-5">
                <div class="flex items-center gap-2">
                  <div :class="record.face_registered === 'Yes' ? 'bg-green-500' : 'bg-slate-300'" class="w-2 h-2 rounded-full"></div>
                  <span class="text-sm font-bold" :class="record.face_registered === 'Yes' ? 'text-slate-700' : 'text-slate-400'">
                    {{ record.face_registered === 'Yes' ? 'Enrolled' : 'Unregistered' }}
                  </span>
                </div>
              </td>
              <td class="p-5">
                <div class="text-slate-700 text-sm font-medium">{{ formatDate(record.date) }}</div>
                <div class="text-[10px] text-slate-400 italic">{{ record.reason || 'No reason provided' }}</div>
              </td>
              <td class="p-5 text-right">
                <span class="px-3 py-1.5 rounded-lg font-black text-sm" 
                  :class="record.total_lateness > 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'">
                  {{ formatLateness(record.total_lateness) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import API_BASE_URL from '../config'
const server_url = `${API_BASE_URL}/api/admin/records`;
const records = ref([])

const fetchData = async () => {
  try {
    const response = await fetch(server_url)
    const data = await response.json()
    
    console.log("Data successfully loaded:", data)
    records.value = data
  } catch (error) {
    console.error("Error fetching admin data:", error)
  }
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('id-ID', { 
    dateStyle: 'medium', 
    timeStyle: 'short' 
  })
}

const formatLateness = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

onMounted(fetchData)
</script>