import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { SalesMetric } from '../../types/analytics';

interface SalesChartProps {
  data: SalesMetric[];
  type?: 'revenue' | 'orders' | 'aov';
}

export function SalesChart({ data, type = 'revenue' }: SalesChartProps) {
  const getValue = (metric: SalesMetric) => {
    switch (type) {
      case 'revenue':
        return metric.revenue;
      case 'orders':
        return metric.orders;
      case 'aov':
        return metric.averageOrderValue;
    }
  };

  const maxValue = Math.max(...data.map(getValue));
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatValue = (value: number) => {
    if (type === 'revenue' || type === 'aov') {
      return `$${value.toFixed(0)}`;
    }
    return value.toString();
  };

  const getLabel = () => {
    switch (type) {
      case 'revenue':
        return 'Daily Revenue';
      case 'orders':
        return 'Daily Orders';
      case 'aov':
        return 'Average Order Value';
    }
  };

  const getDataKey = () => {
    switch (type) {
      case 'revenue':
        return 'revenue';
      case 'orders':
        return 'orders';
      case 'aov':
        return 'averageOrderValue';
    }
  };

  // Format data for Recharts
  const chartData = data.map(metric => ({
    ...metric,
    formattedDate: formatDate(metric.date),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">{payload[0].payload.formattedDate}</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatValue(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {getLabel()}
      </h3>
      
      {/* Recharts Line Chart */}
      <ResponsiveContainer width="100%" height={300}>
        {type === 'revenue' || type === 'aov' ? (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`color${type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="formattedDate" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => type === 'revenue' || type === 'aov' ? `$${value}` : value}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey={getDataKey()} 
              stroke="#3b82f6" 
              fillOpacity={1}
              fill={`url(#color${type})`}
              strokeWidth={2}
            />
          </AreaChart>
        ) : (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="formattedDate" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey={getDataKey()} 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatValue(data.reduce((sum, m) => sum + getValue(m), 0))}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Average</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatValue(data.reduce((sum, m) => sum + getValue(m), 0) / data.length)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Peak</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatValue(maxValue)}
          </p>
        </div>
      </div>
    </div>
  );
}
