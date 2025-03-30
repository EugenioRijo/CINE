import axios from 'axios';

interface BcvRate {
  rate: number;
  lastUpdate: string;
}

class BcvService {
  private static instance: BcvService;
  private cachedRate: BcvRate | null = null;
  private readonly CACHE_DURATION = 3600000; // 1 hora en milisegundos
  private readonly BCV_URL = 'https://www.bcv.org.ve/';

  private constructor() {}

  public static getInstance(): BcvService {
    if (!BcvService.instance) {
      BcvService.instance = new BcvService();
    }
    return BcvService.instance;
  }

  public async getRate(): Promise<number> {
    try {
      // Si tenemos una tasa en caché y no ha expirado, la devolvemos
      if (this.cachedRate && 
          Date.now() - new Date(this.cachedRate.lastUpdate).getTime() < this.CACHE_DURATION) {
        return this.cachedRate.rate;
      }

      // Si no hay caché o expiró, obtenemos la nueva tasa del BCV
      const response = await axios.get('http://localhost:5000/api/bcv/current-rate', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const rate = response.data.rate;

      // Actualizamos el caché
      this.cachedRate = {
        rate,
        lastUpdate: new Date().toISOString()
      };

      return rate;
    } catch (error) {
      console.error('Error al obtener la tasa del BCV:', error);
      // Si hay un error, intentamos obtener la tasa del backend
      try {
        const backupResponse = await axios.get('http://localhost:5000/api/bcv/rate');
        return backupResponse.data.rate;
      } catch (backupError) {
        console.error('Error al obtener la tasa de respaldo:', backupError);
        return 70.00; // Tasa actualizada al 30 de marzo 2025
      }
    }
  }

  public async getLastUpdate(): Promise<string | null> {
    if (this.cachedRate) {
      return this.cachedRate.lastUpdate;
    }
    return null;
  }

  public async convertToVEF(usdAmount: number): Promise<number> {
    const rate = await this.getRate();
    return usdAmount * rate;
  }

  public async convertToUSD(vefAmount: number): Promise<number> {
    const rate = await this.getRate();
    return vefAmount / rate;
  }
}

export default BcvService.getInstance(); 