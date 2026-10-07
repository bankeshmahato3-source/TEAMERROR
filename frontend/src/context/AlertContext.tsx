import React, { createContext, useContext, useState } from 'react';
import { RiskLevel } from '../types';

export interface ToastAlert {
  id: string;
  paymentId?: string;
  amount?: number;
  riskScore?: number;
  severity: RiskLevel | 'INFO';
  message: string;
  action?: string;
  timestamp: string;
}

interface AlertContextType {
  alerts: ToastAlert[];
  triggerAlert: (alert: Omit<ToastAlert, 'id' | 'timestamp'>) => void;
  removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<ToastAlert[]>([]);

  const triggerAlert = (alertData: Omit<ToastAlert, 'id' | 'timestamp'>) => {
    const newAlert: ToastAlert = {
      ...alertData,
      id: `alert_${Date.now()}_${Math.random()}`,
      timestamp: new Date().toLocaleTimeString(),
    };

    setAlerts((prev) => [newAlert, ...prev.slice(0, 4)]); // Keep max 5 visible toasts

    // Auto dismiss after 7 seconds
    setTimeout(() => {
      removeAlert(newAlert.id);
    }, 7000);
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AlertContext.Provider value={{ alerts, triggerAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
