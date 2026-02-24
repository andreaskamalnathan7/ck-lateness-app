<template>
  <div v-if="show" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-1000 p-4">
    <div class="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
      
      <h3 class="text-xl font-bold text-slate-800 mb-6 text-center">{{ title }}</h3>
      
      <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        <button 
          v-for="option in options" 
          :key="option" 
          @click="handleSelect(option)"
          :class="['w-full p-4 rounded-2xl text-left border-2 transition-all font-medium', 
                  modelValue === option || (option === 'Other' && isCustom) ? 'border-[#84a96b] bg-green-50 text-[#6d8b58]' : 'border-slate-100 text-slate-600']"
        >
          <div class="flex justify-between items-center">
            <span>{{ option }}</span>
            <i v-if="modelValue === option" class="fas fa-check-circle"></i>
          </div>
        </button>

        <div v-if="showOtherInput" class="mt-4">
          <input 
            v-model="customText" 
            type="text" 
            placeholder="Please specify..." 
            class="w-full p-4 rounded-2xl border-2 border-[#84a96b] bg-slate-50 focus:outline-none text-slate-700"
            @input="handleCustomInput"
          />
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-slate-100 flex gap-4">
        <button @click="handleCancel" class="flex-1 py-3 text-slate-400 font-bold active:scale-95 transition-all">
          Cancel
        </button>
        <button 
          v-if="modelValue" 
          @click="handleSubmit" 
          class="flex-1 py-3 bg-[#84a96b] text-white rounded-xl font-bold shadow-lg shadow-green-100 active:scale-95 transition-all"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  show: Boolean,
  title: String,
  options: { type: Array, default: () => [] },
  modelValue: String
})

const emit = defineEmits(['update:modelValue', 'close', 'submit'])

const customText = ref('')
const isCustom = ref(false)

const showOtherInput = computed(() => isCustom.value || (props.modelValue && !props.options.includes(props.modelValue)))

const handleSelect = (option) => {
  if (option === 'Other') {
    isCustom.value = true
    emit('update:modelValue', '')
  } else {
    isCustom.value = false
    emit('update:modelValue', option)
  }
}

const handleCustomInput = () => { emit('update:modelValue', customText.value) }

const handleCancel = () => {
  isCustom.value = false; customText.value = '';
  emit('close');
}

const handleSubmit = () => {
  // emit 'submit' so HomeView knows to save to MySQL
  emit('submit');
  // still emit 'close' so RegisterView can move to the next step
  emit('close');
}

watch(() => props.show, (newVal) => { if (!newVal) { isCustom.value = false; customText.value = ''; } })
</script>