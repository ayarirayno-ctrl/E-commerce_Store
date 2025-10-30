import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitted(true);
    setLoading(false);
    setFormData({ name: '', email: '', subject: '', message: '' });

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      content: 'Nabeul, Tunisia',
      link: 'https://www.google.com/maps/place/Nabeul%E2%80%8E/@36.4528343,10.6741417,13z/data=!3m1!4b1!4m6!3m5!1s0x13029895efbdd3d3:0x2e5d60d1569ce4fe!8m2!3d36.4512893!4d10.7356634!16zL20vMGIxcWpo?entry=ttu&g_ep=EgoyMDI1MTAyNy4wIKXMDSoASAFQAw%3D%3D',
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+216 94 816 735',
      link: 'tel:+21694816735',
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: 'ayarirayen539@gmail.com',
      link: 'mailto:ayarirayen539@gmail.com',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                const content = info.link ? (
                  <a
                    href={info.link}
                    target={info.icon === MapPin ? '_blank' : undefined}
                    rel={info.icon === MapPin ? 'noopener noreferrer' : undefined}
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-gray-600">{info.content}</p>
                );
                
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                      {content}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Business Hours */}
            <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Business Hours</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium text-red-600">Closed</span>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="mt-6">
              <a
                href="/faq"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
              >
                View Frequently Asked Questions →
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-green-800">
                    Thank you for your message! We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={loading}
                >
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-6 text-sm text-gray-500">
                * Required fields. We respect your privacy and will never share your information.
              </p>
            </div>
          </div>
        </div>

        {/* Map Section (Placeholder) */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Location</h2>
          <div className="bg-gray-200 rounded-lg overflow-hidden" style={{ height: '400px' }}>
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">Map Integration Placeholder</p>
                <p className="text-sm mt-2">Google Maps or Mapbox can be integrated here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
