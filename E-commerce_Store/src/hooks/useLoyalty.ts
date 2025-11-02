import { useState, useEffect, useCallback } from 'react';
import { 
  LoyaltyPoints, 
  LoyaltyTransaction, 
  LoyaltyLevel,
  LoyaltyReward,
  LOYALTY_LEVELS,
  LOYALTY_REWARDS 
} from '../types/loyalty';
import { useAuth } from '../contexts/AuthContext';

const POINTS_PER_EURO = 10;

export const useLoyalty = () => {
  const { user } = useAuth();
  const [points, setPoints] = useState<LoyaltyPoints>({
    total: 0,
    level: 'bronze',
    pointsToNextLevel: 500,
    lifetimePoints: 0,
  });
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Load loyalty data from localStorage
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const savedPoints = localStorage.getItem(`loyalty_points_${user.id}`);
    const savedTransactions = localStorage.getItem(`loyalty_transactions_${user.id}`);

    if (savedPoints) {
      try {
        setPoints(JSON.parse(savedPoints));
      } catch (e) {
        console.error('Error loading loyalty points:', e);
      }
    }

    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions);
        setTransactions(parsed.map((t: LoyaltyTransaction) => ({
          ...t,
          createdAt: new Date(t.createdAt),
        })));
      } catch (e) {
        console.error('Error loading loyalty transactions:', e);
      }
    }

    setLoading(false);
  }, [user]);

  // Save to localStorage
  const saveData = useCallback((newPoints: LoyaltyPoints, newTransactions: LoyaltyTransaction[]) => {
    if (!user) return;
    
    localStorage.setItem(`loyalty_points_${user.id}`, JSON.stringify(newPoints));
    localStorage.setItem(`loyalty_transactions_${user.id}`, JSON.stringify(newTransactions));
  }, [user]);

  // Calculate level from points
  const calculateLevel = (totalPoints: number): LoyaltyLevel => {
    if (totalPoints >= 5000) return 'platinum';
    if (totalPoints >= 2000) return 'gold';
    if (totalPoints >= 500) return 'silver';
    return 'bronze';
  };

  // Calculate points to next level
  const calculatePointsToNextLevel = (totalPoints: number, currentLevel: LoyaltyLevel): number => {
    const currentLevelConfig = LOYALTY_LEVELS.find(l => l.level === currentLevel);
    if (!currentLevelConfig || currentLevelConfig.maxPoints === null) {
      return 0; // Already at max level
    }
    return currentLevelConfig.maxPoints - totalPoints + 1;
  };

  // Get current level config
  const getCurrentLevelConfig = useCallback(() => {
    return LOYALTY_LEVELS.find(l => l.level === points.level) || LOYALTY_LEVELS[0];
  }, [points.level]);

  // Earn points
  const earnPoints = useCallback((amount: number, reason: string, orderId?: string) => {
    if (!user) return 0;

    const levelConfig = getCurrentLevelConfig();
    const pointsEarned = Math.floor(amount * POINTS_PER_EURO * levelConfig.multiplier);

    const transaction: LoyaltyTransaction = {
      id: `txn_${Date.now()}`,
      userId: user.id,
      type: 'earn',
      points: pointsEarned,
      reason,
      orderId,
      createdAt: new Date(),
    };

    const newTotal = points.total + pointsEarned;
    const newLifetime = points.lifetimePoints + pointsEarned;
    const newLevel = calculateLevel(newLifetime);
    const newPointsToNext = calculatePointsToNextLevel(newTotal, newLevel);

    const newPoints: LoyaltyPoints = {
      total: newTotal,
      level: newLevel,
      pointsToNextLevel: newPointsToNext,
      lifetimePoints: newLifetime,
    };

    const newTransactions = [transaction, ...transactions];

    setPoints(newPoints);
    setTransactions(newTransactions);
    saveData(newPoints, newTransactions);

    return pointsEarned;
  }, [user, points, transactions, saveData, getCurrentLevelConfig]);

  // Redeem points
  const redeemPoints = useCallback((pointsCost: number, reason: string): boolean => {
    if (!user) return false;
    if (points.total < pointsCost) return false;

    const transaction: LoyaltyTransaction = {
      id: `txn_${Date.now()}`,
      userId: user.id,
      type: 'redeem',
      points: -pointsCost,
      reason,
      createdAt: new Date(),
    };

    const newTotal = points.total - pointsCost;
    const newLevel = calculateLevel(points.lifetimePoints);
    const newPointsToNext = calculatePointsToNextLevel(newTotal, newLevel);

    const newPoints: LoyaltyPoints = {
      ...points,
      total: newTotal,
      level: newLevel,
      pointsToNextLevel: newPointsToNext,
    };

    const newTransactions = [transaction, ...transactions];

    setPoints(newPoints);
    setTransactions(newTransactions);
    saveData(newPoints, newTransactions);

    return true;
  }, [user, points, transactions, saveData]);

  // Get available rewards
  const getAvailableRewards = useCallback((): LoyaltyReward[] => {
    return LOYALTY_REWARDS.filter(reward => 
      reward.available && 
      reward.level.includes(points.level) &&
      points.total >= reward.pointsCost
    );
  }, [points]);

  // Get all rewards for current level
  const getLevelRewards = useCallback((): LoyaltyReward[] => {
    return LOYALTY_REWARDS.filter(reward => 
      reward.available && 
      reward.level.includes(points.level)
    );
  }, [points.level]);

  // Check if user can redeem a reward
  const canRedeemReward = useCallback((reward: LoyaltyReward): boolean => {
    return points.total >= reward.pointsCost && reward.level.includes(points.level);
  }, [points]);

  // Get progress percentage to next level
  const getProgressPercentage = useCallback((): number => {
    const currentLevelConfig = getCurrentLevelConfig();
    const nextLevelConfig = LOYALTY_LEVELS.find(
      l => l.minPoints > currentLevelConfig.minPoints
    );

    if (!nextLevelConfig) return 100; // Already at max level

    const pointsInCurrentLevel = points.total - currentLevelConfig.minPoints;
    const pointsNeededForNextLevel = nextLevelConfig.minPoints - currentLevelConfig.minPoints;

    return Math.min(100, (pointsInCurrentLevel / pointsNeededForNextLevel) * 100);
  }, [points, getCurrentLevelConfig]);

  return {
    points,
    transactions,
    loading,
    earnPoints,
    redeemPoints,
    getAvailableRewards,
    getLevelRewards,
    canRedeemReward,
    getCurrentLevelConfig,
    getProgressPercentage,
    LOYALTY_LEVELS,
  };
};

export default useLoyalty;
