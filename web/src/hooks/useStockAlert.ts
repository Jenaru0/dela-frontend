import { useState } from 'react';

interface ProductStockInfo {
  name: string;
  availableStock?: number;
  requestedQuantity?: number;
  message?: string;
}

interface StockAlertConfig {
  type: 'warning' | 'error' | 'info';
  productName?: string;
  products?: ProductStockInfo[];
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

  return {
    isOpen,
    config,
    showAlert,
    showWarning,
    showError,
    showInfo,
    showMultipleProductsError,
    showMultipleProductsWarning,
    closeAlert,
  };
};
