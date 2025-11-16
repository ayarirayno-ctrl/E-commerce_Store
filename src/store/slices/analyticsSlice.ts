import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AnalyticsState, AnalyticsFilters, DateRange, SalesMetric } from '../../types/analytics';

const initialState: AnalyticsState = {
  overview: {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    cartAbandonmentRate: 0,
    totalUsers: 0,
    revenueChange: 0,
    ordersChange: 0,
    aovChange: 0,
    conversionChange: 0
  },
  salesData: [],
  topProducts: [],
  userMetrics: [],
  promoPerformance: [],
  categorySales: [],
  filters: {
    dateRange: '7d',
    sortBy: 'revenue'
  },
  loading: false,
  error: null
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setAnalyticsData: (state, action: PayloadAction<Partial<AnalyticsState>>) => {
      return { ...state, ...action.payload, loading: false, error: null };
    },
    
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.filters.dateRange = action.payload;
    },
    
    setFilters: (state, action: PayloadAction<AnalyticsFilters>) => {
      state.filters = action.payload;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setAnalyticsData,
  setDateRange,
  setFilters,
  setLoading,
  setError,
  clearError
} = analyticsSlice.actions;

// Selectors (using any to bypass circular type dependency)
export const selectAnalyticsOverview = (state: { analytics: AnalyticsState }) => 
  state.analytics.overview;

export const selectSalesData = (state: { analytics: AnalyticsState }) => 
  state.analytics.salesData;

export const selectTopProducts = (state: { analytics: AnalyticsState }) => 
  state.analytics.topProducts;

export const selectUserMetrics = (state: { analytics: AnalyticsState }) => 
  state.analytics.userMetrics;

export const selectPromoPerformance = (state: { analytics: AnalyticsState }) => 
  state.analytics.promoPerformance;

export const selectCategorySales = (state: { analytics: AnalyticsState }) => 
  state.analytics.categorySales;

export const selectAnalyticsFilters = (state: { analytics: AnalyticsState }) => 
  state.analytics.filters;

export const selectAnalyticsLoading = (state: { analytics: AnalyticsState }) => 
  state.analytics.loading;

export const selectAnalyticsError = (state: { analytics: AnalyticsState }) => 
  state.analytics.error;

// Computed selectors
export const selectTotalRevenue = (state: { analytics: AnalyticsState }) => 
  state.analytics.salesData.reduce((sum: number, day: SalesMetric) => sum + day.revenue, 0);

export const selectTotalOrders = (state: { analytics: AnalyticsState }) => 
  state.analytics.salesData.reduce((sum: number, day: SalesMetric) => sum + day.orders, 0);

export const selectAverageOrderValue = (state: { analytics: AnalyticsState }) => {
  const totalRevenue = selectTotalRevenue(state);
  const totalOrders = selectTotalOrders(state);
  return totalOrders > 0 ? totalRevenue / totalOrders : 0;
};

export const selectTopProductsByRevenue = (state: { analytics: AnalyticsState }) => 
  [...state.analytics.topProducts].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

export const selectTopProductsBySales = (state: { analytics: AnalyticsState }) => 
  [...state.analytics.topProducts].sort((a, b) => b.sales - a.sales).slice(0, 5);

export default analyticsSlice.reducer;
