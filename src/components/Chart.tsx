import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface ChartData {
  name: string;
  penjualan: number;
  pengeluaran: number;
  laba: number;
  tanggal: string;
}

interface SalesChartProps {
  data: ChartData[];
  type?: 'line' | 'area' | 'bar';
}

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface SummaryPieChartProps {
  data: PieChartData[];
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: Rp {entry.value.toLocaleString('id-ID')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Sales Trend Chart
export const SalesChart: React.FC<SalesChartProps> = ({ data, type = 'line' }) => {
  const chartConfig = {
    line: {
      Component: LineChart,
      elements: (
        <>
          <Line 
            type="monotone" 
            dataKey="penjualan" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="pengeluaran" 
            stroke="#ef4444" 
            strokeWidth={3}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: '#ef4444', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="laba" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2 }}
          />
        </>
      )
    },
    area: {
      Component: AreaChart,
      elements: (
        <>
          <defs>
            <linearGradient id="colorPenjualan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorLaba" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="penjualan" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPenjualan)" 
          />
          <Area 
            type="monotone" 
            dataKey="pengeluaran" 
            stroke="#ef4444" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPengeluaran)" 
          />
          <Area 
            type="monotone" 
            dataKey="laba" 
            stroke="#10b981" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorLaba)" 
          />
        </>
      )
    },
    bar: {
      Component: BarChart,
      elements: (
        <>
          <Bar dataKey="penjualan" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} />
          <Bar dataKey="laba" fill="#10b981" radius={[4, 4, 0, 0]} />
        </>
      )
    }
  };

  const { Component, elements } = chartConfig[type];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Tren Keuangan 7 Hari Terakhir</h3>
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Penjualan</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Pengeluaran</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Laba</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <Component data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(value) => `${(value / 1000)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          {elements}
        </Component>
      </ResponsiveContainer>
    </div>
  );
};

// Summary Pie Chart
export const SummaryPieChart: React.FC<SummaryPieChartProps> = ({ data }) => {
  const RADIAN = Math.PI / 180;
  
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Distribusi Keuangan</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, '']}
            labelFormatter={(label) => `${label}`}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color, fontWeight: 'bold' }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Mini Chart for Cards
interface MiniChartProps {
  data: number[];
  color: string;
  type?: 'line' | 'area';
}

export const MiniChart: React.FC<MiniChartProps> = ({ data, color, type = 'area' }) => {
  const chartData = data.map((value, index) => ({
    value,
    index
  }));

  return (
    <ResponsiveContainer width="100%" height={60}>
      {type === 'area' ? (
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`miniGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill={`url(#miniGradient-${color})`}
            dot={false}
            activeDot={false}
          />
        </AreaChart>
      ) : (
        <LineChart data={chartData}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
        </LineChart>
      )}
    </ResponsiveContainer>
  );
};

// Chart Type Selector
interface ChartTypeSelectorProps {
  currentType: 'line' | 'area' | 'bar';
  onTypeChange: (type: 'line' | 'area' | 'bar') => void;
}

export const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({ 
  currentType, 
  onTypeChange 
}) => {
  const types = [
    { type: 'line' as const, icon: '📈', label: 'Line' },
    { type: 'area' as const, icon: '📊', label: 'Area' },
    { type: 'bar' as const, icon: '📋', label: 'Bar' }
  ];

  return (
    <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
      {types.map(({ type, icon, label }) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
            currentType === type
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <span className="mr-1">{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
};
