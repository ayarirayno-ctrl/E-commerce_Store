import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { 
  selectAllPromoCodes, 
  deletePromoCode 
} from '../../store/slices/promoCodesSlice';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import Button from '../ui/Button';
import { PromoCodeModal } from './PromoCodeModal';
import type { PromoCode } from '../../types/promoCode';

export function PromoCodesManager() {
  const dispatch = useAppDispatch();
  const promoCodes = useAppSelector(selectAllPromoCodes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);

  const handleEdit = (code: PromoCode) => {
    setEditingCode(code);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingCode(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCode(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this promo code?')) {
      dispatch(deletePromoCode(id));
    }
  };

  const getStatusBadge = (code: PromoCode) => {
    const now = new Date();
    const end = new Date(code.endDate);

    if (code.status === 'inactive') return '⚫ Inactive';
    if (end < now) return '🔴 Expired';
    if (code.maxUses && code.usedCount >= code.maxUses) return '🟠 Limit';
    return '🟢 Active';
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Promo Codes ({promoCodes.length})</h3>
          </div>
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={handleCreate}>
            New Code
          </Button>
        </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Code</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Discount</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Uses</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Status</th>
              <th className="px-4 py-2 text-right font-medium text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {promoCodes.map((code) => (
              <tr key={code.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3">
                  <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                    {code.code}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-900 dark:text-white">
                  {code.discountType === 'percentage' && `${code.discountValue}%`}
                  {code.discountType === 'fixed' && `$${code.discountValue}`}
                  {code.discountType === 'freeShipping' && 'Free Ship'}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {code.usedCount}
                  {code.maxUses && ` / ${code.maxUses}`}
                </td>
                <td className="px-4 py-3 text-sm">
                  {getStatusBadge(code)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(code)}
                      className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(code.id)}
                      className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {promoCodes.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No promo codes yet</p>
        </div>
      )}
    </div>

    <PromoCodeModal 
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      editingCode={editingCode}
    />
  </>
  );
}
