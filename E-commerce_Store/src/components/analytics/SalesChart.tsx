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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {getLabel()}
      </h3>
      
      <div className="space-y-3">
        {data.map((metric, index) => {
          const value = getValue(metric);
          const percentage = (value / maxValue) * 100;
          
          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {formatDate(metric.date)}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatValue(value)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

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
