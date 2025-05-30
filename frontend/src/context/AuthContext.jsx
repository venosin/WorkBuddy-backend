import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextStore';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState(null);

  const API_URL = 'http://localhost:4000/wb';

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedUserType = localStorage.getItem('userType');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setUserType(storedUserType);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setError('Error al autenticar');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Para manejar cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Extraer el tipo de usuario del mensaje (clients, employees, admin)
      const type = data.message.split(' ')[0];
      setUserType(type);
      
      // Guardar token y tipo de usuario
      localStorage.setItem('token', data.token);
      localStorage.setItem('userType', type);
      
      // Obtener datos del usuario según su tipo
      let userData;
      if (type === 'admin') {
        userData = { id: 'admin', name: 'Administrador', email };
      } else {
        // Obtener perfil del usuario según su tipo
        const profileResponse = await fetch(`${API_URL}/profile`, {
          headers: {
            'Authorization': `Bearer ${data.token}`
          },
          credentials: 'include'
        });
        
        if (profileResponse.ok) {
          userData = await profileResponse.json();
        } else {
          userData = { id: 'unknown', email };
        }
      }
      
      // Guardar datos del usuario
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { user: userData, token: data.token, userType: type };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Llamar al endpoint de logout
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Limpiar localStorage y estado
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      setUser(null);
      setUserType(null);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrarse');
      }

      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        userType,
        login,
        logout,
        register,
        isAuthenticated: !!user && !!localStorage.getItem('token'),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
