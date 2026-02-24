import { defineStore } from 'pinia'
import { Preferences } from '@capacitor/preferences'
import API_BASE_URL from '../config'

const server_url = `${API_BASE_URL}/api/history/`;

export const useUserStore = defineStore('user', {
  state: () => ({
    isRegistered: false,
    user: {
      email: '',
      name: '',
      student_id: '',
      ship: '',
      level: '',
      grade: null,
      class_group: '',
      face_descriptor: null
    },
    history: []
  }),
  actions: {
    async loadUserData() {
      const { value } = await Preferences.get({ key: 'user_session' })
      if (value) {
        this.user = JSON.parse(value)
        this.isRegistered = true
        this.fetchHistory()
      }
    },

    async saveUser(userData) {
      // This will include face_descriptor if it comes from the server login
      this.user = userData 
      this.isRegistered = true
      await Preferences.set({
        key: 'user_session',
        value: JSON.stringify(this.user)
      })
    },

    //Update only face data without full login
    async updateFaceDescriptor(descriptorString) {
      this.user.face_descriptor = descriptorString;
      await Preferences.set({
        key: 'user_session',
        value: JSON.stringify(this.user)
      });
    },

    async logout() {
      await Preferences.remove({ key: 'user_session' })
      this.isRegistered = false
      this.user = { 
        email: '', name: '', student_id: '', ship: '', 
        level: '', grade: null, class_group: '', 
        face_descriptor: null // RESET The face descriptor on logout as well
      }
      this.history = []
    },

    async fetchHistory() {
      if (!this.user.student_id) return
      try {
        const res = await fetch(`${server_url}${this.user.student_id}`)
        if (res.ok) {
          this.history = await res.json()
        }
      } catch (e) { 
        console.error("History offline or Connection Error") 
      }
    }
  }
})