import React, { createContext, useContext, useState, useEffect } from 'react';
import bcvService from '../services/bcvService';

interface PriceContextType {
  // Membresía
  membershipPriceUSD: number;
  membershipPriceVEF: number | null;
  
  // Entradas
  regularTicketUSD: number;
  vipTicketUSD: number;
  childTicketUSD: number;
  seniorTicketUSD: number;
  
  // Combos
  smallComboUSD: number;
  mediumComboUSD: number;
  largeComboUSD: number;
  
  // Snacks individuales
  popcornSmallUSD: number;
  popcornMediumUSD: number;
  popcornLargeUSD: number;
  sodaSmallUSD: number;
  sodaMediumUSD: number;
  sodaLargeUSD: number;
  hotDogUSD: number;
  nachosUSD: number;
  
  // Precios en VEF
  regularTicketVEF: number | null;
  vipTicketVEF: number | null;
  childTicketVEF: number | null;
  seniorTicketVEF: number | null;
  smallComboVEF: number | null;
  mediumComboVEF: number | null;
  largeComboVEF: number | null;
  
  // Funciones
  formatPrice: (amount: number) => string;
  formatUSD: (amount: number) => string;
  isLoading: boolean;
}

const defaultPrices = {
  // Membresía (precio mensual)
  membershipPriceUSD: 5.00, // Precio realista para membresía mensual
  
  // Entradas
  regularTicketUSD: 3.50, // Entrada regular
  vipTicketUSD: 5.00,    // Entrada VIP
  childTicketUSD: 2.50,  // Entrada niños
  seniorTicketUSD: 2.50, // Entrada adultos mayores
  
  // Combos
  smallComboUSD: 4.00,   // Combo pequeño (Cotufas pequeñas + Refresco pequeño)
  mediumComboUSD: 5.50,  // Combo mediano (Cotufas medianas + Refresco mediano + HotDog)
  largeComboUSD: 7.00,   // Combo grande (Cotufas grandes + 2 Refrescos medianos + 2 HotDogs)
  
  // Snacks individuales
  popcornSmallUSD: 1.50,
  popcornMediumUSD: 2.00,
  popcornLargeUSD: 2.50,
  sodaSmallUSD: 1.00,
  sodaMediumUSD: 1.50,
  sodaLargeUSD: 2.00,
  hotDogUSD: 2.00,
  nachosUSD: 2.50,
};

const PriceContext = createContext<PriceContextType>({
  ...defaultPrices,
  membershipPriceVEF: null,
  regularTicketVEF: null,
  vipTicketVEF: null,
  childTicketVEF: null,
  seniorTicketVEF: null,
  smallComboVEF: null,
  mediumComboVEF: null,
  largeComboVEF: null,
  formatPrice: () => '',
  formatUSD: () => '',
  isLoading: true,
});

export const usePrices = () => useContext(PriceContext);

export const PriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pricesVEF, setPricesVEF] = useState<{ [key: string]: number | null }>({
    membershipPriceVEF: null,
    regularTicketVEF: null,
    vipTicketVEF: null,
    childTicketVEF: null,
    seniorTicketVEF: null,
    smallComboVEF: null,
    mediumComboVEF: null,
    largeComboVEF: null,
    popcornSmallVEF: null,
    popcornMediumVEF: null,
    popcornLargeVEF: null,
    sodaSmallVEF: null,
    sodaMediumVEF: null,
    sodaLargeVEF: null,
    hotDogVEF: null,
    nachosVEF: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updatePrices = async () => {
      try {
        const updatedPrices: { [key: string]: number } = {};
        
        // Convertir todos los precios USD a VEF
        for (const [key, value] of Object.entries(defaultPrices)) {
          const vefKey = key.replace('USD', 'VEF');
          updatedPrices[vefKey] = await bcvService.convertToVEF(value);
        }
        
        setPricesVEF(updatedPrices);
      } catch (error) {
        console.error('Error al actualizar los precios:', error);
      } finally {
        setIsLoading(false);
      }
    };

    updatePrices();
    // Actualizar precios cada hora
    const interval = setInterval(updatePrices, 3600000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatUSD = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <PriceContext.Provider
      value={{
        ...defaultPrices,
        membershipPriceVEF: pricesVEF.membershipPriceVEF,
        regularTicketVEF: pricesVEF.regularTicketVEF,
        vipTicketVEF: pricesVEF.vipTicketVEF,
        childTicketVEF: pricesVEF.childTicketVEF,
        seniorTicketVEF: pricesVEF.seniorTicketVEF,
        smallComboVEF: pricesVEF.smallComboVEF,
        mediumComboVEF: pricesVEF.mediumComboVEF,
        largeComboVEF: pricesVEF.largeComboVEF,
        formatPrice,
        formatUSD,
        isLoading,
      }}
    >
      {children}
    </PriceContext.Provider>
  );
}; 