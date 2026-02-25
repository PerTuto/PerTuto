"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './use-auth';
import { getTenantById } from '@/lib/firebase/services';
import { Tenant } from '@/lib/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/client-app';

interface SettingsContextType {
  timeFormat: '12h' | '24h';
  currency: string;
  loading: boolean;
  tenant: Tenant | null;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { tenantId } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) {
      setTenant(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const tenantRef = doc(firestore, 'tenants', tenantId);
    
    const unsubscribe = onSnapshot(tenantRef, (docSnap) => {
      if (docSnap.exists()) {
        setTenant(docSnap.data() as Tenant);
      } else {
        setTenant(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Failed to fetch tenant settings:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [tenantId]);

  const value = {
    timeFormat: tenant?.settings?.timeFormat || '12h',
    currency: tenant?.settings?.currency || 'USD',
    loading,
    tenant
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
