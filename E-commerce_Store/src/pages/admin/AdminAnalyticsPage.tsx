import { DollarSign, ShoppingCart, TrendingUp, Users, CreditCard, Tag } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { MetricsCard } from '../../components/analytics/MetricsCard';
import { SalesChart } from '../../components/analytics/SalesChart';
import { TopProducts } from '../../components/analytics/TopProducts';
import Loading from '../../components/ui/Loading';
import type { PromoPerformance, CategorySales } from '../../types/analytics';

export default function AdminAnalyticsPage() {
  const {
    overview,
    salesData,
    topProducts,
    promoPerformance,
    categorySales,
    loading,
    formatCurrency
  } = useAnalytics();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your store&apos;s performance and insights
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Revenue"
          value={formatCurrency(overview.totalRevenue)}
          change={overview.revenueChange}
          icon={DollarSign}
          iconColor="text-green-600"
        />
        <MetricsCard
          title="Total Orders"
          value={overview.totalOrders}
          change={overview.ordersChange}
          icon={ShoppingCart}
          iconColor="text-blue-600"
        />
        <MetricsCard
          title="Average Order Value"
          value={formatCurrency(overview.averageOrderValue)}
          change={overview.aovChange}
          icon={CreditCard}
          iconColor="text-purple-600"
        />
        <MetricsCard
          title="Total Users"
          value={overview.totalUsers.toLocaleString()}
          icon={Users}
          iconColor="text-orange-600"
        />
      </div>

      {/* Conversion & Abandonment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricsCard
          title="Conversion Rate"
          value={overview.conversionRate.toFixed(2)}
          suffix="%"
          change={overview.conversionChange}
          icon={TrendingUp}
          iconColor="text-green-500"
        />
        <MetricsCard
          title="Cart Abandonment Rate"
          value={overview.cartAbandonmentRate.toFixed(1)}
          suffix="%"
          icon={ShoppingCart}
          iconColor="text-red-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={salesData} type="revenue" />
        <SalesChart data={salesData} type="orders" />
      </div>

      {/* Top Products */}
      <TopProducts products={topProducts} sortBy="revenue" limit={8} />

      {/* Promo Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Tag className="w-5 h-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Promo Code Performance
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Code</th>
                <th className="px-4 py-2 text-right font-medium text-gray-700 dark:text-gray-300">Uses</th>
                <th className="px-4 py-2 text-right font-medium text-gray-700 dark:text-gray-300">Revenue</th>
                <th className="px-4 py-2 text-right font-medium text-gray-700 dark:text-gray-300">Discount</th>
                <th className="px-4 py-2 text-right font-medium text-gray-700 dark:text-gray-300">Conversion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {promoPerformance.map((promo: PromoPerformance) => (
                <tr key={promo.code} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3">
                    <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {promo.code}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                    {promo.uses}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                    {formatCurrency(promo.revenue)}
                  </td>
                  <td className="px-4 py-3 text-right text-red-600 dark:text-red-400">
                    -{formatCurrency(promo.discount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {promo.conversionRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Sales */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Sales by Category
        </h3>

        <div className="space-y-4">
          {categorySales.map((category: CategorySales) => (
            <div key={category.category}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {category.category}
                </span>
                <div className="text-right">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(category.revenue)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">
                    ({category.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {category.orders} orders
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
