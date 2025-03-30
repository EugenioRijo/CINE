import React, { createContext, useContext, useState } from 'react';

interface EventDiscount {
  id: number;
  name: string;
  description: string;
  discountPercentage: number;
  conditions: {
    dayOfWeek?: number; // 0-6 (domingo-sábado)
    beforeTime?: string; // HH:mm formato 24h
    isActive: boolean;
  };
}

interface EventDiscountContextType {
  availableDiscounts: EventDiscount[];
  calculateEventDiscount: (amount: number, time?: Date) => {
    finalAmount: number;
    appliedDiscount: EventDiscount | null;
  };
}

const defaultDiscounts: EventDiscount[] = [
  {
    id: 1,
    name: 'Matiné Económica',
    description: '30% de descuento en todas las funciones antes de las 14:00, de lunes a viernes.',
    discountPercentage: 30,
    conditions: {
      beforeTime: '14:00',
      isActive: true
    }
  },
  {
    id: 2,
    name: 'Jueves de Parejas',
    description: '25% de descuento en todas las entradas los jueves.',
    discountPercentage: 25,
    conditions: {
      dayOfWeek: 4, // Jueves
      isActive: true
    }
  },
  {
    id: 3,
    name: 'Martes de Cine',
    description: '20% de descuento en todas las funciones los martes.',
    discountPercentage: 20,
    conditions: {
      dayOfWeek: 2, // Martes
      isActive: true
    }
  }
];

const EventDiscountContext = createContext<EventDiscountContextType>({
  availableDiscounts: [],
  calculateEventDiscount: () => ({ finalAmount: 0, appliedDiscount: null })
});

export const useEventDiscount = () => useContext(EventDiscountContext);

export const EventDiscountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [availableDiscounts] = useState<EventDiscount[]>(defaultDiscounts);

  const calculateEventDiscount = (amount: number, time: Date = new Date()): { finalAmount: number; appliedDiscount: EventDiscount | null } => {
    let maxDiscount: EventDiscount | null = null;
    let finalAmount = amount;

    for (const discount of availableDiscounts) {
      if (isDiscountApplicable(discount, time)) {
        if (!maxDiscount || discount.discountPercentage > maxDiscount.discountPercentage) {
          maxDiscount = discount;
        }
      }
    }

    if (maxDiscount) {
      finalAmount = amount * (1 - maxDiscount.discountPercentage / 100);
    }

    return {
      finalAmount,
      appliedDiscount: maxDiscount
    };
  };

  const isDiscountApplicable = (discount: EventDiscount, currentTime: Date): boolean => {
    const { conditions } = discount;
    
    // Verificar día de la semana si está especificado
    if (conditions.dayOfWeek !== undefined && 
        conditions.dayOfWeek !== currentTime.getDay()) {
      return false;
    }
    
    // Verificar hora si está especificada
    if (conditions.beforeTime) {
      const [hours, minutes] = conditions.beforeTime.split(':').map(Number);
      const limitTime = new Date(currentTime);
      limitTime.setHours(hours, minutes, 0);
      
      if (currentTime > limitTime) {
        return false;
      }
    }
    
    return conditions.isActive;
  };

  return (
    <EventDiscountContext.Provider value={{ availableDiscounts, calculateEventDiscount }}>
      {children}
    </EventDiscountContext.Provider>
  );
}; 