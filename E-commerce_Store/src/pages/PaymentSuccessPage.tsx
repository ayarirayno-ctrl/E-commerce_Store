import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { LoadingAnimation } from '../components/common/LoadingAnimation';
import { useCart } from '../hooks/useCart';

interface OrderData {
  status: string;
  customerEmail: string;
  amountTotal: number;
  currency: string;
}

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCartItems } = useCart();

  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clear cart on successful payment
    if (sessionId) {
      clearCartItems();
    }
    
    const fetchOrderDetails = async () => {
      if (!sessionId) {
        setError('No session ID found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/stripe/session/${sessionId}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        setOrderData(data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId, clearCartItems]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingAnimation size="lg" text="Verifying payment..." variant="pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error Verifying Payment
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={() => navigate('/')} fullWidth>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 animate-bounce">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-green-100 text-lg">
              Thank you for your order
            </p>
          </div>

          {/* Order Details */}
          <div className="px-8 py-8 space-y-6">
            {/* Amount */}
            <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-6">
              <p className="text-gray-600 dark:text-gray-400 mb-2">Amount Paid</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                €{orderData?.amountTotal?.toFixed(2) || '0.00'}
              </p>
            </div>

            {/* Status Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <Package className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Order Confirmed
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your order is being processed
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Confirmation Sent
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {orderData?.customerEmail || 'Email sent'}
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                What&apos;s Next?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    You&apos;ll receive an order confirmation email shortly
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Track your order status in your account
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Estimated delivery: 3-5 business days
                  </span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={() => navigate('/orders')}
                fullWidth
                className="flex-1"
              >
                View My Orders
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                fullWidth
                className="flex-1"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-center text-gray-600 dark:text-gray-400 mt-8 text-sm">
          Need help? Contact our support team at{' '}
          <a href="mailto:support@example.com" className="text-primary-600 dark:text-primary-400 hover:underline">
            support@example.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
