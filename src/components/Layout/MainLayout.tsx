import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { LogoutButton } from "../LogoutButton";
import { useAuth } from "@/contexts/AuthContext";
import { UserCircle } from 'lucide-react';

const MainLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-secondary">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-secondary p-4 flex justify-between items-center border-b border-border">
          <div className="flex items-center gap-2 text-white">
            <UserCircle className="h-6 w-6" />
            <div className="flex flex-col">
              <span className="font-medium">{user?.name}</span>
              <span className="text-xs text-white/70 capitalize">{user?.role}</span>
            </div>
          </div>
          {user && <LogoutButton />}
        </header>
        <main className="flex-1 overflow-auto p-8 text-primary">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;