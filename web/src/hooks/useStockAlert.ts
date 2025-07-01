import { useState } from 'react';

interface StockAlertConfig {
  type: 'warning' | 'error' | 'info';
  productName: string;
  availableStock?: number;
  requestedQuantity?: number;
  message?: string;
}

export const useStockAlert = () => {
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

  const closeAlert = () => {
    setIsOpen(false);
    setConfig(null);
  };

  return {
    isOpen,
    config,
    showAlert,
    showWarning,
    showError,
    showInfo,
    closeAlert,
  };
};
