import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  Truck, 
  Menu as MenuIcon, 
  BarChart3, 
  Settings,
  Home,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: ShoppingCart, label: 'POS', path: '/pos' },
    { icon: Truck, label: 'Delivery', path: '/delivery' },
    { icon: MenuIcon, label: 'Menu', path: '/menu' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div 
      className={`h-screen bg-primary p-4 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-24' : 'w-64'
      }`}
    >
      <div className="mb-8 flex items-center justify-between">
        <h1 className={`text-2xl font-bold text-white transition-opacity duration-300 ${
          isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
        }`}>
          POS System
        </h1>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-accent/20"
        >
          {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>
      <nav className="flex-1">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-accent text-white'
                      : 'text-white/70 hover:bg-accent/20 hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <item.icon size={28} />
                  <span className={`transition-opacity duration-300 ${
                    isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;