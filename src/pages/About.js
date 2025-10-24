import React from 'react';

const About = () => {
  const stats = [
    { number: '10+', label: 'Years of Excellence' },
    { number: '50K+', label: 'Happy Customers' },
    { number: '1000+', label: 'Fashion Items' },
    { number: '50+', label: 'Brand Partners' }
  ];

  const values = [
    {
      title: 'Quality First',
      description: 'We source only the finest materials and work with skilled artisans to ensure every piece meets our high standards.',
      icon: '✨'
    },
    {
      title: 'Affordable Fashion',
      description: 'Fashion should be accessible to everyone. We offer competitive prices without compromising on quality.',
      icon: '💎'
    },
    {
      title: 'Sustainable Practices',
      description: 'We are committed to ethical sourcing and sustainable practices in our supply chain.',
      icon: '🌱'
    },
    {
      title: 'Customer Focus',
      description: 'Your satisfaction is our priority. We provide exceptional service and support at every step.',
      icon: '❤️'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">About Harshee's Fashion</h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Founded with a passion for bringing the latest fashion trends to everyone, 
                Harshee's Fashion has been a trusted name in the industry for over a decade.
              </p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=500&fit=crop" 
                alt="Fashion Store Interior" 
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
          <div className="prose prose-lg text-gray-600 space-y-6">
            <p>
              Harshee's Fashion began as a small boutique with a simple vision: to make high-quality, 
              trendy fashion accessible to everyone. What started as a passion project has grown into 
              a beloved brand that serves thousands of customers across the country.
            </p>
            <p>
              We believe that fashion is more than just clothing – it's a form of self-expression, 
              confidence, and creativity. Our carefully curated collections feature pieces from emerging 
              designers and established brands, ensuring that you always have access to the freshest 
              styles and highest quality garments.
            </p>
            <p>
              Today, we continue to evolve and grow, always staying true to our core values of quality, 
              affordability, and exceptional customer service. We're not just selling clothes; 
              we're helping people express their unique style and feel confident in their own skin.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="text-white">
                <h3 className="text-4xl font-bold mb-2">{stat.number}</h3>
                <p className="text-pink-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-16 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind Harshee's Fashion who make it all possible.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face" 
                alt="Harshee Patel" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Harshee Patel</h4>
              <p className="text-pink-600 font-medium mb-3">Founder & Creative Director</p>
              <p className="text-gray-600">
                With over 15 years in fashion, Harshee leads our creative vision and ensures 
                every collection reflects the latest trends.
              </p>
            </div>
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face" 
                alt="Raj Kumar" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Raj Kumar</h4>
              <p className="text-pink-600 font-medium mb-3">Operations Manager</p>
              <p className="text-gray-600">
                Raj ensures smooth operations and manages our supply chain, making sure 
                every order reaches our customers on time.
              </p>
            </div>
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face" 
                alt="Priya Singh" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Priya Singh</h4>
              <p className="text-pink-600 font-medium mb-3">Customer Relations Head</p>
              <p className="text-gray-600">
                Priya leads our customer service team, ensuring every customer has an 
                exceptional experience with our brand.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
