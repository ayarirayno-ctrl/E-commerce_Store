export type LoyaltyLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface LoyaltyPoints {
  total: number;
  level: LoyaltyLevel;
  pointsToNextLevel: number;
  lifetimePoints: number;
}

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  type: 'earn' | 'redeem';
  points: number;
  reason: string;
  orderId?: string;
  createdAt: Date;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  level: LoyaltyLevel[];
  type: 'discount' | 'free_shipping' | 'gift' | 'upgrade';
  value: number; // percentage or fixed amount
  icon: string;
  available: boolean;
}

export interface LoyaltyLevelConfig {
  level: LoyaltyLevel;
  name: string;
  minPoints: number;
  maxPoints: number | null;
  color: string;
  benefits: string[];
  multiplier: number; // points multiplier
}

export const LOYALTY_LEVELS: LoyaltyLevelConfig[] = [
  {
    level: 'bronze',
    name: 'Bronze',
    minPoints: 0,
    maxPoints: 499,
    color: 'from-amber-700 to-amber-900',
    benefits: [
      'Earn 10 points per €1 spent',
      'Birthday bonus: 50 points',
      'Early access to sales',
    ],
    multiplier: 1,
  },
  {
    level: 'silver',
    name: 'Silver',
    minPoints: 500,
    maxPoints: 1999,
    color: 'from-gray-400 to-gray-600',
    benefits: [
      'Earn 15 points per €1 spent',
      'Free shipping on orders €50+',
      'Birthday bonus: 100 points',
      'Exclusive Silver offers',
    ],
    multiplier: 1.5,
  },
  {
    level: 'gold',
    name: 'Gold',
    minPoints: 2000,
    maxPoints: 4999,
    color: 'from-yellow-400 to-yellow-600',
    benefits: [
      'Earn 20 points per €1 spent',
      'Free shipping on all orders',
      'Birthday bonus: 200 points',
      'Priority customer service',
      'Exclusive Gold offers',
    ],
    multiplier: 2,
  },
  {
    level: 'platinum',
    name: 'Platinum',
    minPoints: 5000,
    maxPoints: null,
    color: 'from-purple-400 to-purple-600',
    benefits: [
      'Earn 25 points per €1 spent',
      'Free express shipping',
      'Birthday bonus: 500 points',
      'VIP customer service',
      'Exclusive Platinum offers',
      'Personal shopping assistant',
    ],
    multiplier: 2.5,
  },
];

export const LOYALTY_REWARDS: LoyaltyReward[] = [
  {
    id: 'discount-5',
    title: '€5 Discount',
    description: 'Get €5 off your next order',
    pointsCost: 100,
    level: ['bronze', 'silver', 'gold', 'platinum'],
    type: 'discount',
    value: 5,
    icon: '💰',
    available: true,
  },
  {
    id: 'discount-10',
    title: '€10 Discount',
    description: 'Get €10 off your next order',
    pointsCost: 200,
    level: ['silver', 'gold', 'platinum'],
    type: 'discount',
    value: 10,
    icon: '💵',
    available: true,
  },
  {
    id: 'discount-20',
    title: '€20 Discount',
    description: 'Get €20 off your next order',
    pointsCost: 400,
    level: ['gold', 'platinum'],
    type: 'discount',
    value: 20,
    icon: '💎',
    available: true,
  },
  {
    id: 'free-shipping',
    title: 'Free Shipping',
    description: 'Free standard shipping on any order',
    pointsCost: 50,
    level: ['bronze', 'silver', 'gold', 'platinum'],
    type: 'free_shipping',
    value: 0,
    icon: '📦',
    available: true,
  },
  {
    id: 'express-shipping',
    title: 'Free Express Shipping',
    description: 'Free express delivery (1-2 days)',
    pointsCost: 150,
    level: ['silver', 'gold', 'platinum'],
    type: 'free_shipping',
    value: 0,
    icon: '🚀',
    available: true,
  },
  {
    id: 'birthday-gift',
    title: 'Birthday Gift',
    description: 'Special gift for your birthday',
    pointsCost: 300,
    level: ['gold', 'platinum'],
    type: 'gift',
    value: 0,
    icon: '🎁',
    available: true,
  },
];
