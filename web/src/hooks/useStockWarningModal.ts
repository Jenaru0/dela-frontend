'use client';

import { useState, useCallback } from 'react';

export interface StockAlertConfig {
  type: 'warning' | 'error' | 'outOfStock';
  productName: string;
  availableStock?: number;
  requestedQuantity?: number;
  customMessage?: string;
}

export const useStockWarningModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<StockAlertConfig | null>(null);

  const showStockWarning = useCallback((alertConfig: StockAlertConfig) => {
    setConfig(alertConfig);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Opcional: limpiar config después de cerrar
    setTimeout(() => setConfig(null), 300); // Delay para animación
  }, []);

  // Métodos de conveniencia para casos comunes
  const showLimitedStock = useCallback((productName: string, availableStock: number, requestedQuantity?: number) => {
    showStockWarning({
      type: 'warning',
      productName,
      availableStock,
      requestedQuantity
    });
  }, [showStockWarning]);

  const showOutOfStock = useCallback((productName: string, customMessage?: string) => {
    showStockWarning({
      type: 'outOfStock',
      productName,
      availableStock: 0,
      customMessage
    });
  }, [showStockWarning]);

  const showStockError = useCallback((productName: string, errorMessage: string) => {
    showStockWarning({
      type: 'error',
      productName,
      customMessage: errorMessage
    });
  }, [showStockWarning]);

  return {
    isOpen,
    config,
    showStockWarning,
    showLimitedStock,
    showOutOfStock,
    showStockError,
    closeModal
  };
};
