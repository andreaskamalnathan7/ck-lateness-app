<template>
  <div class="min-h-screen bg-slate-50 pb-24 relative">
    <div class="bg-[#84a96b] h-40 p-6 rounded-b-[3rem] flex items-start shadow-md">
       <button @click="$router.back()" class="p-2 -ml-2">
         <i class="fas fa-arrow-left text-white text-xl"></i>
       </button>
    </div>

    <div class="px-6 -mt-16">
      <div class="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200 p-10 flex flex-col items-center border border-slate-50">
        <h2 class="text-2xl font-bold text-slate-800 text-center leading-tight">
          Welcome,<br/>
          <span class="text-[#84a96b]">{{ store.user.name || 'Student' }}</span>
        </h2>
        
        <button @click="handleScan" 
          class="mt-12 w-full max-w-55 bg-[#2d74da] text-white rounded-2xl py-5 flex items-center justify-center gap-4 shadow-lg shadow-blue-200 active:scale-95 transition-all">
          <i class="fas fa-qrcode text-2xl"></i>
          <span class="text-lg font-bold tracking-wide uppercase">Scan QR Code</span>
        </button>

        <button @click="showFaceScanner = true" 
          class="mt-12 w-full max-w-55 bg-[#2d74da] text-white rounded-2xl py-5 flex items-center justify-center gap-4 shadow-lg shadow-blue-200 active:scale-95 transition-all">
          <i class="fas fa-user-check text-2xl"></i>
          <span class="text-lg font-bold tracking-wide uppercase">Face Recognition</span>
        </button>
        <FaceScanner 
          :show="showFaceScanner" 
          @close="showFaceScanner = false" 
          @verified="handleFaceVerified" />
      </div>
    </div>

    <SelectionModal 
      title="Why are you late?"
      :show="showModal"
      :options="reasons"
      v-model="selectedReason"
      @close="showModal = false"
      @submit="submitLateRecord"
    />
    <BottomNav />
  </div>
</template>

<script setup>
import API_BASE_URL from '../config'
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import BottomNav from '../components/BottomNav.vue'
import SelectionModal from '../components/SelectionModal.vue'
//import FaceScanner from '../components/FaceScanner.vue'
import { defineAsyncComponent } from 'vue'
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning'

const server_url = `${API_BASE_URL}/api/scan`;
const store = useUserStore()
const FaceScanner = defineAsyncComponent(() => import('../components/FaceScanner.vue'))
const showModal = ref(false)
const showFaceScanner = ref(false)
const selectedReason = ref('')
const reasons = ['Traffic / Macet', 'Vehicle Trouble', 'Overslept', 'Rain / Hujan', 'Other']

const handleScan = async () => {
  // Reset previous selection before a new scan
  selectedReason.value = '';

  // 1. SIMULATION MODE for Browser Testing
  if (!window.Capacitor?.isNativePlatform()) {
    console.warn("Running in Browser: Simulating QR Scan...");
    if (confirm("Simulate Successful Scan of 'CK-ENTRANCE-01'?")) {
      showModal.value = true;
    }
    return;
  }

  // 2. REAL CAMERA (Capacitor/Android)
  try {
    const result = await BarcodeScanner.scan();
    if (result?.barcodes?.length > 0) {
      const code = result.barcodes[0].displayValue;
      if (code === 'CK-ENTRANCE-01') {
        showModal.value = true;
      } else {
        alert("Unauthorized QR Code! Please scan the school entrance code.");
      }
    }
  } catch (e) {
    console.error("Scan Error:", e);
    alert("Camera error. Please check permissions.");
  }
}

const handleFaceVerified = () => {
  showFaceScanner.value = false;
  showModal.value = true; // Open the reason modal
};

const submitLateRecord = async () => {
  const now = new Date();
  
  // 1. Calculate Lateness (School start: 07:45)
  const schoolTime = new Date();
  schoolTime.setHours(7, 45, 0);
  const diff = now - schoolTime;
  const minutesLate = diff > 0 ? Math.floor(diff / 60000) : 0;

  // 2. Format Date for MySQL (YYYY-MM-DD HH:MM:SS)
  const mysqlTime = now.toISOString().slice(0, 19).replace('T', ' ');

  // 3. Prepare Updated Payload
  const payload = {
    student_id: store.user.student_id,
    reason: selectedReason.value,
    minutes_late: minutesLate,
    arrival_time: mysqlTime // sending the exact time (now) instead of server time to ensure accuracy)
  };

  try {
    const response = await fetch(server_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert(`Recorded! You are ${minutesLate} mins late.`);
      await store.fetchHistory(); 
      showModal.value = false;
      selectedReason.value = ''; 
    } else {
      const err = await response.json();
      alert("Server Error: " + (err.error || "Failed to save record"));
    }
  } catch (error) {
    alert("Network Error: Could not connect to the database server.");
  }
}
</script>