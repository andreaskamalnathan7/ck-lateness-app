<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center p-6 pb-32">
    <div class="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 mt-4">
      <h1 class="text-3xl font-bold text-center text-slate-800 mb-2">Register</h1>
      <p class="text-slate-400 text-center mb-8">Complete your student profile</p>
      
      <div class="space-y-6">
        <BaseInput v-model="localUser.email" placeholder="Email Address" type="email">
          <template #icon><i class="fas fa-envelope text-[#84a96b]"></i></template>
        </BaseInput>

        <BaseInput v-model="localUser.password" placeholder="Create Password" type="password">
          <template #icon><i class="fas fa-lock text-[#84a96b]"></i></template>
        </BaseInput>

        <BaseInput v-model="localUser.name" placeholder="Full Name">
          <template #icon><i class="fas fa-user text-[#84a96b]"></i></template>
        </BaseInput>
        
        <BaseInput v-model="localUser.student_id" placeholder="Student ID (e.g. S0441)">
          <template #icon><i class="fas fa-id-card text-[#84a96b]"></i></template>
        </BaseInput>

        <div class="space-y-2">
          <label class="text-sm font-bold text-slate-400 ml-2 uppercase tracking-wider">Class Information</label>
          <button @click="activeModal = 'level'" 
            class="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-50 flex justify-between items-center text-slate-700 font-medium">
            <div class="flex flex-col items-start">
              <span class="text-xs text-slate-400">{{ localUser.level }}</span>
              <span class="text-lg font-bold text-[#84a96b]">{{ localUser.grade }}{{ localUser.class_group }}</span>
            </div>
            <i class="fas fa-edit text-slate-300"></i>
          </button>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-bold text-slate-400 ml-2 uppercase tracking-wider">Ship</label>
          <button @click="activeModal = 'ship'" 
            class="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-50 flex justify-between items-center text-slate-700 font-medium">
            {{ localUser.ship }}
            <i class="fas fa-chevron-down text-slate-300"></i>
          </button>
        </div>

        <button @click="handleSave" 
          class="w-full bg-[#84a96b] text-white font-bold py-5 rounded-3xl shadow-lg shadow-green-100 mt-4 active:scale-95 transition-all text-lg">
          Register Account
        </button>

        <div class="mt-8 pt-6 border-t border-slate-100 text-center">
          <p class="text-slate-500 text-sm">
            Already have an account? 
            <router-link to="/" class="text-[#84a96b] font-bold hover:underline ml-1">Login Here</router-link>
          </p>
        </div>
      </div>
    </div>

    <SelectionModal 
      title="Select Level"
      :show="activeModal === 'level'"
      :options="['SD', 'SMP', 'SMA']"
      v-model="localUser.level"
      @close="onLevelSelected"
    />

    <SelectionModal 
      :title="`Select Grade (${localUser.level})`"
      :show="activeModal === 'grade'"
      :options="gradeOptions"
      v-model="localUser.grade"
      @close="onGradeSelected"
    />

    <SelectionModal 
      title="Select Class Group"
      :show="activeModal === 'class_group'"
      :options="['A', 'B', 'C']"
      v-model="localUser.class_group"
      @close="activeModal = null"
    />

    <SelectionModal 
      title="Select Your Ship"
      :show="activeModal === 'ship'"
      :options="['Clipper', 'Galleon', 'Frigate', 'Schooner']"
      v-model="localUser.ship"
      @close="activeModal = null"
    />
  </div>
</template>

<script setup>
import API_BASE_URL from '../config'
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import BaseInput from '../components/BaseInput.vue'
import SelectionModal from '../components/SelectionModal.vue'

const store = useUserStore()
const router = useRouter()
const activeModal = ref(null)
const server_url = `${API_BASE_URL}/api/register`;

const localUser = ref({
  email: '',
  password: '',
  name: '',
  student_id: '',
  level: 'SD',
  grade: '1',
  class_group: 'A',
  ship: 'Clipper'
})

const gradeOptions = computed(() => {
  if (localUser.value.level === 'SD') return ['1', '2', '3', '4', '5', '6']
  if (localUser.value.level === 'SMP') return ['7', '8', '9']
  if (localUser.value.level === 'SMA') return ['10', '11', '12']
  return []
})

const onLevelSelected = () => {
  // Reset grade to first available in new level
  localUser.value.grade = gradeOptions.value[0]
  activeModal.value = 'grade'
}
const onGradeSelected = () => {
  activeModal.value = 'class_group'
}

const handleSave = async () => {
  if(!localUser.value.password || localUser.value.password.length < 6) {
    return alert("Password must be at least 6 characters")
  }

  try {
    const response = await fetch(server_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(localUser.value)
    })

    if (response.ok) {
      const { password, ...profileData } = localUser.value
      await store.saveUser(profileData)
      router.push('/home')
    } else {
      const data = await response.json()
      alert(data.error || "Registration failed.")
    }
  } catch (e) {
    alert("Connection error! Is your server running?")
  }
}
</script>