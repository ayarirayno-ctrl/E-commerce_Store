import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { usePromoCodes } from '../hooks/usePromoCodes';
import { useNotification } from '../hooks/useNotification';
import { formatPrice } from '../utils/formatters';
import { isValidEmail, isRequired } from '../utils/validators';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { PromoCodeInput, AppliedPromoCode } from '../components/promo/PromoCodeInput';
import { CreditCard, Lock, ArrowRight, CheckCircle } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

interface FormErrors {
  [key: string]: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice } = useCart();
  const { showError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { appliedCode, discountAmount, getFinalTotal } = usePromoCodes();

  const shippingCost = totalPrice >= 50 ? 0 : 9.99;
  const taxRate = 0.08;
  const subtotal = totalPrice;
  const taxAmount = (subtotal - discountAmount) * taxRate;
  const finalTotal = getFinalTotal() + shippingCost + taxAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields (only shipping info, not payment - Stripe handles that)
    if (!isRequired(formData.firstName)) newErrors.firstName = 'First name is required';
    if (!isRequired(formData.lastName)) newErrors.lastName = 'Last name is required';
    if (!isRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!isRequired(formData.phone)) newErrors.phone = 'Phone number is required';
    if (!isRequired(formData.address)) newErrors.address = 'Address is required';
    if (!isRequired(formData.city)) newErrors.city = 'City is required';
    if (!isRequired(formData.state)) newErrors.state = 'State is required';
    if (!isRequired(formData.zipCode)) newErrors.zipCode = 'ZIP code is required';
    // Card fields are NOT required here - Stripe Checkout will handle payment

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare checkout data for Stripe
      const checkoutData = {
        items: items.map(item => ({
          product: item.product.id.toString(),
          name: item.product.title,
          description: item.product.title,
          image: item.product.thumbnail,
          price: item.product.price,
          quantity: item.quantity
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          street: formData.address,
          city: formData.city,
          postalCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone
        },
        billingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          street: formData.address,
          city: formData.city,
          postalCode: formData.zipCode,
          country: formData.country
        },
        email: formData.email,
        promoCode: appliedCode ? {
          code: appliedCode.code,
          discount: appliedCode.discountAmount,
          discountType: appliedCode.discountType
        } : undefined
      };

      // Create Stripe Checkout Session
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/stripe/create-checkout-session`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(checkoutData)
        }
      );

      console.log('Response status:', response.status);
      console.log('Response URL:', response.url);

      if (!response.ok) {
        const text = await response.text();
        console.error('Error response:', text);
        
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || 'Failed to create checkout session');
        } catch (parseError) {
          throw new Error(`Server error: ${response.status} - ${text.substring(0, 200)}`);
        }
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Checkout failed:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to proceed to payment. Please try again.';
      setErrors({ submit: errorMsg });
      showError(errorMsg);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-6">
            Add some items to your cart before checking out.
          </p>
          <Button onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Shipping Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                    required
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={errors.lastName}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    required
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                    required
                  />
                </div>
                
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={errors.address}
                  required
                  className="mt-4"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    error={errors.city}
                    required
                  />
                  <Input
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    error={errors.state}
                    required
                  />
                  <Input
                    label="ZIP Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    error={errors.zipCode}
                    required
                  />
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-blue-100 rounded-full p-2">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                      Secure Payment with Stripe
                    </h2>
                    <p className="text-sm text-gray-600">
                      You&apos;ll be redirected to Stripe&apos;s secure payment page
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Lock className="h-4 w-4 text-green-600" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>PCI-DSS compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Your card details are never stored on our servers</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                  <p className="text-xs text-gray-600 text-center">
                    <strong>Next step:</strong> Click &quot;Continue to Payment&quot; below to securely enter your card details on Stripe&apos;s checkout page
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>
                
                {/* Cart Items */}
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.totalPrice)}
                      </p>
                    </div>
                  ))}
                </div>
                
                {/* Totals */}
                <div className="space-y-2 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  {appliedCode && discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({appliedCode.code})</span>
                      <span className="font-medium">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">
                      {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">{formatPrice(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Promo Code Section */}
                <div className="border-t border-gray-200 pt-4">
                  {appliedCode ? (
                    <AppliedPromoCode />
                  ) : (
                    <PromoCodeInput compact />
                  )}
                </div>
                
                {errors.submit && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{errors.submit}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  size="lg"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Redirecting to Stripe...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Continue to Payment
                      <ArrowRight className="h-5 w-5" />
                      <span className="font-bold">{formatPrice(finalTotal)}</span>
                    </span>
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  By clicking &quot;Continue to Payment&quot;, you&apos;ll be securely redirected to Stripe to complete your purchase
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
