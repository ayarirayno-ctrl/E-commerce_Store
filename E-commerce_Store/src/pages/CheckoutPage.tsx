import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { usePromoCodes } from '../hooks/usePromoCodes';
import { useNotification } from '../hooks/useNotification';
import { formatPrice } from '../utils/formatters';
import { isValidEmail, isRequired } from '../utils/validators';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { PromoCodeInput, AppliedPromoCode } from '../components/promo/PromoCodeInput';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import { orderService } from '../services/orderService';
import type { CreateOrderData } from '../services/orderService';

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
  const { items, totalPrice, clearCartItems } = useCart();
  const { showSuccess, showError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
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

    // Required fields
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
    if (!isRequired(formData.cardNumber)) newErrors.cardNumber = 'Card number is required';
    if (!isRequired(formData.expiryDate)) newErrors.expiryDate = 'Expiry date is required';
    if (!isRequired(formData.cvv)) newErrors.cvv = 'CVV is required';
    if (!isRequired(formData.cardName)) newErrors.cardName = 'Cardholder name is required';

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
      // Prepare order data
      const orderData: CreateOrderData = {
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: 'credit_card', // Can be extended with actual payment gateway
        notes: `Customer: ${formData.firstName} ${formData.lastName}, Email: ${formData.email}, Phone: ${formData.phone}`,
      };

      // Create order via API
      const order = await orderService.createOrder(orderData);
      
      setOrderNumber(order.orderNumber);
      setShowSuccessModal(true);
      showSuccess(`Order ${order.orderNumber} placed successfully!`);
    } catch (error) {
      console.error('Order creation failed:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to create order. Please try again.';
      setErrors({ submit: errorMsg });
      showError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOrderSuccess = () => {
    clearCartItems();
    setShowSuccessModal(false);
    navigate('/');
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Information
                </h2>
                
                <Input
                  label="Cardholder Name"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  error={errors.cardName}
                  required
                />
                
                <Input
                  label="Card Number"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  error={errors.cardNumber}
                  placeholder="1234 5678 9012 3456"
                  leftIcon={<CreditCard className="h-4 w-4" />}
                  required
                  className="mt-4"
                />
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Expiry Date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    error={errors.expiryDate}
                    placeholder="MM/YY"
                    required
                  />
                  <Input
                    label="CVV"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    error={errors.cvv}
                    placeholder="123"
                    required
                  />
                </div>
                
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <Lock className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm text-green-800">
                      Your payment information is secure and encrypted
                    </span>
                  </div>
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
                  className="w-full mt-6"
                  size="lg"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : `Place Order - ${formatPrice(finalTotal)}`}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleOrderSuccess}
        title="Order Placed Successfully!"
        size="md"
      >
        <div className="text-center py-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Thank you for your order!
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-primary-600">{orderNumber}</p>
          </div>
          <p className="text-gray-600 mb-4">
            Your order has been placed successfully. You will receive a confirmation email at{' '}
            <span className="font-semibold">{formData.email}</span> shortly.
          </p>
          <div className="text-left bg-white border border-gray-200 rounded-lg p-4 mb-6 text-sm">
            <h4 className="font-semibold text-gray-900 mb-2">Order Summary</h4>
            <div className="space-y-1 text-gray-600">
              <div className="flex justify-between">
                <span>Items ({items.length})</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {appliedCode && discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCode.code})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(taxAmount)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
          <Button onClick={handleOrderSuccess} className="w-full">
            Continue Shopping
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CheckoutPage;
