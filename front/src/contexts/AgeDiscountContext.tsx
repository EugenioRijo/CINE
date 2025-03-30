import React, { createContext, useContext, useState, useEffect } from 'react';
import ageService from '../services/ageService';

interface AgeDiscountContextType {
  isElderly: boolean;
  setIsElderly: (value: boolean) => void;
  applyDiscount: (amount: number) => number;
  discountPercentage: number;
  isLoading: boolean;
}

const AgeDiscountContext = createContext<AgeDiscountContextType>({
  isElderly: false,
  setIsElderly: () => {},
  applyDiscount: (amount: number) => amount,
  discountPercentage: 15,
  isLoading: true
});

export const useAgeDiscount = () => useContext(AgeDiscountContext);

export const AgeDiscountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isElderly, setIsElderly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const discountPercentage = 15; // 15% de descuento para mayores de edad

  useEffect(() => {
    const checkAgeStatus = async () => {
      try {
        const { isElderly: elderly } = await ageService.checkAge();
        setIsElderly(elderly);
      } catch (error) {
        console.error('Error checking age status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAgeStatus();
  }, []);

  const applyDiscount = (amount: number) => {
    if (isElderly) {
      const discount = amount * (discountPercentage / 100);
      return amount - discount;
    }
    return amount;
  };

  return (
    <AgeDiscountContext.Provider 
      value={{ 
        isElderly, 
        setIsElderly, 
        applyDiscount,
        discountPercentage,
        isLoading
      }}
    >
      {children}
    </AgeDiscountContext.Provider>
  );
}; 