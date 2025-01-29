import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">$12,345</p>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Orders Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">48</p>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">$257</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Weekly Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#ffffff80" />
                <YAxis stroke="#ffffff80" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1F2C',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white'
                  }}
                />
                <Bar dataKey="sales" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;