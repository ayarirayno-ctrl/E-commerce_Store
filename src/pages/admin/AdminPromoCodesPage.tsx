import { PromoCodesManager } from '../../components/admin/PromoCodesManager';

export default function AdminPromoCodesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Promo Codes Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage promotional discount codes
          </p>
        </div>
      </div>

      <PromoCodesManager />
    </div>
  );
}
