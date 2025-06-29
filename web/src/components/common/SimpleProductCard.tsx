'use client';

import React from 'react';

interface SimpleProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

const SimpleProductCard: React.FC<SimpleProductCardProps> = ({ product }) => {
  const handleClick = () => {
    console.log('🔥 SIMPLE CARD BUTTON CLICKED!');
    alert('Simple card button clicked!');
  };

  return (
    <div className="border p-4 rounded-lg bg-white shadow-md">
      <h3 className="text-lg font-bold mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-4">S/ {product.price}</p>
      
      {/* Multiple test buttons */}
      <div className="space-y-2">
        <button 
          onClick={handleClick}
          className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded"
        >
          TEST BUTTON 1
        </button>
        
        <button 
          onClick={() => {
            console.log('🔥 BUTTON 2 CLICKED!');
            alert('Button 2 clicked!');
          }}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        >
          TEST BUTTON 2
        </button>
        
        <div 
          onClick={() => {
            console.log('🔥 DIV CLICKED!');
            alert('Div clicked!');
          }}
          className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded cursor-pointer text-center"
        >
          TEST DIV
        </div>
      </div>
    </div>
  );
};

export default SimpleProductCard;
