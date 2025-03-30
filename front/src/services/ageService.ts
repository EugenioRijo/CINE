import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const checkAge = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/auth/check-age`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error checking age:', error);
    return { isElderly: false };
  }
};

const ageService = {
  checkAge
};

export default ageService; 