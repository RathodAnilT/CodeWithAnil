import axiosInstance from './axiosConfig';

/**
 * API wrapper with logging for debugging
 */
const API = {
  /**
   * Perform a GET request
   * @param {string} url - The URL to request
   * @param {Object} params - Query parameters (optional)
   * @returns {Promise} - The API data
   */
  async get(url, params = {}) {
    try {
      console.log(`🚀 API GET: ${url}`);
      const response = await axiosInstance.get(url, { params });
      console.log(`✅ API Response (${url}):`, response.data);
      
      // Check for nested data structure and return the most usable format
      if (response.data && typeof response.data === 'object') {
        // If response has a data property that contains an array of problems or similar
        if (response.data.data && Array.isArray(response.data.data.problems)) {
          console.log('Returning nested problems array');
          return response.data.data.problems;
        }
        // If response has a direct array in the data property
        else if (response.data.data && Array.isArray(response.data.data)) {
          console.log('Returning data array');
          return response.data.data;
        }
      }
      
      // Default case - return the data as is
      return response.data;
    } catch (error) {
      console.error(`❌ API Error (${url}):`, error);
      
      // Extract relevant error details
      const errorDetails = {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
      
      console.error('Error details:', errorDetails);
      
      // Re-throw the error to be handled by the component
      throw error;
    }
  },

  /**
   * Perform a POST request
   * @param {string} url - The URL to request
   * @param {Object} data - The data to send
   * @param {Object} config - Additional axios config (optional)
   * @returns {Promise} - The API data
   */
  async post(url, data = {}, config = {}) {
    try {
      console.log(`🚀 API POST: ${url}`, data);
      const response = await axiosInstance.post(url, data, config);
      console.log(`✅ API Response (${url}):`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ API Error (${url}):`, error);
      throw error;
    }
  },

  /**
   * Perform a PUT request
   * @param {string} url - The URL to request
   * @param {Object} data - The data to send
   * @param {Object} config - Additional axios config (optional)
   * @returns {Promise} - The API data
   */
  async put(url, data = {}, config = {}) {
    try {
      console.log(`🚀 API PUT: ${url}`, data);
      const response = await axiosInstance.put(url, data, config);
      console.log(`✅ API Response (${url}):`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ API Error (${url}):`, error);
      throw error;
    }
  },

  /**
   * Perform a DELETE request
   * @param {string} url - The URL to request
   * @param {Object} config - Additional axios config (optional)
   * @returns {Promise} - The API data
   */
  async delete(url, config = {}) {
    try {
      console.log(`🚀 API DELETE: ${url}`);
      const response = await axiosInstance.delete(url, config);
      console.log(`✅ API Response (${url}):`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ API Error (${url}):`, error);
      throw error;
    }
  }
};

export default API; 