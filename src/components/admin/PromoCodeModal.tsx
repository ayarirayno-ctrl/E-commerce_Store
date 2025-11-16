import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../store';
import { addPromoCode, updatePromoCode } from '../../store/slices/promoCodesSlice';
import { X } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { PromoCode, DiscountType, PromoCodeStatus } from '../../types/promoCode';

interface PromoCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCode?: PromoCode | null;
}

export function PromoCodeModal({ isOpen, onClose, editingCode }: PromoCodeModalProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as DiscountType,
    discountValue: 0,
    startDate: '',
    endDate: '',
    minOrderValue: 0,
    maxDiscount: undefined as number | undefined,
    maxUses: undefined as number | undefined,
    status: 'active' as PromoCodeStatus
  });

  useEffect(() => {
    if (editingCode) {
      setFormData({
        code: editingCode.code,
        description: editingCode.description,
        discountType: editingCode.discountType,
        discountValue: editingCode.discountValue,
        startDate: editingCode.startDate.split('T')[0],
        endDate: editingCode.endDate.split('T')[0],
        minOrderValue: editingCode.minOrderValue || 0,
        maxDiscount: editingCode.maxDiscount,
        maxUses: editingCode.maxUses,
        status: editingCode.status
      });
    } else {
      resetForm();
    }
  }, [editingCode, isOpen]);

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      minOrderValue: 0,
      maxDiscount: undefined,
      maxUses: undefined,
      status: 'active'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const promoCode: PromoCode = {
      id: editingCode?.id || Date.now().toString(),
      code: formData.code.toUpperCase(),
      description: formData.description,
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      minOrderValue: formData.minOrderValue || undefined,
      maxDiscount: formData.maxDiscount,
      maxUses: formData.maxUses,
      usedCount: editingCode?.usedCount || 0,
      status: formData.status,
      createdAt: editingCode?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingCode) {
      dispatch(updatePromoCode(promoCode));
    } else {
      dispatch(addPromoCode(promoCode));
    }

    onClose();
    resetForm();
  };

  const handleChange = (field: string, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {editingCode ? 'Edit Promo Code' : 'Create New Promo Code'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Promo Code *
            </label>
            <Input
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
              placeholder="SUMMER2025"
              required
              className="font-mono"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <Input
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Summer Sale - 25% off"
              required
            />
          </div>

          {/* Discount Type & Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Discount Type *
              </label>
              <select
                value={formData.discountType}
                onChange={(e) => handleChange('discountType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
                <option value="freeShipping">Free Shipping</option>
                <option value="buyXGetY">Buy X Get Y</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {formData.discountType === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
              </label>
              <Input
                type="number"
                value={formData.discountValue}
                onChange={(e) => handleChange('discountValue', parseFloat(e.target.value))}
                min="0"
                step={formData.discountType === 'percentage' ? '1' : '0.01'}
                required={formData.discountType !== 'freeShipping'}
                disabled={formData.discountType === 'freeShipping'}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date *
              </label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date *
              </label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Limits */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min Order ($)
              </label>
              <Input
                type="number"
                value={formData.minOrderValue}
                onChange={(e) => handleChange('minOrderValue', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Discount ($)
              </label>
              <Input
                type="number"
                value={formData.maxDiscount || ''}
                onChange={(e) => handleChange('maxDiscount', e.target.value ? parseFloat(e.target.value) : undefined)}
                min="0"
                step="0.01"
                placeholder="Unlimited"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Uses
              </label>
              <Input
                type="number"
                value={formData.maxUses || ''}
                onChange={(e) => handleChange('maxUses', e.target.value ? parseInt(e.target.value) : undefined)}
                min="1"
                placeholder="Unlimited"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingCode ? 'Update Code' : 'Create Code'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
