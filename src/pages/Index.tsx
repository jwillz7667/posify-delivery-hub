import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Truck, BarChart3 } from 'lucide-react';

const Index = () => {
  const cards = [
    {
      title: 'Point of Sale',
      description: 'Process orders and manage transactions',
      icon: ShoppingCart,
      link: '/pos',
      color: 'bg-blue-500',
    },
    {
      title: 'Delivery Dashboard',
      description: 'Track and manage deliveries',
      icon: Truck,
      link: '/delivery',
      color: 'bg-green-500',
    },
    {
      title: 'Analytics',
      description: 'View sales and performance metrics',
      icon: BarChart3,
      link: '/analytics',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to POS System</h1>
        <p className="text-gray-600 mt-2">Select a module to get started</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="block group"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <card.icon className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {card.title}
              </h3>
              <p className="text-gray-600">
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Index;