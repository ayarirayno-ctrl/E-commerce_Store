import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  TrendingUp, 
  Gift, 
  Star, 
  Zap, 
  Crown,
  Calendar,
  ArrowRight,
  Lock
} from 'lucide-react';
import { useLoyalty } from '../../hooks/useLoyalty';
import { LoyaltyReward } from '../../types/loyalty';
import Button from '../ui/Button';
import { LoadingAnimation } from '../common/LoadingAnimation';

export const LoyaltyDashboard: React.FC = () => {
  const {
    points,
    transactions,
    loading,
    redeemPoints,
    getLevelRewards,
    canRedeemReward,
    getCurrentLevelConfig,
    getProgressPercentage,
    LOYALTY_LEVELS,
  } = useLoyalty();

  if (loading) {
    return <LoadingAnimation size="lg" text="Loading your rewards..." variant="pulse" />;
  }

  const currentLevel = getCurrentLevelConfig();
  const progressPercentage = getProgressPercentage();
  const levelRewards = getLevelRewards();
  const nextLevel = LOYALTY_LEVELS.find(l => l.minPoints > currentLevel.minPoints);

  const handleRedeemReward = (reward: LoyaltyReward) => {
    const success = redeemPoints(reward.pointsCost, `Redeemed: ${reward.title}`);
    if (success) {
      alert(`✅ Successfully redeemed ${reward.title}! Check your email for the code.`);
    } else {
      alert('❌ Not enough points to redeem this reward.');
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'bronze': return <Award className="h-8 w-8" />;
      case 'silver': return <Star className="h-8 w-8" />;
      case 'gold': return <Crown className="h-8 w-8" />;
      case 'platinum': return <Zap className="h-8 w-8" />;
      default: return <Award className="h-8 w-8" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-900 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Loyalty Rewards</h1>
            <p className="text-primary-100">Earn points, unlock rewards, enjoy exclusive benefits</p>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Gift className="h-16 w-16 text-primary-200" />
          </motion.div>
        </div>

        {/* Current Level Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${currentLevel.color} text-white`}>
                {getLevelIcon(currentLevel.level)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentLevel.name} Member</h2>
                <p className="text-primary-100">
                  {points.total.toLocaleString()} points • {points.lifetimePoints.toLocaleString()} lifetime
                </p>
              </div>
            </div>
          </div>

          {/* Progress to Next Level */}
          {nextLevel && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary-100">Progress to {nextLevel.name}</span>
                <span className="font-semibold">
                  {points.pointsToNextLevel.toLocaleString()} points to go
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-white to-primary-200 rounded-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Total Points</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {points.total.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Gift className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Lifetime Points</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {points.lifetimePoints.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Transactions</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {transactions.length}
          </p>
        </motion.div>
      </div>

      {/* Benefits */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Crown className="h-6 w-6 text-primary-600" />
          Your {currentLevel.name} Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentLevel.benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="mt-0.5 text-green-600 dark:text-green-400">✓</div>
              <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Available Rewards */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Gift className="h-6 w-6 text-primary-600" />
          Available Rewards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {levelRewards.map((reward, index) => {
            const canRedeem = canRedeemReward(reward);
            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative p-4 rounded-xl border-2 transition-all
                  ${canRedeem
                    ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 opacity-60'
                  }
                `}
              >
                {!canRedeem && (
                  <div className="absolute top-2 right-2">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                )}
                
                <div className="text-4xl mb-3">{reward.icon}</div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                  {reward.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {reward.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                    {reward.pointsCost} points
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleRedeemReward(reward)}
                    disabled={!canRedeem}
                  >
                    Redeem
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* All Levels Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary-600" />
          Loyalty Levels
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {LOYALTY_LEVELS.map((level, index) => {
            const isCurrent = level.level === currentLevel.level;
            const isUnlocked = points.lifetimePoints >= level.minPoints;
            
            return (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative p-4 rounded-xl border-2
                  ${isCurrent
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                    : isUnlocked
                    ? 'border-gray-300 dark:border-gray-600'
                    : 'border-gray-200 dark:border-gray-700 opacity-50'
                  }
                `}
              >
                {isCurrent && (
                  <div className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    CURRENT
                  </div>
                )}
                
                <div className={`p-3 rounded-xl bg-gradient-to-br ${level.color} text-white w-fit mb-3`}>
                  {getLevelIcon(level.level)}
                </div>
                
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{level.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {level.minPoints.toLocaleString()}
                  {level.maxPoints ? ` - ${level.maxPoints.toLocaleString()}` : '+'} points
                </p>
                
                <div className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 font-medium">
                  {isUnlocked ? 'Unlocked' : 'Locked'}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {transaction.reason}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`
                  font-bold text-lg
                  ${transaction.type === 'earn' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                  }
                `}>
                  {transaction.type === 'earn' ? '+' : ''}{transaction.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyDashboard;
