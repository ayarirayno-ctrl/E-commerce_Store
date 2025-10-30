import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { 
  Users, 
  Award, 
  Globe, 
  Heart, 
  Shield, 
  Truck, 
  Headphones, 
  Star,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const stats = [
    { label: 'Happy Customers', value: '10,000+', icon: Users },
    { label: 'Products Sold', value: '50,000+', icon: Award },
    { label: 'Countries Served', value: '25+', icon: Globe },
    { label: 'Years Experience', value: '5+', icon: Star },
  ];

  const values = [
    {
      title: 'Quality First',
      description: 'We carefully curate every product to ensure the highest quality standards.',
      icon: Award,
    },
    {
      title: 'Customer Focus',
      description: 'Your satisfaction is our priority. We go above and beyond to serve you.',
      icon: Heart,
    },
    {
      title: 'Trust & Security',
      description: 'Your data and transactions are protected with industry-leading security.',
      icon: Shield,
    },
    {
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to get your orders to you as fast as possible.',
      icon: Truck,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="About Us - Modern Store"
        description="Learn about our story, mission, and values. We're passionate about bringing you the best products with exceptional customer service since 2019."
        keywords="about us, our story, company mission, e-commerce, customer service"
        type="website"
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container-custom py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About Our Store
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              We&apos;re passionate about bringing you the best products at great prices,
              with exceptional customer service that makes shopping a pleasure.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Founded in 2019, our e-commerce store started with a simple mission: 
                to make online shopping better for everyone.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  From Humble Beginnings
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  What started as a small online store selling a few carefully selected products 
                  has grown into a trusted destination for thousands of customers worldwide. 
                  We believe that great products should be accessible to everyone.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our commitment to quality, customer service, and innovation has helped us 
                  build lasting relationships with our customers and partners.
                </p>
              </div>
              <div className="bg-gray-100 rounded-lg p-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-12 w-12 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Our Mission
                  </h4>
                  <p className="text-gray-600">
                    To provide exceptional products and service that exceed customer expectations, 
                    making every shopping experience memorable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and help us create
              the best possible experience for our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;re committed to providing you with the best shopping experience possible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Quality Guaranteed
              </h3>
              <p className="text-gray-600">
                Every product is carefully selected and tested to ensure it meets our high standards.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                24/7 Support
              </h3>
              <p className="text-gray-600">
                Our customer support team is always here to help you with any questions or concerns.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Fast Shipping
              </h3>
              <p className="text-gray-600">
                Get your orders delivered quickly with our reliable shipping partners worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover amazing products at great prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;






