<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-[#84a96b] flex justify-around items-center p-4 text-white shadow-lg z-50">
    <router-link to="/home" class="nav-item">
      <i class="fas fa-qrcode text-xl"></i>
      <span class="text-[10px] mt-1">Scan</span>
    </router-link>
    <router-link to="/history" class="nav-item">
      <i class="fas fa-clock-rotate-left text-xl"></i>
      <span class="text-[10px] mt-1">History</span>
    </router-link>
    <router-link to="/profile" class="nav-item">
      <i class="fas fa-user text-xl"></i>
      <span class="text-[10px] mt-1">Profile</span>
    </router-link>
  </nav>
</template>

<style scoped>
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.6;
  transition: opacity 0.2s ease;
  appearance: none;
  -webkit-appearance: none;
}

.router-link-active {
  opacity: 1 !important;
  font-weight: bold;
}
</style>
