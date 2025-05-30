import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar - posición absoluta para que no afecte el layout */}
      <div className="fixed left-0 top-0 bottom-0 z-20">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      
      {/* Main Content - con margen izquierdo fijo */}
      <div className="flex flex-col w-full pl-64">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-auto w-full">
          <div className="w-full p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
