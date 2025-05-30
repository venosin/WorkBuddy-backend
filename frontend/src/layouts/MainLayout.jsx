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
    <div className="flex h-screen bg-white">
      {/* Sidebar con ancho fijo */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-primary z-20">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </aside>
      
      {/* Contenido principal que ocupa todo el resto del espacio */}
      <div className="absolute left-64 right-0 flex flex-col min-h-screen">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-grow overflow-auto">
          <div className="container mx-auto px-4 py-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
