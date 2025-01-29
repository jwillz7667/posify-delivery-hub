import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Map from '../components/Map';

interface DeliveryOrder {
  id: number;
  customer: string;
  address: string;
  items: string[];
  total: number;
  status: 'pending' | 'in-progress' | 'delivered';
  coordinates: [number, number];
}

const deliveryOrders: DeliveryOrder[] = [
  {
    id: 1,
    customer: "John Doe",
    address: "123 Main St, City",
    items: ["Classic Burger", "Fries"],
    total: 18.99,
    status: "pending",
    coordinates: [-74.006, 40.7128] // NYC coordinates
  },
  {
    id: 2,
    customer: "Jane Smith",
    address: "456 Park Ave, City",
    items: ["Margherita Pizza"],
    total: 14.99,
    status: "in-progress",
    coordinates: [-73.935242, 40.730610] // Different NYC location
  },
];

const Delivery = () => {
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);

  return (
    <div className="flex h-full gap-6">
      {/* Delivery Orders List */}
      <div className="w-1/3 overflow-auto">
        <h2 className="text-2xl font-bold mb-4 text-white">Active Deliveries</h2>
        <div className="space-y-4">
          {deliveryOrders.map((order) => (
            <Card 
              key={order.id}
              className={`cursor-pointer transition-all ${
                selectedOrder?.id === order.id 
                  ? 'bg-accent text-white' 
                  : 'bg-secondary hover:bg-accent/20'
              }`}
              onClick={() => setSelectedOrder(order)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{order.customer}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'pending' ? 'bg-warning/20 text-warning' :
                    order.status === 'in-progress' ? 'bg-accent/20 text-accent' :
                    'bg-success/20 text-success'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm opacity-80">{order.address}</p>
                <div className="mt-2">
                  <p className="text-sm opacity-80">Items:</p>
                  <ul className="text-sm list-disc list-inside opacity-80">
                    {order.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <p className="mt-2 font-semibold">${order.total.toFixed(2)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <Map selectedOrder={selectedOrder} orders={deliveryOrders} />
      </div>
    </div>
  );
};

export default Delivery;