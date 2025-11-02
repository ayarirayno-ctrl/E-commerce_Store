import React from 'react';
import EnhancedSEO from '../components/common/EnhancedSEO';
import { generateOrganizationSchema } from '../utils/seoUtils';
import { ShoppingBag, Users, Shield, Truck, Star, Heart } from 'lucide-react';

const AboutPage: React.FC = () => {
  const organizationSchema = generateOrganizationSchema();

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedSEO 
        title="About Us - E-commerce Family's"
        description="Learn more about E-commerce Family's - your trusted online shopping destination for quality products, fast delivery, and exceptional customer service. We're a family that puts your family first."
        keywords="about us, e-commerce family, online shopping, quality products, customer service, fast delivery, trust, security"
        url="https://e-commerce-store-38qrmehtb-rayens-projects-6420fa79.vercel.app/about"
        type="website"
        structuredData={organizationSchema}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              🌐 Welcome to E-commerce Family&apos;s
            </h1>
            <p className="text-xl md:text-2xl text-primary-100">
              Your All-in-One Online Shopping Destination
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
                Introduction
              </h2>
              
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                <p className="text-lg">
                  Welcome to <span className="font-bold text-primary-600">E-commerce Family&apos;s</span>, 
                  your all-in-one online shopping destination designed to make buying and selling easier, faster, 
                  and more enjoyable. Our platform connects families, individuals, and businesses by offering a 
                  wide range of quality products — from fashion and electronics to home essentials and more.
                </p>

                <p className="text-lg">
                  At <span className="font-bold text-primary-600">E-commerce Family&apos;s</span>, we believe 
                  shopping should feel like being part of a family: trusted, comfortable, and accessible to everyone. 
                  With a user-friendly interface, secure payment options, and personalized recommendations, we aim 
                  to create a seamless online experience that meets your daily needs and exceeds your expectations.
                </p>

                <p className="text-lg font-semibold text-primary-700">
                  Join the E-commerce Family&apos;s community today — where convenience, trust, and satisfaction 
                  come together in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              What Makes Us Different
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Value 1 */}
              <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Family First</h3>
                <p className="text-gray-700">
                  We treat every customer like family, providing personalized support and care throughout your shopping journey.
                </p>
              </div>

              {/* Value 2 */}
              <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Trust & Security</h3>
                <p className="text-gray-700">
                  Your privacy and security are our top priorities. Shop with confidence using our encrypted payment system.
                </p>
              </div>

              {/* Value 3 */}
              <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-6">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Delivery</h3>
                <p className="text-gray-700">
                  Get your orders delivered quickly with our reliable shipping partners and real-time tracking.
                </p>
              </div>

              {/* Value 4 */}
              <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-6">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Products</h3>
                <p className="text-gray-700">
                  Every product is carefully selected and verified to ensure you receive only the best quality items.
                </p>
              </div>

              {/* Value 5 */}
              <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Wide Selection</h3>
                <p className="text-gray-700">
                  Browse thousands of products across multiple categories to find exactly what you need for your family.
                </p>
              </div>

              {/* Value 6 */}
              <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-6">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Customer Care</h3>
                <p className="text-gray-700">
                  Our dedicated support team is always here to help you with any questions or concerns you may have.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Join Our Family?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Start shopping today and experience the E-commerce Family&apos;s difference!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/products" 
                className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100 active:bg-gray-800 active:text-white transition-colors"
              >
                Start Shopping
              </a>
              <a 
                href="/contact" 
                className="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-primary-600 active:bg-gray-200 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;






