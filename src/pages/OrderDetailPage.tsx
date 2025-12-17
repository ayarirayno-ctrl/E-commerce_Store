import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/formatters';
import { orderService } from '../services/orderService';
import { useCart } from '../hooks/useCart';
import { Order } from '../types';
import Loading from '../components/ui/Loading';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { ArrowLeft, Package, Truck, MapPin, CreditCard, Calendar, RefreshCcw } from 'lucide-react';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItemToCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadOrder = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const orderData = await orderService.getOrderById(id);
      setOrder(orderData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!id || !order) return;
    
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setCancelling(true);
      await orderService.cancelOrder(id);
      await loadOrder(); // Reload order to show updated status
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const handleReorder = async () => {
    if (!order) return;

    try {
      setReordering(true);
      // Add all items to cart
      for (const item of order.items) {
        await addItemToCart({
          id: typeof item.product === 'string' ? parseInt(item.product) : 0,
          title: item.name,
          description: '',
          price: item.price,
          discountPercentage: 0,
          rating: 0,
          stock: 100, // Assume stock available
          brand: '',
          category: '',
          thumbnail: item.image,
          images: [item.image],
        }, item.quantity);
      }
      navigate('/cart');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reorder');
    } finally {
      setReordering(false);
    }
  };

  const getStatusColor = (status: string): 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'info';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Order not found'}
          </h2>
          <Button onClick={() => navigate('/orders')}>
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const orderStatus = order.orderStatus || order.status;
  const canCancel = orderStatus === 'pending' || orderStatus === 'processing';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/orders')}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Orders
          </Button>
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={handleReorder}
              loading={reordering}
              disabled={reordering}
              leftIcon={<RefreshCcw className="h-4 w-4" />}
            >
              Order Again
            </Button>
            {canCancel && (
              <Button
                variant="outline"
                onClick={handleCancelOrder}
                loading={cancelling}
                disabled={cancelling}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Order {order.orderNumber}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</span>
              </div>
            </div>
            <Badge variant={getStatusColor(order.orderStatus || order.status)}>
              {(order.orderStatus || order.status).charAt(0).toUpperCase() + (order.orderStatus || order.status).slice(1)}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Amount</div>
              <div className="text-xl font-bold text-gray-900">{formatPrice(order.total || order.totalPrice || 0)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Payment Status</div>
              <Badge variant={(order.paymentStatus === 'paid' || order.isPaid) ? 'success' : 'warning'}>
                {order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : (order.isPaid ? 'Paid' : 'Pending')}
              </Badge>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Payment Method</div>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-gray-600" />
                <span className="text-gray-900">{order.paymentMethod.replace('_', ' ').toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(order.subtotal || order.itemsPrice || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">{formatPrice(order.shippingCost || order.shippingPrice || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">{formatPrice(order.tax || order.taxPrice || 0)}</span>
                </div>
                {(order.discount || 0) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">-{formatPrice(order.discount || 0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>{formatPrice(order.total || order.totalPrice || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping & Billing Info */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Shipping Address
              </h2>
              <div className="text-sm text-gray-700 space-y-1">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''} {order.shippingAddress.zipCode || order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Billing Address */}
            {order.billingAddress && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Billing Address
                </h2>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>{order.billingAddress.street}</p>
                  <p>{order.billingAddress.city}{order.billingAddress.state ? `, ${order.billingAddress.state}` : ''} {order.billingAddress.zipCode || order.billingAddress.postalCode}</p>
                  <p>{order.billingAddress.country}</p>
                </div>
              </div>
            )}

            {order.notes && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Order Notes</h2>
                <p className="text-sm text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
