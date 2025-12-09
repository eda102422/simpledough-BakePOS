import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, Shield, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-100 via-orange-100 to-pink-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Fresh <span className="text-amber-600">Donuts</span>
                <br />
                Made with <span className="text-pink-600">Love</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Indulge in our handcrafted donuts made fresh daily. From party sets to mini treats, 
                we have something delicious for every occasion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {user ? (
                  <Link
                    to="/menu"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <ShoppingBag className="w-6 h-6" />
                    Order Now
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all border-2 border-gray-200 shadow-lg"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://i0.wp.com/simplybeautifuleating.com/wp-content/uploads/2024/04/8DDC2C3A-2627-44AB-A3AB-D2DB356BA7A62015-06-02_17-58-00_010-2023-11-09T15_19_31.176-1.jpeg?resize=1638%2C2048&ssl=1"
                  alt="Delicious donuts"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Simple Dough?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to delivering the freshest, most delicious donuts with exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Made Fresh Daily</h3>
              <p className="text-gray-600">
                All our donuts are handcrafted fresh every morning using premium ingredients.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable delivery to bring fresh donuts right to your doorstep.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-gray-600">
                We maintain the highest quality standards in every donut we make.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Ordering</h3>
              <p className="text-gray-600">
                Simple online ordering with customization options for your perfect treat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Delicious Varieties</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From party sets to individual treats, we have the perfect donuts for every occasion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Party Sets */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <img
                src="https://doughnuttime.eu/cdn/shop/files/square_DTB_EmmaPharaoh_14May25_403.jpg?v=1754474820"
                alt="Party Sets"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Party Sets</h3>
                <p className="text-gray-600 mb-4">
                  Perfect for celebrations and gatherings. Available in 30 and 40 piece sets.
                </p>
                <div className="text-amber-600 font-semibold text-lg">Starting at ₱250</div>
              </div>
            </div>

            {/* Messy Donuts */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <img
                src="https://s3-media0.fl.yelpcdn.com/bphoto/fJtzYXeHCCNcYN7sswuIaw/348s.jpg"
                alt="Messy Donuts"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">🤤 Messy Donuts</h3>
                <p className="text-gray-600 mb-4">
                  Indulgent treats with multiple flavor options. Choose up to 2 flavors per order.
                </p>
                <div className="text-amber-600 font-semibold text-lg">Starting at ₱65</div>
              </div>
            </div>

            {/* Mini Donuts */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <img
                src="https://www.sugarhero.com/wp-content/uploads/2011/03/chocolate-doughnuts-3sq-featured-image.jpg"
                alt="Mini Donuts"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">✨ Mini Donuts</h3>
                <p className="text-gray-600 mb-4">
                  Bite-sized perfection with classic and premium topping options.
                </p>
                <div className="text-amber-600 font-semibold text-lg">Starting at ₱75</div>
              </div>
            </div>
          </div>

          {user && (
            <div className="text-center mt-12">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <ShoppingBag className="w-6 h-6" />
                View Full Menu
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Satisfy Your Cravings?
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Join thousands of happy customers who trust Simple Dough for their donut needs.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-amber-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                Get Started Today
              </Link>
              <Link
                to="/login"
                className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-amber-600 transition-all transform hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;