import { useState } from 'react';
import { Tag, X, Check, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { usePromoCodes } from '../../hooks/usePromoCodes';

interface PromoCodeInputProps {
  className?: string;
  compact?: boolean;
}

export function PromoCodeInput({ className = '', compact = false }: PromoCodeInputProps) {
  const [code, setCode] = useState('');
  const { validateAndApply, error, clear, appliedCode } = usePromoCodes();

  const handleApply = () => {
    validateAndApply(code);
    if (!error) {
      setCode('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  if (appliedCode && !compact) {
    return null; // Show AppliedPromoCode component instead
  }

  return (
    <div className={`${className}`}>
      {!compact && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Tag className="w-4 h-4 inline mr-2" />
          Promo Code
        </label>
      )}
      
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              if (error) clear();
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter code"
            className={`uppercase ${error ? 'border-red-500' : ''}`}
            disabled={!!appliedCode}
          />
          
          {error && !compact && (
            <div className="absolute left-0 right-0 -bottom-6 flex items-start gap-1 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <Button
          onClick={handleApply}
          disabled={!code.trim() || !!appliedCode}
          size={compact ? 'sm' : 'md'}
          className="whitespace-nowrap"
        >
          {compact ? 'Apply' : 'Apply Code'}
        </Button>
      </div>

      {error && compact && (
        <div className="mt-2 flex items-start gap-1 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export function AppliedPromoCode({ className = '', onRemove }: { className?: string; onRemove?: () => void }) {
  const { appliedCode, remove, discountAmount } = usePromoCodes();

  if (!appliedCode) return null;

  const handleRemove = () => {
    remove();
    onRemove?.();
  };

  return (
    <div className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-green-700 dark:text-green-300">
                {appliedCode.code}
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-800 px-2 py-0.5 rounded">
                Applied
              </span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-0.5">
              You&apos;re saving ${discountAmount.toFixed(2)}!
            </p>
          </div>
        </div>

        <button
          onClick={handleRemove}
          className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors p-1"
          aria-label="Remove promo code"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
