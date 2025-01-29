import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Lock, User, Store } from 'lucide-react';

const Settings = () => {
  const settingsSections = [
    {
      title: 'Profile Settings',
      icon: User,
      description: 'Manage your account information and preferences',
    },
    {
      title: 'Security',
      icon: Lock,
      description: 'Update password and security settings',
    },
    {
      title: 'Notifications',
      icon: Bell,
      description: 'Configure your notification preferences',
    },
    {
      title: 'Store Settings',
      icon: Store,
      description: 'Manage store hours and business information',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section) => (
          <Card 
            key={section.title} 
            className="bg-primary/50 border-white/10 hover:bg-primary/60 transition-colors cursor-pointer"
          >
            <CardHeader className="flex flex-row items-center space-x-4">
              <div className="p-2 rounded-lg bg-accent/20">
                <section.icon className="h-6 w-6 text-accent" />
              </div>
              <div>
                <CardTitle className="text-white">{section.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">{section.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Settings;