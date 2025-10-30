// Analytics Types for Dashboard

export interface SalesMetric {
  date: string; // ISO date
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  image: string;
  views: number;
}

export interface UserMetric {
  date: string;
  newUsers: number;
  returningUsers: number;
  totalUsers: number;
}

export interface PromoPerformance {
  code: string;
  uses: number;
  revenue: number;
  discount: number;
  conversionRate: number;
}

export interface CategorySales {
  category: string;
  revenue: number;
  orders: number;
  percentage: number;
}

export interface AnalyticsOverview {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  cartAbandonmentRate: number;
  totalUsers: number;
  
  // Period comparison (vs previous period)
  revenueChange: number; // percentage
  ordersChange: number;
  aovChange: number;
  conversionChange: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export type DateRange = '7d' | '30d' | '90d' | '1y' | 'all';

export type ChartType = 'line' | 'bar' | 'pie' | 'area';

export interface AnalyticsFilters {
  dateRange: DateRange;
  category?: string;
  sortBy?: 'revenue' | 'orders' | 'views';
}

export interface AnalyticsState {
  overview: AnalyticsOverview;
  salesData: SalesMetric[];
  topProducts: TopProduct[];
  userMetrics: UserMetric[];
  promoPerformance: PromoPerformance[];
  categorySales: CategorySales[];
  filters: AnalyticsFilters;
  loading: boolean;
  error: string | null;
}
