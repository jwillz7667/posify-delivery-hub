import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Classic Burger",
    price: 12.99,
    category: "Burgers",
    description: "Juicy beef patty with lettuce, tomato, and special sauce"
  },
  {
    id: 2,
    name: "Margherita Pizza",
    price: 14.99,
    category: "Pizza",
    description: "Fresh mozzarella, tomatoes, and basil"
  },
  {
    id: 3,
    name: "Caesar Salad",
    price: 9.99,
    category: "Salads",
    description: "Crisp romaine lettuce with parmesan and croutons"
  },
  // Add more items as needed
];

const Menu = () => {
  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-white">Menu Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold text-white">{category}</h2>
            {menuItems
              .filter(item => item.category === category)
              .map((item) => (
                <Card key={item.id} className="bg-accent hover:bg-accent/90 transition-colors cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-white">{item.name}</h3>
                        <p className="text-sm text-white/70">{item.description}</p>
                        <p className="text-lg font-semibold text-white mt-2">${item.price.toFixed(2)}</p>
                      </div>
                      <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                        <Plus size={20} />
                      </button>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;