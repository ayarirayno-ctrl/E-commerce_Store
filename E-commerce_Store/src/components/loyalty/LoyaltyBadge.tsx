import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Crown, Zap } from 'lucide-react';
import { useLoyalty } from '../../hooks/useLoyalty';
import { Link } from 'react-router-dom';

export const LoyaltyBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { points, getCurrentLevelConfig, loading } = useLoyalty();

  if (loading || !points) return null;

  const currentLevel = getCurrentLevelConfig();

  const getLevelIcon = () => {
    switch (currentLevel.level) {
      case 'bronze': return <Award className="h-4 w-4" />;
      case 'silver': return <Star className="h-4 w-4" />;
      case 'gold': return <Crown className="h-4 w-4" />;
      case 'platinum': return <Zap className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  return (
    <Link to="/profile?tab=loyalty">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full
          bg-gradient-to-r ${currentLevel.color}
          text-white text-sm font-medium
          shadow-sm hover:shadow-md transition-shadow
          cursor-pointer
          ${className}
        `}
      >
        {getLevelIcon()}
        <span>{currentLevel.name}</span>
        <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
          {points.total.toLocaleString()}
        </span>
      </motion.div>
    </Link>
  );
};

// Compact points display
export const LoyaltyPoints: React.FC = () => {
  const { points, loading } = useLoyalty();

  if (loading || !points) return null;

  return (
    <Link 
      to="/profile?tab=loyalty"
      className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
    >
      <Award className="h-4 w-4" />
      <span className="font-medium">{points.total}</span>
      <span className="text-gray-500 dark:text-gray-400">pts</span>
    </Link>
  );
};

export default LoyaltyBadge;
