<template>
  <div class="relative group">
    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <slot name="icon"></slot>
    </div>
    
    <input 
      :type="type" 
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#84a96b] focus:bg-white focus:outline-none transition-all duration-200 placeholder:text-gray-400"
    />
  </div>
</template>

<script setup>
defineProps(['modelValue', 'placeholder', 'type']);
defineEmits(['update:modelValue']);
</script>