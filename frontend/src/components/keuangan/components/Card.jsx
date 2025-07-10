import React from 'react';

// Komponen Card yang dapat digunakan kembali
const Card = ({ children, className }) => (
  <div className={`bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 ${className || ''}`}>
    {children}
  </div>
);

export default Card;