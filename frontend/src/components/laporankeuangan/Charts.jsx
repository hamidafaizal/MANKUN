import React from 'react';

// Komponen placeholder untuk Bar Chart bulanan
export const MonthlyBarChart = ({ data }) => {
  return (
    <div className="h-64 w-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center rounded-lg">
      <p className="text-gray-500 dark:text-gray-400">Monthly Bar Chart Placeholder</p>
    </div>
  );
};

// Komponen placeholder untuk Pie Chart kategori
export const CategoryPieChart = ({ data }) => {
  return (
    <div className="h-64 w-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center rounded-lg">
      <p className="text-gray-500 dark:text-gray-400">Category Pie Chart Placeholder</p>
    </div>
  );
};
