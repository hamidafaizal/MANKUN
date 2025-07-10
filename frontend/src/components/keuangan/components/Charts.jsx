import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
// DIUBAH: Mengimpor helper dari path baru
import { formatCurrency } from '../data';

// Komponen untuk Bar Chart bulanan yang fungsional
export const MonthlyBarChart = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value)} />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          <Bar dataKey="income" name="Pemasukan" fill="#16a34a" />
          <Bar dataKey="expenses" name="Pengeluaran" fill="#dc2626" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Komponen untuk Pie Chart kategori yang fungsional
export const CategoryPieChart = ({ data }) => {
  const COLORS = ['#0284c7', '#ea580c', '#65a30d', '#ca8a04', '#9333ea'];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={110}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};