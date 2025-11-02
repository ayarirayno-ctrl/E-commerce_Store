import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ShoppingCart, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const PaymentCancelPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-600 px-8 py-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Payment Cancelled
            </h1>
            <p className="text-red-100 text-lg">
              Your order was not completed
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-8 space-y-6">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                Don&apos;t worry, no charges were made to your account.
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Why was my payment cancelled?
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  You clicked the back button or closed the payment window
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  The payment session timed out
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  You chose to cancel the transaction
                </li>
              </ul>
            </div>

            {/* What to do next */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                What would you like to do?
              </h3>
              <div className="grid gap-3">
                <Button
                  onClick={() => navigate('/cart')}
                  fullWidth
                  leftIcon={<ShoppingCart className="h-5 w-5" />}
                  className="justify-center"
                >
                  Return to Cart
                </Button>
                <Button
                  onClick={() => navigate('/checkout')}
                  variant="outline"
                  fullWidth
                  className="justify-center"
                >
                  Try Payment Again
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="ghost"
                  fullWidth
                  leftIcon={<ArrowLeft className="h-5 w-5" />}
                  className="justify-center"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>

            {/* Support */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Need help? Our support team is here for you
              </p>
              <a
                href="mailto:support@example.com"
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
