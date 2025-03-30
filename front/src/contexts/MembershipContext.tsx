import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface MembershipContextType {
  isPremium: boolean;
  membershipType: 'monthly' | 'annual' | null;
  expirationDate: string | null;
  applyDiscount: (price: number) => number;
  checkMembershipStatus: () => Promise<void>;
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

export const MembershipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, userId } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [membershipType, setMembershipType] = useState<'monthly' | 'annual' | null>(null);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);

  const checkMembershipStatus = async () => {
    if (!isAuthenticated || !userId) {
      setIsPremium(false);
      setMembershipType(null);
      setExpirationDate(null);
      return;
    }

    try {
      const response = await fetch('/api/membership/status');
      const data = await response.json();

      if (data.success) {
        setIsPremium(data.isActive);
        setMembershipType(data.type);
        setExpirationDate(data.expirationDate);
      } else {
        setIsPremium(false);
        setMembershipType(null);
        setExpirationDate(null);
      }
    } catch (error) {
      console.error('Error checking membership status:', error);
      setIsPremium(false);
      setMembershipType(null);
      setExpirationDate(null);
    }
  };

  const applyDiscount = (price: number): number => {
    if (isPremium) {
      // Aplicar 50% de descuento para miembros premium
      return price * 0.5;
    }
    return price;
  };

  useEffect(() => {
    checkMembershipStatus();
  }, [isAuthenticated, userId]);

  const value = {
    isPremium,
    membershipType,
    expirationDate,
    applyDiscount,
    checkMembershipStatus,
  };

  return (
    <MembershipContext.Provider value={value}>
      {children}
    </MembershipContext.Provider>
  );
};

export const useMembership = () => {
  const context = useContext(MembershipContext);
  if (context === undefined) {
    throw new Error('useMembership must be used within a MembershipProvider');
  }
  return context;
};

export default MembershipContext; 