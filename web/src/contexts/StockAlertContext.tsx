'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StockAlertModal } from '@/components/modals/StockAlertModal';

interface ProductStockInfo {
  name: string;
  availableStock?: number;
  requestedQuantity?: number;
  message?: string;
}

interface StockAlertConfig {
  type: 'warning' | 'error' | 'info';
  productName?: string; // Para compatibilidad hacia atrás
  products?: ProductStockInfo[]; // Para múltiples productos
  availableStock?: number;
  requestedQuantity?: number;
  message?: string;
}

interface StockAlertContextType {
  showWarning: (productName: string, availableStock: number, requestedQuantity?: number) => void;
  showError: (productName: string, message?: string) => void;
  showInfo: (productName: string, message: string) => void;
  showMultipleProductsError: (products: ProductStockInfo[], message?: string) => void;
  showMultipleProductsWarning: (products: ProductStockInfo[], message?: string) => void;
  closeAlert: () => void;
  isOpen: boolean;
}

const StockAlertContext = createContext<StockAlertContextType | undefined>(undefined);

interface StockAlertProviderProps {
  children: ReactNode;
}

export const StockAlertProvider: React.FC<StockAlertProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<StockAlertConfig | null>(null);

  const showAlert = (alertConfig: StockAlertConfig) => {
    setConfig(alertConfig);
    setIsOpen(true);
  };

  const showWarning = (productName: string, availableStock: number, requestedQuantity?: number) => {
    showAlert({
      type: 'warning',
      productName,
      availableStock,
      requestedQuantity,
    });
  };

  const showError = (productName: string, message?: string) => {
    showAlert({
      type: 'error',
      productName,
      message,
    });
  };

  const showInfo = (productName: string, message: string) => {
    showAlert({
      type: 'info',
      productName,
      message,
    });
  };

  const showMultipleProductsError = (products: ProductStockInfo[], message?: string) => {
    showAlert({
      type: 'error',
      products,
      message,
    });
  };

  const showMultipleProductsWarning = (products: ProductStockInfo[], message?: string) => {
    showAlert({
      type: 'warning',
      products,
      message,
    });
  };

  const closeAlert = () => {
    setIsOpen(false);
    setConfig(null);
  };

  return (
    <StockAlertContext.Provider
      value={{
        showWarning,
        showError,
        showInfo,
        showMultipleProductsError,
        showMultipleProductsWarning,
        closeAlert,
        isOpen,
      }}
    >
      {children}
      
      {/* Modal global - se renderiza una sola vez en toda la app */}
      {config && (
        <StockAlertModal
          isOpen={isOpen}
          onClose={closeAlert}
          type={config.type}
          productName={config.productName}
          products={config.products}
          availableStock={config.availableStock}
          requestedQuantity={config.requestedQuantity}
          message={config.message}
        />
      )}
    </StockAlertContext.Provider>
  );
};

// Hook para usar el contexto fácilmente
export const useStockAlertGlobal = (): StockAlertContextType => {
  const context = useContext(StockAlertContext);
  if (!context) {
    throw new Error('useStockAlertGlobal debe ser usado dentro de StockAlertProvider');
  }
  return context;
};
