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
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <button
              key={item.id}
              onClick={() => addToOrder(item)}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-accent">${item.price.toFixed(2)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Order Section */}
      <div className="w-96 bg-white rounded-lg p-6 shadow-lg flex flex-col">
        <div className="flex items-center space-x-2 mb-6">
          <ShoppingCart className="text-primary" />
          <h2 className="text-xl font-semibold">Current Order</h2>
        </div>
        
        <div className="flex-1 overflow-auto">
          {orderItems.map(item => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">${total.toFixed(2)}</span>
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