import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
}

const menuItems: MenuItem[] = [
  { id: '1', name: 'DN-CHICKEN', price: 19.95, category: 'Entrees' },
  { id: '2', name: 'Lamb Chops', price: 23.95, category: 'Entrees' },
  { id: '3', name: 'Ckn Teriyaki', price: 14.95, category: 'Entrees' },
  { id: '4', name: 'Brown Rice', price: 3.00, category: 'Sides' },
  { id: '5', name: 'White Rice', price: 2.00, category: 'Sides' },
];

const categories = ['All', 'Entrees', 'Sides', 'Beverages', 'Desserts'];

const POS = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const addToOrder = (item: MenuItem) => {
    setOrderItems(current => {
      const existingItem = current.find(i => i.id === item.id);
      if (existingItem) {
        return current.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setOrderItems(current =>
      current
        .map(item =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Function to get a neon color based on index
  const getNeonColor = (index: number) => {
    const colors = [
      'bg-[#8B5CF6]', // Vivid Purple
      'bg-[#D946EF]', // Magenta Pink
      'bg-[#F97316]', // Bright Orange
      'bg-[#0EA5E9]', // Ocean Blue
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="flex h-full gap-6">
      {/* Menu Section */}
      <div className="flex-1">
        <div className="mb-6 flex space-x-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === category
                  ? 'bg-accent text-white'
                  : 'bg-secondary/50 text-gray-300 hover:bg-secondary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {filteredItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => addToOrder(item)}
              className={`${getNeonColor(index)} p-4 rounded-lg shadow-lg hover:opacity-90 transition-all duration-200 text-white`}
            >
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-white/90">${item.price.toFixed(2)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Order Section */}
      <div className="w-96 bg-secondary/50 backdrop-blur-sm rounded-lg p-6 shadow-lg flex flex-col">
        <div className="flex items-center space-x-2 mb-6">
          <ShoppingCart className="text-accent" />
          <h2 className="text-xl font-semibold text-white">Current Order</h2>
        </div>
        
        <div className="flex-1 overflow-auto">
          {orderItems.map(item => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b border-white/10">
              <div>
                <p className="font-medium text-white">{item.name}</p>
                <p className="text-sm text-white/70">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="p-1 rounded-full hover:bg-accent/20 text-white"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center text-white">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="p-1 rounded-full hover:bg-accent/20 text-white"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between mb-4">
            <span className="font-semibold text-white">Total</span>
            <span className="font-semibold text-white">${total.toFixed(2)}</span>
          </div>
          <button className="w-full bg-accent text-white py-3 rounded-lg hover:bg-accent/90 transition-colors">
            Complete Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;