import { create } from 'zustand'
import axios from 'axios'

const useAuthStore = create((set) => ({
  isAuthenticated: !!localStorage.getItem('token'),
  userRole: localStorage.getItem('userRole'),
  profile: null,
  isLoading: false,
  error: null,

  login: (token, role) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userRole', role)
    set({ isAuthenticated: true, userRole: role })
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    set({ isAuthenticated: false, userRole: null })
  },
  fetchProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      // Add auth token to request
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/auth/getUserProfile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Profile response:', response.data); // Debug log
      set({ profile: response.data, isLoading: false });
    } catch (error) {
      console.error('Profile fetch error:', error); // Debug log
      set({ 
        error: error.response?.data?.message || 'Failed to fetch profile', 
        isLoading: false 
      });
    }
  }
}))

export default useAuthStore