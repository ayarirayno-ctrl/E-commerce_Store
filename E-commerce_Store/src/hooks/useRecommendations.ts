import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types/product';
import { UserBrowsingHistory, RecommendationScore, DEFAULT_RECOMMENDATION_CONFIG } from '../types/recommendations';
import { useAuth } from '../contexts/AuthContext';

const BROWSING_HISTORY_KEY = 'user_browsing_history';
const MAX_HISTORY_ITEMS = 50;

export const useRecommendations = () => {
  const { user } = useAuth();
  const [browsingHistory, setBrowsingHistory] = useState<UserBrowsingHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // Load browsing history from localStorage
  useEffect(() => {
    if (!user) {
      setBrowsingHistory([]);
      setLoading(false);
      return;
    }

    const historyKey = `${BROWSING_HISTORY_KEY}_${user.id}`;
    const savedHistory = localStorage.getItem(historyKey);

    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setBrowsingHistory(parsed.map((h: UserBrowsingHistory) => ({
          ...h,
          viewedAt: new Date(h.viewedAt),
        })));
      } catch (e) {
        console.error('Error loading browsing history:', e);
      }
    }

    setLoading(false);
  }, [user]);

  // Save browsing history to localStorage
  const saveBrowsingHistory = useCallback((history: UserBrowsingHistory[]) => {
    if (!user) return;

    const historyKey = `${BROWSING_HISTORY_KEY}_${user.id}`;
    localStorage.setItem(historyKey, JSON.stringify(history));
  }, [user]);

  // Track product view
  const trackProductView = useCallback((product: Product) => {
    if (!user) return;

    const newEntry: UserBrowsingHistory = {
      productId: product.id,
      viewedAt: new Date(),
      category: product.category,
      price: product.price,
    };

    // Remove duplicates and add to front
    const filteredHistory = browsingHistory.filter(h => h.productId !== product.id);
    const newHistory = [newEntry, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);

    setBrowsingHistory(newHistory);
    saveBrowsingHistory(newHistory);
  }, [user, browsingHistory, saveBrowsingHistory]);

  // Calculate similarity score between two products
  const calculateSimilarity = useCallback((product1: Product, product2: Product): number => {
    let score = 0;

    // Same category (40% weight)
    if (product1.category === product2.category) {
      score += 0.4;
    }

    // Similar price range (30% weight)
    const priceDiff = Math.abs(product1.price - product2.price);
    const avgPrice = (product1.price + product2.price) / 2;
    const priceScore = Math.max(0, 1 - (priceDiff / avgPrice));
    score += priceScore * 0.3;

    // Similar rating (20% weight)
    if (product1.rating && product2.rating) {
      const ratingDiff = Math.abs(product1.rating - product2.rating);
      const ratingScore = Math.max(0, 1 - (ratingDiff / 5));
      score += ratingScore * 0.2;
    }

    // In stock bonus (10% weight)
    if (product1.stock > 0 && product2.stock > 0) {
      score += 0.1;
    }

    return score;
  }, []);

  // Get similar products based on a given product
  const getSimilarProducts = useCallback((
    currentProduct: Product,
    allProducts: Product[],
    maxResults = DEFAULT_RECOMMENDATION_CONFIG.maxRecommendations
  ): Product[] => {
    const scoredProducts: RecommendationScore[] = allProducts
      .filter(p => p.id !== currentProduct.id && p.stock > 0)
      .map(product => ({
        product,
        score: calculateSimilarity(currentProduct, product),
        reason: 'similar' as const,
      }))
      .filter(item => item.score >= DEFAULT_RECOMMENDATION_CONFIG.similarityThreshold)
      .sort((a, b) => b.score - a.score);

    return scoredProducts.slice(0, maxResults).map(item => item.product);
  }, [calculateSimilarity]);

  // Get trending products (most viewed in recent history)
  const getTrendingProducts = useCallback((
    allProducts: Product[],
    maxResults = DEFAULT_RECOMMENDATION_CONFIG.maxRecommendations
  ): Product[] => {
    // Count views per product in last 7 days
    const viewCounts = new Map<number, number>();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - DEFAULT_RECOMMENDATION_CONFIG.trendingDays);

    browsingHistory.forEach(entry => {
      if (entry.viewedAt >= sevenDaysAgo) {
        const count = viewCounts.get(entry.productId) || 0;
        viewCounts.set(entry.productId, count + 1);
      }
    });

    // Get products sorted by view count
    const productViewPairs: Array<{ product: Product; count: number }> = allProducts
      .filter(p => p.stock > 0)
      .map(product => ({ product, count: viewCounts.get(product.id) || 0 }))
      .sort((a, b) => b.count - a.count);

    // If not enough trending products, add high-rated products
    const trending = productViewPairs
      .filter(item => item.count > 0)
      .slice(0, maxResults)
      .map(item => item.product);

    if (trending.length < maxResults) {
      const highRated = allProducts
        .filter(p => p.stock > 0 && !trending.includes(p))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, maxResults - trending.length);

      trending.push(...highRated);
    }

    return trending.slice(0, maxResults);
  }, [browsingHistory]);

  // Get personalized recommendations based on browsing history
  const getPersonalizedRecommendations = useCallback((
    allProducts: Product[],
    maxResults = DEFAULT_RECOMMENDATION_CONFIG.maxRecommendations
  ): Product[] => {
    if (browsingHistory.length === 0) {
      // No history, return trending products
      return getTrendingProducts(allProducts, maxResults);
    }

    // Get recently viewed products
    const recentlyViewed = browsingHistory
      .slice(0, 5)
      .map(h => allProducts.find(p => p.id === h.productId))
      .filter((p): p is Product => p !== undefined);

    if (recentlyViewed.length === 0) {
      return getTrendingProducts(allProducts, maxResults);
    }

    // Get categories and price ranges from history
    const categories = new Set(browsingHistory.map(h => h.category));
    const avgPrice = browsingHistory.reduce((sum, h) => sum + h.price, 0) / browsingHistory.length;

    // Score all products
    const scoredProducts: RecommendationScore[] = allProducts
      .filter(p => p.stock > 0)
      .filter(p => !recentlyViewed.some(rv => rv.id === p.id))
      .map(product => {
        let score = 0;

        // Category match (40% weight)
        if (categories.has(product.category)) {
          score += 0.4;
        }

        // Price range match (30% weight)
        const priceDiff = Math.abs(product.price - avgPrice);
        const priceScore = Math.max(0, 1 - (priceDiff / avgPrice));
        score += priceScore * 0.3;

        // Rating (20% weight)
        if (product.rating) {
          score += (product.rating / 5) * 0.2;
        }

        // Popularity bonus (10% weight)
        const views = browsingHistory.filter(h => h.productId === product.id).length;
        score += Math.min(views / 10, 1) * 0.1;

        return {
          product,
          score,
          reason: 'category' as const,
        };
      })
      .sort((a, b) => b.score - a.score);

    return scoredProducts.slice(0, maxResults).map(item => item.product);
  }, [browsingHistory, getTrendingProducts]);

  // Get "You may also like" recommendations for product page
  const getYouMayAlsoLike = useCallback((
    currentProduct: Product,
    allProducts: Product[],
    maxResults = DEFAULT_RECOMMENDATION_CONFIG.maxRecommendations
  ): Product[] => {
    // Mix of similar products and personalized recommendations
    const similar = getSimilarProducts(currentProduct, allProducts, Math.ceil(maxResults * 0.7));
    const personalized = getPersonalizedRecommendations(
      allProducts.filter(p => !similar.includes(p) && p.id !== currentProduct.id),
      Math.floor(maxResults * 0.3)
    );

    return [...similar, ...personalized].slice(0, maxResults);
  }, [getSimilarProducts, getPersonalizedRecommendations]);

  // Clear browsing history
  const clearHistory = useCallback(() => {
    if (!user) return;

    const historyKey = `${BROWSING_HISTORY_KEY}_${user.id}`;
    localStorage.removeItem(historyKey);
    setBrowsingHistory([]);
  }, [user]);

  return {
    browsingHistory,
    loading,
    trackProductView,
    getSimilarProducts,
    getTrendingProducts,
    getPersonalizedRecommendations,
    getYouMayAlsoLike,
    clearHistory,
  };
};
