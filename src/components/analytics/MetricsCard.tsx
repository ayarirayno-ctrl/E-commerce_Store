import { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  iconColor?: string;
  prefix?: string;
  suffix?: string;
}

export function MetricsCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'text-primary-500',
  prefix = '',
  suffix = ''
}: MetricsCardProps) {
  const changeColor = change && change > 0 ? 'text-green-600' : change && change < 0 ? 'text-red-600' : 'text-gray-600';
  const changeIcon = change && change > 0 ? '↑' : change && change < 0 ? '↓' : '';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          {change !== undefined && (
            <p className={`text-sm font-medium mt-2 ${changeColor}`}>
              {changeIcon} {Math.abs(change).toFixed(1)}% vs last period
            </p>
          )}
        </div>
        <div className={`${iconColor} bg-opacity-10 p-3 rounded-full`}>
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
