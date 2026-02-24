<template>
  <div v-if="show" class="fixed top-0 left-0 w-full h-[calc(100%-64px)] z-100 bg-black">
    <div class="relative w-full h-full">
      <video ref="video" autoplay muted playsinline class="absolute inset-0 w-full h-full object-cover"></video>
      <canvas ref="canvas" class="absolute inset-0 w-full h-full object-cover"></canvas>
    </div>
    
    <div class="absolute bottom-10 left-0 right-0 w-full flex flex-col items-center justify-center gap-6 z-110 px-6">
      <div class="text-white bg-black/60 backdrop-blur-md px-6 py-3 rounded-full text-lg font-medium text-center shadow-2xl border border-white/10 max-w-[90%]">
        {{ statusMessage }}
      </div>
      
      <button 
        @click="closeScanner" 
        class="bg-red-500/90 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform border-2 border-white/20"
      >
        <i class="fas fa-times text-2xl"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as faceapi from 'face-api.js';
import API_BASE_URL from '../config'
import { useUserStore } from '../stores/userStore'

const props = defineProps(['show', 'mode'])
const emit = defineEmits(['close', 'verified'])

const store = useUserStore()
const video = ref(null)
const canvas = ref(null)
const statusMessage = ref('Initializing AI...')
let detectInterval = null;
let modelsLoaded = false;

const loadModels = async () => {
  if (modelsLoaded) return;
  const MODEL_URL = `${API_BASE_URL}/models`.replace(/\/$/, ""); 
  try {
    statusMessage.value = 'Connecting to AI Server...';
    // Load models one by one
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    statusMessage.value = 'Detector Loaded...';
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    statusMessage.value = 'Landmarks Loaded...';
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    modelsLoaded = true;
    statusMessage.value = 'AI Ready. Please look at the camera.';
  } catch (err) {
    console.error("DETAILED MODEL ERROR:", err);
    statusMessage.value = `AI Error: ${err.message || 'Check Connection'}`;
  }
}

const startVideo = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
    video.value.srcObject = stream
  } catch (err) {
    statusMessage.value = "Camera Access Denied"
  }
}

const handleDetection = async () => {
  if (!video.value || !canvas.value) return

  if (video.value.readyState < 2) {
    await new Promise((resolve) => {
      video.value.onloadedmetadata = () => resolve();
    });
  }

  const displaySize = { width: video.value.videoWidth, height: video.value.videoHeight }
  faceapi.matchDimensions(canvas.value, displaySize)

  // Parse saved data safely
  const savedDescriptor = store.user.face_descriptor 
    ? new Float32Array(Object.values(JSON.parse(store.user.face_descriptor))) 
    : null;

  if (detectInterval) clearInterval(detectInterval);

  detectInterval = setInterval(async () => {
    if (!video.value || !canvas.value) return;

    const detections = await faceapi.detectAllFaces(video.value, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const ctx = canvas.value.getContext('2d');
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height); // Clear previous frames
    faceapi.draw.drawDetections(canvas.value, resizedDetections); // Draw the bounding box square
    faceapi.draw.drawFaceLandmarks(canvas.value, resizedDetections); // Draw the landmarks

    if (detections.length > 0) {
      if (props.mode === 'enroll') {
        statusMessage.value = "Face Captured! Saving...";
        clearInterval(detectInterval);
        emit('verified', Array.from(detections[0].descriptor)); 
        return;
      }

      if (!savedDescriptor) {
        statusMessage.value = "No face data found. Register in Profile.";
        return; 
      }

      const faceMatcher = new faceapi.FaceMatcher(savedDescriptor, 0.6);
      const bestMatch = faceMatcher.findBestMatch(detections[0].descriptor);
      
      if (bestMatch.label !== 'unknown') {
        statusMessage.value = "Identity Verified! Welcome " + store.user.name;
        clearInterval(detectInterval);
        setTimeout(() => emit('verified'), 1500);
      } else {
        statusMessage.value = "Face not recognized. Try again.";
      }
    }
  }, 100);
}

watch(() => props.show, async (newVal) => {
  if (newVal) {
    await startVideo();
    await loadModels();
    handleDetection();
  } else {
    if (detectInterval) clearInterval(detectInterval);
  }
});

onMounted(loadModels)

const closeScanner = () => {
  if (video.value && video.value.srcObject) {
    const tracks = video.value.srcObject.getTracks();
    tracks.forEach(track => track.stop());
  }
  emit('close');
}
</script>