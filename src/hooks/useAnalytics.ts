import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  selectAnalyticsOverview,
  selectSalesData,
  selectTopProducts,
  selectUserMetrics,
  selectPromoPerformance,
  selectCategorySales,
  selectAnalyticsFilters,
  selectAnalyticsLoading,
  selectAnalyticsError,
  setAnalyticsData,
  setDateRange,
  setFilters
} from '../store/slices/analyticsSlice';
import type { DateRange, AnalyticsFilters } from '../types/analytics';

export function useAnalytics() {
  const dispatch = useAppDispatch();
  
  const overview = useAppSelector(selectAnalyticsOverview);
  const salesData = useAppSelector(selectSalesData);
  const topProducts = useAppSelector(selectTopProducts);
  const userMetrics = useAppSelector(selectUserMetrics);
  const promoPerformance = useAppSelector(selectPromoPerformance);
  const categorySales = useAppSelector(selectCategorySales);
  const filters = useAppSelector(selectAnalyticsFilters);
  const loading = useAppSelector(selectAnalyticsLoading);
  const error = useAppSelector(selectAnalyticsError);

  const loadAnalyticsData = async () => {
    try {
      // In a real app, this would fetch from an API
      const response = await import('../data/analytics.json');
      dispatch(setAnalyticsData(response.default));
    } catch (err) {
      console.error('Failed to load analytics data:', err);
    }
  };

  // Load analytics data on mount
  useEffect(() => {
    loadAnalyticsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateDateRange = (range: DateRange) => {
    dispatch(setDateRange(range));
    // In a real app, would trigger data refetch
  };

  const updateFilters = (newFilters: AnalyticsFilters) => {
    dispatch(setFilters(newFilters));
    // In a real app, would trigger data refetch
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return {
    // Data
    overview,
    salesData,
    topProducts,
    userMetrics,
    promoPerformance,
    categorySales,
    filters,
    loading,
    error,
    
    // Actions
    updateDateRange,
    updateFilters,
    refreshData: loadAnalyticsData,
    
    // Helpers
    formatCurrency,
    formatPercentage,
    formatNumber
  };
}
