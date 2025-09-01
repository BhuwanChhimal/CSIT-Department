import { create } from 'zustand'
import axios from 'axios'

const useAuthStore = create((set, get) => ({
  isAuthenticated: !!localStorage.getItem('token'),
  userRole: localStorage.getItem('userRole'),
  profile: null,
  isLoading: false,
  error: null,

  login: async (token, role) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userRole', role)
    set({ isAuthenticated: true, userRole: role })
    
    // Fetch profile immediately after login
    try {
      const response = await axios.get('http://localhost:5002/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Profile response after login:', response.data);
      set({ profile: response.data });
    } catch (error) {
      console.error('Profile fetch error after login:', error);
      // Don't set error here as login was successful, just profile fetch failed
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    set({ isAuthenticated: false, userRole: null, profile: null })
  },

  fetchProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const token = localStorage.getItem('token');
      
      if (!token) {
        set({ isLoading: false, error: 'No token found' });
        return;
      }

      const response = await axios.get('http://localhost:5002/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Profile response:', response.data);
      set({ profile: response.data, isLoading: false });
    } catch (error) {
      console.error('Profile fetch error:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch profile', 
        isLoading: false 
      });
    }
  }
}))

export default useAuthStore