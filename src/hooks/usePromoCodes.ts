import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  applyPromoCode,
  removePromoCode,
  setPromoCodeError,
  clearPromoCodeError,
  selectAppliedPromoCode,
  selectPromoCodeError,
  selectValidationLoading,
  selectActivePromoCodes,
  validatePromoCode as validatePromoCodeUtil,
  calculateDiscount,
  incrementPromoCodeUsage,
} from '../store/slices/promoCodesSlice';
import { selectCartItems, selectCartTotal } from '../store/slices/cartSlice';
import type { AppliedPromoCode, PromoCode } from '../types/promoCode';
import type { CartItem } from '../types/cart';

export function usePromoCodes() {
  const dispatch = useAppDispatch();
  
  const appliedCode = useAppSelector(selectAppliedPromoCode);
  const error = useAppSelector(selectPromoCodeError);
  const loading = useAppSelector(selectValidationLoading);
  const activeCodes = useAppSelector(selectActivePromoCodes);
  const cartItems = useAppSelector(selectCartItems) as CartItem[];
  const cartTotal = useAppSelector(selectCartTotal) as number;

  const validateAndApply = useCallback(
    (code: string) => {
      dispatch(clearPromoCodeError());

      if (!code.trim()) {
        dispatch(setPromoCodeError('Please enter a promo code'));
        return;
      }

      // Find promo code
      const promoCode = activeCodes.find(
        (p: PromoCode) => p.code.toLowerCase() === code.toLowerCase()
      );

      if (!promoCode) {
        dispatch(setPromoCodeError('Invalid promo code'));
        return;
      }

      // Validate promo code
      const validation = validatePromoCodeUtil(promoCode, cartItems, cartTotal);

      if (!validation.isValid) {
        dispatch(setPromoCodeError(validation.error || 'Invalid promo code'));
        return;
      }

      // Apply promo code
      const appliedPromo: AppliedPromoCode = {
        code: promoCode.code,
        discountAmount: validation.discountAmount || 0,
        discountType: promoCode.discountType,
        appliedAt: new Date().toISOString(),
      };

      dispatch(applyPromoCode(appliedPromo));
      dispatch(incrementPromoCodeUsage(promoCode.code));
    },
    [dispatch, activeCodes, cartItems, cartTotal]
  );

  const remove = useCallback(() => {
    dispatch(removePromoCode());
  }, [dispatch]);

  const clear = useCallback(() => {
    dispatch(clearPromoCodeError());
  }, [dispatch]);

  const getDiscount = useCallback(() => {
    return calculateDiscount(appliedCode);
  }, [appliedCode]);

  const getFinalTotal = useCallback(() => {
    const discount = getDiscount();
    return Math.max(0, cartTotal - discount);
  }, [cartTotal, getDiscount]);

  return {
    appliedCode,
    error,
    loading,
    activeCodes,
    validateAndApply,
    remove,
    clear,
    getDiscount,
    getFinalTotal,
    hasDiscount: appliedCode !== null,
    discountAmount: getDiscount(),
  };
}
