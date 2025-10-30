import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../contexts/AuthContext';
import SEO from '../components/common/SEO';
import { fetchProductById } from '../store/api/productsApi';
import { Product } from '../types';
import { formatPrice } from '../utils/formatters';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import { RatingSummary } from '../components/reviews/RatingSummary';
import { ReviewsList } from '../components/reviews/ReviewsList';
import { ReviewForm } from '../components/reviews/ReviewForm';
import { ArrowLeft, ShoppingCart, Star, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import mockReviews from '../data/reviews.json';
import { setReviews } from '../store/slices/reviewsSlice';
import { useAppDispatch } from '../store';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addItemToCart, isInCart, getItemQuantity } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Reviews hook
  const productIdNum = id ? parseInt(id) : undefined;
  const {
    reviews,
    stats,
    filters,
    updateFilters,
    submitReview,
    markHelpful,
    isHelpful,
  } = useReviews(productIdNum);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const productData = await fetchProductById(parseInt(id));
        if (productData) {
          setProduct(productData);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Load mock reviews on mount
  useEffect(() => {
    // Type assertion with proper interface
    dispatch(setReviews(mockReviews.reviews as unknown as import('../types/product').Review[]));
  }, [dispatch]);

  const handleSubmitReview = (data: { rating: 1 | 2 | 3 | 4 | 5; title?: string; comment: string }) => {
    if (!productIdNum || !user) return;

    submitReview({
      productId: productIdNum,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      verifiedPurchase: true, // Could check if user actually purchased
    });

    setShowReviewForm(false);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      addItemToCart(product);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > (product?.stock || 0)) return;
    setQuantity(newQuantity);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading product..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Product not found'}
          </h2>
          <Button onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const discountPrice = product.discountPercentage > 0 
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;

  const isInCartItem = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  return (
    <>
      <SEO
        title={product.title}
        description={product.description}
        keywords={`${product.category}, ${product.brand}, ${product.title}`}
        image={product.thumbnail}
        type="product"
        price={discountPrice}
        currency="EUR"
        availability={product.stock > 0 ? 'in stock' : 'out of stock'}
        productId={product.id.toString()}
      />
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <img
                src={product.images[selectedImage] || product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg border-2 overflow-hidden transition-colors duration-200 ${
                      selectedImage === index
                        ? 'border-primary-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            <div className="text-sm text-primary-600 font-medium uppercase tracking-wide">
              {product.brand}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  {product.rating} ({product.stock} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(discountPrice)}
              </span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    -{product.discountPercentage.toFixed(0)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.stock > 0 ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-700 font-medium">
                    Out of Stock
                  </span>
                </>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1"
                    size="lg"
                    leftIcon={<ShoppingCart className="h-5 w-5" />}
                  >
                    {isInCartItem ? (
                      `In Cart (${cartQuantity})`
                    ) : (
                      'Add to Cart'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-4"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-4"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Truck className="h-6 w-6 text-primary-600" />
                <div>
                  <div className="font-medium text-gray-900">Free Shipping</div>
                  <div className="text-sm text-gray-600">On orders over $50</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-primary-600" />
                <div>
                  <div className="font-medium text-gray-900">1 Year Warranty</div>
                  <div className="text-sm text-gray-600">Full coverage</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="h-6 w-6 text-primary-600" />
                <div>
                  <div className="font-medium text-gray-900">30 Day Returns</div>
                  <div className="text-sm text-gray-600">No questions asked</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>

          {/* Rating Summary */}
          {stats && stats.totalReviews > 0 && (
            <RatingSummary stats={stats} />
          )}

          {/* Review Form */}
          {isAuthenticated ? (
            showReviewForm ? (
              <ReviewForm
                productId={productIdNum!}
                onSubmit={handleSubmitReview}
                onCancel={() => setShowReviewForm(false)}
              />
            ) : (
              <div className="text-center py-8">
                <Button onClick={() => setShowReviewForm(true)}>
                  Write a Review
                </Button>
              </div>
            )
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">Please sign in to write a review</p>
              <Button variant="outline" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length > 0 && (
            <ReviewsList
              reviews={reviews}
              currentUserId={user?.id}
              filters={filters}
              onFilterChange={updateFilters}
              onMarkHelpful={markHelpful}
              isHelpful={isHelpful}
            />
          )}

          {reviews.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductDetailPage;
