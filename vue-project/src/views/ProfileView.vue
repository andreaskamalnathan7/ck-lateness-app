<template>
  <div class="min-h-screen bg-slate-50 flex flex-col pb-24">
    <div class="bg-[#84a96b] p-6 text-white flex items-center gap-4 shadow-md">
       <button @click="$router.back()" class="p-1">
         <i class="fas fa-arrow-left text-xl"></i>
       </button>
       <h1 class="text-xl font-bold">My Profile</h1>
    </div>

    <div class="p-6 flex-1 flex flex-col items-center">
      
      <div class="mt-8 flex flex-col items-center">
        <div class="relative group">
          <div class="w-32 h-32 bg-white rounded-full overflow-hidden border-4 border-[#84a96b] shadow-xl">
            <img :src="profileImg" class="w-full h-full object-cover" />
          </div>
          <button @click="changeImage" class="absolute bottom-0 right-0 bg-[#84a96b] text-white p-2 rounded-full border-2 border-white shadow-md">
            <i class="fas fa-camera text-sm"></i>
          </button>
        </div>
        <h2 class="mt-4 text-xl font-bold text-slate-800">{{ store.user.name }}</h2>
        <p class="text-slate-500 text-sm">{{ store.user.student_id }}</p>
      </div>

      <div class="w-full mt-10 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-slate-800">Security</h3>
          <span v-if="store.user.face_descriptor" class="text-[10px] bg-green-100 text-green-600 px-2 py-1 rounded-full font-bold uppercase">
            Enrolled
          </span>
          <span v-else class="text-[10px] bg-amber-100 text-amber-600 px-2 py-1 rounded-full font-bold uppercase">
            Not Registered
          </span>
        </div>
        <p class="text-sm text-slate-500 mb-4">Register your face to enable high-speed check-in at the school entrance.</p>
        
        <button @click="showEnrollScanner = true" 
          class="w-full bg-[#2d74da] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
          <i class="fas fa-user-astronaut"></i>
          {{ store.user.face_descriptor ? 'Update Face Data' : 'Register Face' }}
        </button>
      </div>

      <div class="w-full space-y-4">
        <button @click="handleLogout" 
          class="w-full bg-[#e55353] hover:bg-red-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-100 active:scale-[0.98] transition-all">
          Log Out
        </button>
        <button @click="handleLogout" 
          class="w-full bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl shadow-sm active:scale-[0.98] transition-all">
          Switch Account
        </button>
      </div>

      <div class="w-full mt-6 p-4 bg-slate-100 rounded-2xl">
        <p class="text-xs text-slate-500 text-center italic">
          To change your password or update your student ID, please contact the administrator at CK School.
        </p>
      </div>
    </div>

    <FaceScanner 
      :show="showEnrollScanner" 
      @close="showEnrollScanner = false" 
      @verified="handleEnrollment"
      mode="enroll" 
    />

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import API_BASE_URL from '../config'
import BottomNav from '../components/BottomNav.vue'
import FaceScanner from '../components/FaceScanner.vue'

const store = useUserStore()
const router = useRouter()
const showEnrollScanner = ref(false)

const profileImg = computed(() => {
  return `https://ui-avatars.com/api/?name=${store.user.name}&background=84a96b&color=fff&size=128`
})

const changeImage = () => {
  alert("Profile photo upload will be available in the next update!");
}

/**
 * handleEnrollment
 * Triggered by FaceScanner when a face is successfully captured in 'enroll' mode.
 * @param {Array} descriptor - The 128-float face identity array
 */
const handleEnrollment = async (descriptor) => {
  showEnrollScanner.value = false;
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/enroll-face`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: store.user.student_id,
        face_descriptor: descriptor 
      })
    });

    if (response.ok) {
      alert("Success! Your face is now registered.");
      // Update the local store so the 'Enrolled' badge shows up immediately
      // Convert the descriptor to a string to match database format
      store.user.face_descriptor = JSON.stringify(descriptor);
      await store.updateFaceDescriptor(JSON.stringify(descriptor));
      // Optional: Persist to Preferences if the store doesn't do it automatically
      // await store.saveToPreferences(); 
    } else {
      const err = await response.json();
      alert("Enrollment failed: " + (err.error || "Server error"));
    }
  } catch (error) {
    console.error("Enrollment Error:", error);
    alert("Network Error: Could not reach the server to save face data.");
  }
}

const handleLogout = async () => {
  if(confirm("Are you sure you want to log out?")) {
    await store.logout() 
    router.push('/') 
  }
}
</script>