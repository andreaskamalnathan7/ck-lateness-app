import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: () => import('../views/LoginView.vue') },
    { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue') },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }     
    },
    { 
      path: '/history', 
      name: 'history',
      component: () => import('../views/HistoryView.vue'),
      meta: { requiresAuth: true }
     },
    { 
      path: '/profile', 
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
     },
    { 
      path: '/admin', 
      name: 'admin',
      component: () => import('../views/AdminView.vue')
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const store = useUserStore()
  
  if (!store.isRegistered) {
    await store.loadUserData()
  }
  if (to.path === '/admin') {
    return next()
  }

  const isAuthPath = to.meta.requiresAuth
  const isGuestPath = to.path === '/' || to.path === '/register'
  if (isAuthPath && !store.isRegistered) {
    return next('/')
  }
  if (isGuestPath && store.isRegistered) {
    return next('/home')
  }
  next()
})

export default router
