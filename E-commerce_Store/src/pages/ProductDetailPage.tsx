import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../contexts/AuthContext';
import { useRecommendations } from '../hooks/useRecommendations';
import { useProducts } from '../hooks/useProducts';
import EnhancedSEO from '../components/common/EnhancedSEO';
import Breadcrumbs from '../components/common/Breadcrumbs';
import StockAlert from '../components/product/StockAlert';
import { ImageZoom, ImageLightbox } from '../components/product/ImageZoom';
import { SocialShare } from '../components/common/SocialShare';
import ProductRecommendations from '../components/recommendations/ProductRecommendations';
import { generateProductSchema, generateBreadcrumbSchema } from '../utils/seoUtils';
import { 
  generateProductMetaDescription, 
  generateProductKeywords, 
  generateProductTitle,
  generateImageAlt
} from '../utils/seoMetaUtils';
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
import { addNotification } from '../store/slices/uiSlice';
import ProductVariantSelector from '../components/product/ProductVariantSelector';
import { ProductVariant } from '../types';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addItemToCart, isInCart, getItemQuantity } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { items: products } = useProducts();
  const { trackProductView, getYouMayAlsoLike } = useRecommendations();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

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
          // Track product view for recommendations
          trackProductView(productData);
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
  }, [id, trackProductView]);

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
    
    // If product has variants but none selected, show warning
    if (product.variants && product.variants.length > 0) {
      if (product.availableColors && !selectedColor) {
        dispatch(addNotification({
          type: 'warning',
          title: 'Select Color',
          message: 'Please select a color before adding to cart.',
          duration: 3000,
        }));
        return;
      }
      if (product.availableSizes && !selectedSize) {
        dispatch(addNotification({
          type: 'warning',
          title: 'Select Size',
          message: 'Please select a size before adding to cart.',
          duration: 3000,
        }));
        return;
      }
    }
    
    // Add to cart with selected variant
    for (let i = 0; i < quantity; i++) {
      addItemToCart(product, 1, selectedVariant || undefined);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    const maxStock = selectedVariant?.stock ?? product?.stock ?? 0;
    if (newQuantity < 1 || newQuantity > maxStock) return;
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

  // Calculate final price based on selected variant
  const finalPrice = selectedVariant?.price ?? discountPrice;
  const currentStock = selectedVariant?.stock ?? product.stock;

  const isInCartItem = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  // Generate structured data
  const productSchema = generateProductSchema({
    id: product.id,
    title: product.title,
    description: product.description,
    image: product.thumbnail,
    price: finalPrice,
    brand: product.brand,
    rating: stats?.averageRating,
    ratingCount: stats?.totalReviews,
    availability: currentStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://e-commerce-store-38qrmehtb-rayens-projects-6420fa79.vercel.app/' },
    { name: 'Products', url: 'https://e-commerce-store-38qrmehtb-rayens-projects-6420fa79.vercel.app/products' },
    { name: product.category, url: `https://e-commerce-store-38qrmehtb-rayens-projects-6420fa79.vercel.app/products?category=${product.category}` },
    { name: product.title, url: `https://e-commerce-store-38qrmehtb-rayens-projects-6420fa79.vercel.app/products/${product.id}` }
  ]);

  return (
    <>
      <EnhancedSEO
        title={generateProductTitle(product)}
        description={generateProductMetaDescription(product)}
        keywords={generateProductKeywords(product)}
        image={product.thumbnail}
        url={`https://e-commerce-store-38qrmehtb-rayens-projects-6420fa79.vercel.app/products/${product.id}`}
        type="product"
        structuredData={[productSchema, breadcrumbSchema]}
      />
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container-custom py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Breadcrumbs 
            items={[
              { label: 'Products', href: '/products' },
              { label: product.category, href: `/products?category=${product.category}` },
              { label: product.title }
            ]}
          />
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            size="sm"
          >
            Back
          </Button>
        </div>

        {/* Product Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div 
              className="aspect-square bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}
            >
              <ImageZoom
                src={product.images[selectedImage] || product.thumbnail}
                alt={generateImageAlt(product, selectedImage)}
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
                      alt={generateImageAlt(product, index)}
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
              {product.title}
            </h1>

            {/* Social Share */}
            <SocialShare
              url={window.location.href}
              title={product.title}
              description={product.description}
            />

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
              <span className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
                {formatPrice(finalPrice)}
              </span>
              {product.discountPercentage > 0 && !selectedVariant?.price && (
                <>
                  <span className="text-xl text-gray-500 dark:text-gray-400 line-through transition-colors">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm font-medium px-2.5 py-0.5 rounded-full transition-colors">
                    -{product.discountPercentage.toFixed(0)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock Alert */}
            <StockAlert stock={product.stock} lowStockThreshold={10} />

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors">
                {product.description}
              </p>
            </div>

            {/* Product Variants (Colors & Sizes) */}
            {(product.availableColors || product.availableSizes) && (
              <ProductVariantSelector
                colors={product.availableColors}
                sizes={product.availableSizes}
                variants={product.variants}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                onColorChange={setSelectedColor}
                onSizeChange={setSelectedSize}
                onVariantChange={setSelectedVariant}
              />
            )}

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {currentStock > 0 ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-medium">
                    In Stock ({currentStock} available)
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
            {currentStock > 0 && (
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
                      disabled={quantity >= currentStock}
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
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
              <p className="text-gray-600 dark:text-gray-300 transition-colors">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Product Recommendations */}
      {product && products.length > 0 && (
        <ProductRecommendations
          title="You May Also Like"
          products={getYouMayAlsoLike(product, products, 8)}
          type="similar"
        />
      )}

      {/* Image Lightbox */}
      {isLightboxOpen && (
        <ImageLightbox
          images={product.images}
          currentIndex={selectedImage}
          onClose={() => setIsLightboxOpen(false)}
          productTitle={product.title}
        />
      )}
    </div>
    </>
  );
};

export default ProductDetailPage;
