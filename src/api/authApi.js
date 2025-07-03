import api from './axiosConfig';

export const authApi = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 
            error.message || 
            'Registration failed. Please try again.';
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      console.log(response.data,"response")
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 
            error.message || 
            'Login failed. Please check your credentials.';
    }
  },


  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

};