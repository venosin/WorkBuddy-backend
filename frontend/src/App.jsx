import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AuthProvider from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import MainLayout from './layouts/MainLayout'
import Login from './views/Login'
import Dashboard from './views/Dashboard'
import Users from './views/Users'
import Orders from './views/Orders'
import Inventory from './views/Inventory'
import Discounts from './views/Discounts'
import Offers from './views/Offers' // Importamos el nuevo componente Offers

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/statistics" element={<div className="p-4">Página de Estadísticas</div>} />
              <Route path="/users" element={<Users />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/discounts" element={<Discounts />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/settings" element={<div className="p-4">Página de Configuración</div>} />
            </Route>
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
