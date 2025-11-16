import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CreditCard, Lock } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

// Charger Stripe avec la clé publique
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface Address {
  fullName?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image?: string;
}

interface StripeCheckoutFormProps {
  amount: number;
  items: CartItem[];
  shippingAddress: Address;
  billingAddress: Address;
  onSuccess: (sessionId: string) => void;
  onError: (error: string) => void;
}

const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({
  amount,
  items,
  shippingAddress,
  billingAddress,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Créer une session Checkout sur le backend
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Ajouter l'Authorization seulement si un token existe
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items,
          shippingAddress,
          billingAddress,
          email: user?.email || shippingAddress.email,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Payment failed');
      }

      const { sessionId, url } = await response.json();

      // Rediriger vers Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        onSuccess(sessionId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed. Please try again.';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Element */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <CreditCard className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Card Information
          </h3>
        </div>

        <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
          <CardElement options={cardElementOptions} />
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>
          Your payment information is encrypted and secure. We use Stripe for processing payments.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={loading}
        disabled={!stripe || loading}
        className="font-semibold"
      >
        {loading ? 'Processing...' : `Pay €${amount.toFixed(2)}`}
      </Button>

      {/* Test Card Info (Development only) */}
      {import.meta.env.DEV && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            🧪 Test Card (Development)
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Card: 4242 4242 4242 4242 | Exp: Any future date | CVC: Any 3 digits
          </p>
        </div>
      )}
    </form>
  );
};

interface StripeCheckoutProps {
  amount: number;
  items: CartItem[];
  shippingAddress: Address;
  billingAddress: Address;
  onSuccess: (sessionId: string) => void;
  onError: (error: string) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeCheckoutForm {...props} />
    </Elements>
  );
};

export default StripeCheckout;
