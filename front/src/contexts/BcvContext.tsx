import React, { createContext, useContext, useState, useEffect } from 'react';
import bcvService from '../services/bcvService';

interface BcvContextType {
  rate: number;
  lastUpdate: string | null;
  loading: boolean;
  error: string | null;
  refreshRate: () => Promise<void>;
}

const BcvContext = createContext<BcvContextType | undefined>(undefined);

export const BcvProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rate, setRate] = useState<number>(70.00); // Valor inicial 2025
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRate = async () => {
    try {
      setLoading(true);
      const newRate = await bcvService.getRate();
      const updateTime = await bcvService.getLastUpdate();
      setRate(newRate);
      setLastUpdate(updateTime);
      setError(null);
    } catch (err) {
      setError('Error al obtener la tasa del BCV');
      console.error('Error al obtener la tasa del BCV:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRate();
    // Actualizar cada hora
    const interval = setInterval(fetchRate, 3600000);
    return () => clearInterval(interval);
  }, []);

  const refreshRate = async () => {
    await fetchRate();
  };

  return (
    <BcvContext.Provider value={{ rate, lastUpdate, loading, error, refreshRate }}>
      {children}
    </BcvContext.Provider>
  );
};

export const useBcv = () => {
  const context = useContext(BcvContext);
  if (context === undefined) {
    throw new Error('useBcv debe ser usado dentro de un BcvProvider');
  }
  return context;
};

export default BcvContext; 