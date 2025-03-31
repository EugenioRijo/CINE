import axios from 'axios';

interface BCVResponse {
  usd: {
    rate: number;
    date: string;
  };
}

export const getBCVRate = async (): Promise<BCVResponse> => {
  try {
    // Usamos un proxy CORS para evitar problemas de CORS con la API del BCV
    const response = await axios.get('https://bcv-api.deno.dev/v1/exchange-rates');
    return {
      usd: {
        rate: response.data.usd,
        date: new Date().toLocaleDateString('es-VE')
      }
    };
  } catch (error) {
    console.error('Error fetching BCV rate:', error);
    // Tasa por defecto en caso de error
    return {
      usd: {
        rate: 70.00, // Tasa por defecto
        date: new Date().toLocaleDateString('es-VE')
      }
    };
  }
}; 